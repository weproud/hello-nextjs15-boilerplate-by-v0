"use client";

import ErrorBoundary from "@/components/error-boundary";
import { ReactPlugin } from "@stagewise-plugins/react";
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { useReportWebVitals } from "next/web-vitals";

// NextJS 15: Web Vitals 리포팅 컴포넌트
function WebVitals() {
  useReportWebVitals((metric) => {
    // NextJS 15: 성능 메트릭 로깅 및 분석
    if (process.env.NODE_ENV === "production") {
      // 프로덕션에서는 실제 분석 서비스로 전송
      // 예: Google Analytics, Vercel Analytics 등
      console.log("Web Vitals:", metric);
    } else {
      // 개발 환경에서는 콘솔에 로깅
      switch (metric.name) {
        case "FCP":
          console.log("First Contentful Paint:", metric);
          break;
        case "LCP":
          console.log("Largest Contentful Paint:", metric);
          break;
        case "CLS":
          console.log("Cumulative Layout Shift:", metric);
          break;
        case "FID":
          console.log("First Input Delay:", metric);
          break;
        case "TTFB":
          console.log("Time to First Byte:", metric);
          break;
        case "INP":
          console.log("Interaction to Next Paint:", metric);
          break;
        default:
          console.log("Other metric:", metric);
      }
    }
  });

  return null;
}

// 에러 로깅 함수
function logError(error: Error, errorInfo: any) {
  console.error("Global Error Boundary caught an error:", error, errorInfo);
  
  // 여기서 에러 로깅 서비스에 에러를 보낼 수 있습니다
  // 예: Sentry.captureException(error), LogRocket.captureException(error) 등
  
  // 개발 환경에서는 추가 정보 로깅
  if (process.env.NODE_ENV === "development") {
    console.group("🚨 Error Boundary Details");
    console.log("Error:", error);
    console.log("Error Info:", errorInfo);
    console.log("User Agent:", navigator.userAgent);
    console.log("URL:", window.location.href);
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }
}

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
  timeZone: string;
}

export function Providers({
  children,
  locale,
  messages,
  timeZone,
}: ProvidersProps) {
  return (
    <>
      {/* 개발 환경에서만 Stagewise 툴바 렌더링 */}
      {process.env.NODE_ENV === 'development' && (
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      )}
      
      {/* Global Error Boundary - 모든 Provider를 감싸서 전체 앱에서 발생하는 에러 캐치 */}
      <ErrorBoundary onError={logError}>
        <SessionProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* NextJS 15: Web Vitals 모니터링 */}
              <WebVitals />
              {/* 각 페이지별 컴포넌트들을 위한 추가 Error Boundary */}
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
}
