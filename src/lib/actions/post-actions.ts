"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "../validations/post";
import { createAuthAction, createPublicAction } from "./auth-handlers";

/**
 * 게시글 생성 액션
 */
export const createPost = createAuthAction(createPostSchema).action(
  async ({ parsedInput, ctx }) => {
    try {
      // 게시글 생성
      const post = await prisma.post.create({
        data: {
          userId: ctx.user.id,
          content: parsedInput.content,
          contentHtml: parsedInput.contentHtml || "<p></p>",
          preview: parsedInput.preview || null,
        },
      });

      // 캐시 갱신
      revalidatePath("/");

      return { 
        success: true,
        data: { id: post.id },
        message: "게시글이 성공적으로 생성되었습니다."
      };
    } catch (error) {
      console.error("게시글 생성 중 오류 발생:", error);
      throw new Error("게시글을 생성하는 중 오류가 발생했습니다.");
    }
  }
);

/**
 * 게시글 수정 액션
 */
export const updatePost = createAuthAction(updatePostSchema).action(
  async ({ parsedInput, ctx }) => {
    try {
      // 게시글 소유자 확인
      const post = await prisma.post.findUnique({
        where: { id: parsedInput.id },
        select: { userId: true },
      });

      if (!post) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      if (post.userId !== ctx.user.id) {
        throw new Error("게시글을 수정할 권한이 없습니다.");
      }

      // 게시글 수정
      const updatedPost = await prisma.post.update({
        where: { id: parsedInput.id },
        data: {
          content: parsedInput.content,
          contentHtml: parsedInput.contentHtml || "<p></p>",
          preview: parsedInput.preview || null,
          updatedAt: new Date(),
        },
      });

      // 캐시 갱신
      revalidatePath("/");
      revalidatePath(`/posts/${parsedInput.id}`);

      return { 
        success: true,
        data: { id: updatedPost.id },
        message: "게시글이 성공적으로 수정되었습니다."
      };
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

/**
 * 게시글 삭제 액션
 */
export const deletePost = createAuthAction(deletePostSchema).action(
  async ({ parsedInput, ctx }) => {
    try {
      // 게시글 소유자 확인
      const post = await prisma.post.findUnique({
        where: { id: parsedInput.id },
        select: { userId: true },
      });

      if (!post) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      if (post.userId !== ctx.user.id) {
        throw new Error("게시글을 삭제할 권한이 없습니다.");
      }

      // 게시글 삭제 (소프트 삭제)
      await prisma.post.update({
        where: { id: parsedInput.id },
        data: {
          deletedAt: new Date(),
        },
      });

      // 캐시 갱신
      revalidatePath("/");

      return { 
        success: true,
        message: "게시글이 성공적으로 삭제되었습니다."
      };
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

/**
 * 게시글 목록 조회 액션 (퍼블릭)
 */
const getPostsSchema = z.object({
  limit: z.number().optional().default(10),
  cursor: z.string().optional(),
});

export const getPosts = createPublicAction(getPostsSchema).action(
  async ({ parsedInput }) => {
    try {
      const { limit, cursor } = parsedInput;

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
      let nextCursor = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        success: true,
        data: {
          posts,
          nextCursor,
        },
      };
    } catch (error) {
      console.error("게시글 목록 조회 중 오류 발생:", error);
      throw new Error("게시글 목록을 조회하는 중 오류가 발생했습니다.");
    }
  }
);

/**
 * 특정 게시글 조회 액션 (퍼블릭)
 */
const getPostSchema = z.object({
  id: z.string(),
});

export const getPost = createPublicAction(getPostSchema).action(
  async ({ parsedInput }) => {
    try {
      const post = await prisma.post.findUnique({
        where: { 
          id: parsedInput.id,
          deletedAt: null,
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

      if (!post) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      return {
        success: true,
        data: post,
      };
    } catch (error) {
      console.error("게시글 조회 중 오류 발생:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "게시글을 조회하는 중 오류가 발생했습니다."
      );
    }
  }
);
