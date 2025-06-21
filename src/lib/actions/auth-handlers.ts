import { auth } from "@/auth";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * 기본 액션 클라이언트 생성
 */
const baseActionClient = createSafeActionClient({
  // 기본 오류 처리
  defaultValidationErrorsShape: "flattened",
  // 더 나은 오류 메시지를 위한 포맷팅
  handleServerError: (e: Error) => {
    console.error("서버 액션 오류:", e);
    
    // 개발 환경에서는 자세한 오류 정보 반환
    if (process.env.NODE_ENV === "development") {
      return e.message;
    }
    
    // 프로덕션에서는 일반적인 오류 메시지 반환
    return "서버 오류가 발생했습니다.";
  },
});

/**
 * 인증이 필요한 액션 클라이언트
 */
export const authActionClient = baseActionClient.use(async ({ next }) => {
  // 인증 확인
  const session = await auth();

  // 디버깅을 위한 로그 추가
  console.log("세션 정보:", session ? "세션 있음" : "세션 없음");
  console.log("사용자 ID:", session?.user?.id || "없음");

  if (!session || !session.user?.id) {
    console.log("인증 실패: 로그인 페이지로 리다이렉트");
    redirect("/auth/signin");
  }

  // 인증된 사용자 정보를 컨텍스트에 추가
  return next({
    ctx: {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    },
  });
});

/**
 * 인증이 필요 없는 퍼블릭 액션 클라이언트
 */
export const publicActionClient = baseActionClient.use(async ({ next }) => {
  console.log("퍼블릭 액션 호출됨");
  
  return next({
    ctx: {
      // 퍼블릭 액션에서도 세션 정보가 필요한 경우를 위해 선택적으로 제공
      session: await auth(),
    },
  });
});

/**
 * 인증이 필요한 액션을 위한 헬퍼 함수
 * @param schema Zod 스키마
 * @returns 인증된 액션 생성 함수
 */
export function createAuthAction<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return authActionClient.inputSchema(schema);
}

/**
 * 퍼블릭 액션을 위한 헬퍼 함수
 * @param schema Zod 스키마
 * @returns 퍼블릭 액션 생성 함수
 */
export function createPublicAction<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return publicActionClient.inputSchema(schema);
}




