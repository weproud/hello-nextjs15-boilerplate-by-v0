"use client";

import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useReportWebVitals } from "next/web-vitals";
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import { ReactPlugin } from "@stagewise-plugins/react";

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
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
</>
  );
}
