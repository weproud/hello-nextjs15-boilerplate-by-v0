"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";

export interface ActionErrorResult {
  success: false;
  message: string;
  error?: any; // Optional: Include error details for logging
}

// Add Success Result Interface
export interface ActionSuccessResult<T = any> {
  success: true;
  data: T;
}

// Define a union type for action results
export type ActionResult<T = any> = ActionSuccessResult<T> | ActionErrorResult;

/**
 * Server Action에서 사용자의 인증 상태를 확인하고 세션 정보를 반환합니다.
 * 인증되지 않은 경우 에러 객체를 반환합니다.
 * @returns 인증 성공 시 Session 객체, 실패 시 ActionErrorResult 객체
 */
export async function requireAuthSession(): Promise<
  Session | ActionErrorResult
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }
    return session;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return {
      success: false,
      message: "인증 확인 중 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Type definition for the actual server action logic function.
 * It receives validated data (if a schema is provided) or the raw input.
 */
export type ActionFunction<InputType, ReturnType> = (
  input: InputType
) => Promise<ReturnType>;

/**
 * Wraps a server action function with common logic like input validation and error handling.
 * Does not handle authentication.
 *
 * @param fn The actual server action logic.
 * @param schema Optional Zod schema for input validation.
 * @returns A new function that takes the action input and returns a standardized ActionResult.
 */
export function actionHandler<
  SchemaType extends z.ZodSchema<any> | undefined,
  InputType = SchemaType extends z.ZodSchema<any> ? z.infer<SchemaType> : any,
  ReturnType = any
>(
  fn: ActionFunction<InputType, ReturnType>,
  schema?: SchemaType
): (input: InputType) => Promise<ActionResult<ReturnType>> {
  return async (input: InputType): Promise<ActionResult<ReturnType>> => {
    try {
      let validatedInput = input;
      if (schema) {
        const validationResult = schema.safeParse(input);
        if (!validationResult.success) {
          console.error(
            "Action input validation failed:",
            validationResult.error
          );
          return {
            success: false,
            message: "입력 값이 유효하지 않습니다.",
            error: validationResult.error.flatten(),
          };
        }
        validatedInput = validationResult.data;
      }

      const result = await fn(validatedInput);

      return {
        success: true,
        data: result,
      } as ActionSuccessResult<ReturnType>;
    } catch (error: unknown) {
      console.error("Server action failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      return {
        success: false,
        message: `작업 처리 중 오류 발생: ${message}`,
        error: error,
      } as ActionErrorResult;
    }
  };
}

// --- From action-handler-with-auth.ts ---

/**
 * Type definition for the actual server action logic function requiring authentication.
 * It receives the authenticated user session and validated data (if a schema is provided) or the raw input.
 */
export type ActionFunctionWithAuth<InputType, ReturnType> = (
  session: Session,
  input: InputType
) => Promise<ReturnType>;

/**
 * Wraps a server action function requiring authentication with common logic
 * like authentication check, input validation, and error handling.
 *
 * @param fn The actual server action logic, requiring a session and input.
 * @param schema Optional Zod schema for input validation.
 * @returns A new function that takes the action input and returns a standardized ActionResult.
 */
export function actionHandlerWithAuth<
  SchemaType extends z.ZodSchema<any> | undefined,
  InputType = SchemaType extends z.ZodSchema<any> ? z.infer<SchemaType> : any,
  ReturnType = any
>(
  fn: ActionFunctionWithAuth<InputType, ReturnType>,
  schema?: SchemaType
): (input: InputType) => Promise<ActionResult<ReturnType>> {
  return async (input: InputType): Promise<ActionResult<ReturnType>> => {
    try {
      // 1. Check authentication
      const sessionOrError = await requireAuthSession();
      if ("message" in sessionOrError) {
        return sessionOrError; // Return ActionErrorResult if not authenticated
      }
      const session = sessionOrError; // TypeScript now knows it's a Session

      // 2. Validate input (if schema provided)
      let validatedInput = input;
      if (schema) {
        const validationResult = schema.safeParse(input);
        if (!validationResult.success) {
          console.error(
            "Action input validation failed (with auth): ",
            validationResult.error
          );
          return {
            success: false,
            message: "입력 값이 유효하지 않습니다.",
            error: validationResult.error.flatten(),
          };
        }
        validatedInput = validationResult.data;
      }

      // 3. Execute the core action logic
      const result = await fn(session, validatedInput);

      // 4. Return successful result
      return {
        success: true,
        data: result,
      } as ActionSuccessResult<ReturnType>; // Ensure correct typing
    } catch (error: unknown) {
      // 5. Handle errors during action execution
      console.error("Server action failed (with auth): ", error);
      const message =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      return {
        success: false,
        message: `작업 처리 중 오류 발생: ${message}`,
        error: error,
      } as ActionErrorResult;
    }
  };
}
