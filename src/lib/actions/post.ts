"use server";

import { prisma } from "@/lib/prisma";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
} from "../validations/post";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { withAuth, withoutAuth } from "./auth-handlers";

/**
 * 게시글 생성 서버 액션
 * 인증된 사용자만 게시글을 작성할 수 있음
 */
export async function createPost(data: CreatePostInput) {
  console.log("createPost 함수 호출됨, 데이터:", JSON.stringify(data));

  const handler = await withAuth<typeof createPostSchema, { id: string }>(
    createPostSchema,
    async (data: CreatePostInput, userId: string) => {
      try {
        console.log("인증 성공, 사용자 ID:", userId);

        // 게시글 생성
        const post = await prisma.post.create({
          data: {
            userId,
            content: data.content,
            contentHtml: data.contentHtml || "<p></p>",
            preview: data.preview || null,
          },
        });

        console.log("게시글 생성 성공, ID:", post.id);

        // 캐시 갱신
        revalidatePath("/");

        return { id: post.id };
      } catch (error) {
        console.error("게시글 생성 중 오류 발생:", error);
        throw new Error("게시글을 생성하는 중 오류가 발생했습니다.");
      }
    }
  );

  return handler(data);
}

/**
 * 게시글 수정 서버 액션
 * 인증된 사용자만 자신의 게시글을 수정할 수 있음
 */
export async function updatePost(data: UpdatePostInput) {
  const handler = await withAuth<typeof updatePostSchema, { id: string }>(
    updatePostSchema,
    async (data: UpdatePostInput, userId: string) => {
      try {
        // 게시글 소유자 확인
        const post = await prisma.post.findUnique({
          where: { id: data.id },
          select: { userId: true },
        });

        if (!post) {
          throw new Error("게시글을 찾을 수 없습니다.");
        }

        if (post.userId !== userId) {
          throw new Error("게시글을 수정할 권한이 없습니다.");
        }

        // 게시글 수정
        const updatedPost = await prisma.post.update({
          where: { id: data.id },
          data: {
            content: data.content,
            contentHtml: data.contentHtml || "<p></p>",
            preview: data.preview || null,
            updatedAt: new Date(),
          },
        });

        // 캐시 갱신
        revalidatePath("/");
        revalidatePath(`/posts/${data.id}`);

        return { id: updatedPost.id };
      } catch (error) {
        console.error("게시글 수정 중 오류 발생:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "게시글을 수정하는 중 오류가 발생했습니다."
        );
      }
    }
  );

  return handler(data);
}

/**
 * 게시글 삭제 서버 액션
 * 인증된 사용자만 자신의 게시글을 삭제할 수 있음
 */
export async function deletePost(data: DeletePostInput) {
  const handler = await withAuth<typeof deletePostSchema, { success: boolean }>(
    deletePostSchema,
    async (data: DeletePostInput, userId: string) => {
      try {
        // 게시글 소유자 확인
        const post = await prisma.post.findUnique({
          where: { id: data.id },
          select: { userId: true },
        });

        if (!post) {
          throw new Error("게시글을 찾을 수 없습니다.");
        }

        if (post.userId !== userId) {
          throw new Error("게시글을 삭제할 권한이 없습니다.");
        }

        // 게시글 삭제 (소프트 삭제)
        await prisma.post.update({
          where: { id: data.id },
          data: {
            deletedAt: new Date(),
          },
        });

        // 캐시 갱신
        revalidatePath("/");

        return { success: true };
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "게시글을 삭제하는 중 오류가 발생했습니다."
        );
      }
    }
  );

  return handler(data);
}

/**
 * 게시글 목록 조회 서버 액션
 * 인증 없이 접근 가능
 */
export async function getPosts(data: { limit?: number; cursor?: string } = {}) {
  const schema = z.object({
    limit: z.number().optional().default(10),
    cursor: z.string().optional(),
  });

  // 기본값 설정
  const inputData = {
    limit: data.limit ?? 10,
    cursor: data.cursor,
  };

  const handler = await withoutAuth(schema, async ({ limit, cursor }) => {
    try {
      console.log("getPosts 서버 액션 호출됨", { limit, cursor });
      console.log("Prisma 클라이언트 확인:", !!prisma);
      
      const posts = await prisma.post.findMany({
        where: {
          deletedAt: null,
        },
        take: limit + 1, // 다음 페이지 확인을 위해 1개 더 가져옴
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayName: true,
              image: true,
            },
          },
        },
      });

      // 다음 페이지 존재 여부 확인
      let nextCursor: string | undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      console.log("게시글 조회 성공:", { postsCount: posts.length, nextCursor });
      
      return {
        posts,
        nextCursor,
      };
    } catch (error) {
      console.error("게시글 목록 조회 중 실제 오류 발생:", error);
      console.error("오류 스택:", error instanceof Error ? error.stack : error);
      throw new Error("게시글 목록을 조회하는 중 오류가 발생했습니다.");
    }
  });

  return handler(inputData);
}
