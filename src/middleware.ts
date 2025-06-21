import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function middleware(request: NextRequest) {
  // Auth 미들웨어 실행
  const authResult = await auth(request as any);
  
  // NextResponse 생성 (타입 안전성 보장)
  const response = NextResponse.next();

  // 개발 환경에서만 기본 CSP 설정
  if (process.env.NODE_ENV === 'development') {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:* https:; img-src 'self' data: https: http:;"
    );
  }

  return authResult || response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
