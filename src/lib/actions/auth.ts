"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { validateData, ValidationResult } from "../validations";
import { redirect } from "next/navigation";

/**
 * 인증이 필요한 액션 핸들러 타입
 */
export type AuthActionHandler<TInput, TOutput> = (
  input: TInput,
  userId: string
) => Promise<TOutput>;

/**
 * 인증이 필요 없는 액션 핸들러 타입
 */
export type PublicActionHandler<TInput, TOutput> = (
  input: TInput
) => Promise<TOutput>;

/**
 * 인증이 필요한 액션 래퍼
 * @param schema 입력 데이터 검증을 위한 Zod 스키마
 * @param handler 실제 액션 핸들러 함수
 * @returns 인증 및 유효성 검사가 적용된 서버 액션 함수
 */
export function withAuth<TSchema extends z.ZodTypeAny, TOutput>(
  schema: TSchema,
  handler: AuthActionHandler<z.infer<TSchema>, TOutput>
) {
  return async (input: z.infer<TSchema>): Promise<TOutput> => {
    // 인증 확인
    const session = await auth();
    
    if (!session || !session.user?.id) {
      redirect("/auth/signin");
    }
    
    // 입력 데이터 유효성 검사
    const validationResult = validateData(schema, input);
    
    if (!validationResult.success) {
      throw new Error(
        `유효성 검사 실패: ${JSON.stringify(validationResult.error.format())}`
      );
    }
    
    // 인증된 사용자 ID와 함께 핸들러 호출
    return handler(validationResult.data, session.user.id);
  };
}

/**
 * 인증이 필요 없는 액션 래퍼
 * @param schema 입력 데이터 검증을 위한 Zod 스키마
 * @param handler 실제 액션 핸들러 함수
 * @returns 유효성 검사가 적용된 서버 액션 함수
 */
export function withoutAuth<TSchema extends z.ZodTypeAny, TOutput>(
  schema: TSchema,
  handler: PublicActionHandler<z.infer<TSchema>, TOutput>
) {
  return async (input: z.infer<TSchema>): Promise<TOutput> => {
    // 입력 데이터 유효성 검사
    const validationResult = validateData(schema, input);
    
    if (!validationResult.success) {
      throw new Error(
        `유효성 검사 실패: ${JSON.stringify(validationResult.error.format())}`
      );
    }
    
    // 핸들러 호출
    return handler(validationResult.data);
  };
}
