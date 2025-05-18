import { z } from "zod";

/**
 * 유효성 검사 결과 타입
 */
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: z.ZodError;
    };

/**
 * Zod 스키마를 사용하여 데이터 유효성 검사를 수행하는 유틸리티 함수
 * @param schema Zod 스키마
 * @param data 검증할 데이터
 * @returns ValidationResult 객체
 */
export function validateData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): ValidationResult<z.infer<T>> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error,
      };
    }
    // Zod 에러가 아닌 경우 다시 throw
    throw error;
  }
}

/**
 * 유효성 검사 오류 메시지를 사용자 친화적인 형태로 변환
 * @param error Zod 에러 객체
 * @returns 사용자 친화적인 오류 메시지 객체
 */
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
}
