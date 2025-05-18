import { z } from "zod";

/**
 * 게시글 생성 스키마
 */
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, { message: "내용을 입력해주세요." })
    .max(10000, { message: "내용은 최대 10000자까지 입력 가능합니다." }),
  contentHtml: z
    .string()
    .optional()
    .default("<p></p>"),
  preview: z
    .object({
      url: z.string().url().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

/**
 * 게시글 생성 입력 타입
 */
export type CreatePostInput = z.infer<typeof createPostSchema>;

/**
 * 게시글 수정 스키마
 */
export const updatePostSchema = z.object({
  id: z.string(),
  content: z
    .string()
    .min(1, { message: "내용을 입력해주세요." })
    .max(10000, { message: "내용은 최대 10000자까지 입력 가능합니다." }),
  contentHtml: z
    .string()
    .optional()
    .default("<p></p>"),
  preview: z
    .object({
      url: z.string().url().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

/**
 * 게시글 수정 입력 타입
 */
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

/**
 * 게시글 삭제 스키마
 */
export const deletePostSchema = z.object({
  id: z.string(),
});

/**
 * 게시글 삭제 입력 타입
 */
export type DeletePostInput = z.infer<typeof deletePostSchema>;
