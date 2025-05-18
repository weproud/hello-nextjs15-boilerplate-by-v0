"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "../validations/post";

/**
 * 게시글 생성 서버 액션
 */
export async function createPost(data) {
  // 유효성 검사
  const result = createPostSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `유효성 검사 실패: ${JSON.stringify(result.error.format())}`
    );
  }

  // 인증 확인
  const session = await auth();
  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content: result.data.content,
        contentHtml: result.data.contentHtml || "<p></p>",
        preview: result.data.preview || null,
      },
    });

    // 캐시 갱신
    revalidatePath("/");

    return { id: post.id };
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error);
    throw new Error("게시글을 생성하는 중 오류가 발생했습니다.");
  }
}

/**
 * 게시글 수정 서버 액션
 */
export async function updatePost(data) {
  // 유효성 검사
  const result = updatePostSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `유효성 검사 실패: ${JSON.stringify(result.error.format())}`
    );
  }

  // 인증 확인
  const session = await auth();
  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // 게시글 소유자 확인
    const post = await prisma.post.findUnique({
      where: { id: result.data.id },
      select: { userId: true },
    });

    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (post.userId !== session.user.id) {
      throw new Error("게시글을 수정할 권한이 없습니다.");
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id: result.data.id },
      data: {
        content: result.data.content,
        contentHtml: result.data.contentHtml || "<p></p>",
        preview: result.data.preview || null,
        updatedAt: new Date(),
      },
    });

    // 캐시 갱신
    revalidatePath("/");
    revalidatePath(`/posts/${result.data.id}`);

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

/**
 * 게시글 삭제 서버 액션
 */
export async function deletePost(data) {
  // 유효성 검사
  const result = deletePostSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `유효성 검사 실패: ${JSON.stringify(result.error.format())}`
    );
  }

  // 인증 확인
  const session = await auth();
  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // 게시글 소유자 확인
    const post = await prisma.post.findUnique({
      where: { id: result.data.id },
      select: { userId: true },
    });

    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (post.userId !== session.user.id) {
      throw new Error("게시글을 삭제할 권한이 없습니다.");
    }

    // 게시글 삭제 (소프트 삭제)
    await prisma.post.update({
      where: { id: result.data.id },
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

/**
 * 게시글 목록 조회 서버 액션
 * 인증 없이 접근 가능
 */
export async function getPosts(data) {
  // 유효성 검사
  const schema = z.object({
    limit: z.number().optional().default(10),
    cursor: z.string().optional(),
  });

  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `유효성 검사 실패: ${JSON.stringify(result.error.format())}`
    );
  }

  try {
    const { limit, cursor } = result.data;

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
      posts,
      nextCursor,
    };
  } catch (error) {
    console.error("게시글 목록 조회 중 오류 발생:", error);
    throw new Error("게시글 목록을 조회하는 중 오류가 발생했습니다.");
  }
}
