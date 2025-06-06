import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// NextJS 15: 향상된 미들웨어 설정
export default async function middleware(request: NextRequest) {
  // Auth 미들웨어 실행
  const authResult = await auth(request as any);

  // NextJS 15: 보안 헤더 추가
  const response = authResult || NextResponse.next();

  // CSP(Content Security Policy) 헤더 설정
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https: http:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com;
    frame-src 'self' https://accounts.google.com;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // 보안 헤더 설정
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Nonce", nonce);

  // NextJS 15: 성능 최적화 헤더
  response.headers.set("X-Robots-Tag", "index, follow");

  return response;
}

export const config = {
  // NextJS 15: 미들웨어 적용 경로 최적화
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
