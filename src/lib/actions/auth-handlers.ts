"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { validateData } from "../validations";
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
 * @param schema Zod 스키마
 * @param handler 인증된 사용자 ID를 받는 핸들러 함수
 * @returns 서버 액션 함수
 */
export async function withAuth<TSchema extends z.ZodTypeAny, TOutput>(
  schema: TSchema,
  handler: AuthActionHandler<z.infer<TSchema>, TOutput>
) {
  async function serverAction(input: z.infer<TSchema>): Promise<TOutput> {
    // 인증 확인
    const session = await auth();

    // 디버깅을 위한 로그 추가
    console.log("세션 정보:", session ? "세션 있음" : "세션 없음");
    console.log("사용자 ID:", session?.user?.id || "없음");

    if (!session || !session.user?.id) {
      console.log("인증 실패: 로그인 페이지로 리다이렉트");
      redirect("/auth/signin");
    }

    // 입력 데이터 유효성 검사
    const validationResult = validateData(schema, input);

    if (!validationResult.success) {
      console.log("유효성 검사 실패:", validationResult.error.format());
      throw new Error(
        `유효성 검사 실패: ${JSON.stringify(validationResult.error.format())}`
      );
    }

    // 인증된 사용자 ID와 함께 핸들러 호출
    return handler(validationResult.data, session.user.id);
  }

  return serverAction;
}

/**
 * 인증이 필요 없는 액션 래퍼
 * @param schema Zod 스키마
 * @param handler 핸들러 함수
 * @returns 서버 액션 함수
 */
export async function withoutAuth<TSchema extends z.ZodTypeAny, TOutput>(
  schema: TSchema,
  handler: PublicActionHandler<z.infer<TSchema>, TOutput>
) {
  async function serverAction(
    formData: z.infer<TSchema> | FormData
  ): Promise<TOutput> {
    console.log(
      "withoutAuth 함수 호출됨, 입력 데이터:",
      formData instanceof FormData ? "FormData 객체" : JSON.stringify(formData)
    );

    // FormData를 객체로 변환
    const input =
      formData instanceof FormData
        ? (Object.fromEntries(formData.entries()) as z.infer<TSchema>)
        : formData;

    // 입력 데이터 유효성 검사
    const validationResult = validateData(schema, input);

    if (!validationResult.success) {
      console.log("유효성 검사 실패:", validationResult.error.format());
      throw new Error(
        `유효성 검사 실패: ${JSON.stringify(validationResult.error.format())}`
      );
    }

    console.log(
      "유효성 검사 성공, 데이터:",
      JSON.stringify(validationResult.data)
    );

    // 핸들러 호출
    return handler(validationResult.data);
  }

  return serverAction;
}
