"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema
} from "../validations/post";
import { authActionClient, publicActionClient } from "./auth-handlers";

/**
 * 게시글 생성 서버 액션
 * 인증된 사용자만 게시글을 작성할 수 있음
 */
export const createPost = authActionClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    try {
      console.log("게시글 생성 시작, 사용자 ID:", user.id);

      // 게시글 생성
      const post = await prisma.post.create({
        data: {
          userId: user.id,
          content: data.content,
          contentHtml: data.contentHtml || "<p></p>",
          preview: data.preview ? JSON.parse(JSON.stringify(data.preview)) : null,
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
  });

/**
 * 게시글 수정 서버 액션
 * 인증된 사용자만 자신의 게시글을 수정할 수 있음
 */
export const updatePost = authActionClient
  .inputSchema(updatePostSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    try {
      // 게시글 소유자 확인
      const post = await prisma.post.findUnique({
        where: { id: data.id },
        select: { userId: true },
      });

      if (!post) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      if (post.userId !== user.id) {
        throw new Error("게시글을 수정할 권한이 없습니다.");
      }

      // 게시글 수정
      const updatedPost = await prisma.post.update({
        where: { id: data.id },
        data: {
          content: data.content,
          contentHtml: data.contentHtml || "<p></p>",
          preview: data.preview ? JSON.parse(JSON.stringify(data.preview)) : null,
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
  });

/**
 * 게시글 삭제 서버 액션
 * 인증된 사용자만 자신의 게시글을 삭제할 수 있음
 */
export const deletePost = authActionClient
  .inputSchema(deletePostSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    try {
      // 게시글 소유자 확인
      const post = await prisma.post.findUnique({
        where: { id: data.id },
        select: { userId: true },
      });

      if (!post) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      if (post.userId !== user.id) {
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
  });

/**
 * 게시글 목록 조회 서버 액션
 * 인증 없이 접근 가능
 */
const getPostsSchema = z.object({
  limit: z.number().min(1).max(50).default(10),
  cursor: z.string().optional(),
});

export const getPosts = publicActionClient
  .inputSchema(getPostsSchema)
  .action(async ({ parsedInput: { limit, cursor } }) => {
    try {
      console.log("getPosts 서버 액션 호출됨", { limit, cursor });
      console.log("Prisma 클라이언트 확인:", !!prisma);
      
      const posts = await prisma.post.findMany({
        where: {
          deletedAt: null,
        },
        take: limit + 1, // 다음 페이지 확인을 위해 1개 더 가져옴
        ...(cursor && { cursor: { id: cursor } }),
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
        const nextItem = posts.pop(); // 마지막 아이템 제거
        nextCursor = nextItem?.id;
      }

      console.log(`게시글 ${posts.length}개 조회됨`);
      
      return {
        posts,
        nextCursor,
        hasNextPage: !!nextCursor,
      };
    } catch (error) {
      console.error("게시글 조회 중 오류 발생:", error);
      throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
    }
  });
