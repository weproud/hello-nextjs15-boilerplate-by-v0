import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { pretendard } from "@/lib/fonts";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import { Toaster } from "sonner";
import { NavigationBar } from "@/components/navigation-bar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";

// NextJS 15: 향상된 메타데이터 설정
export const metadata: Metadata = {
  title: {
    template: "%s | Next.js 15 Boilerplate",
    default: "Next.js 15 Boilerplate by v0",
  },
  description:
    "Modern Next.js 15 boilerplate with App Router, TypeScript, and Tailwind CSS",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "App Router"],
  authors: [{ name: "v0" }],
  creator: "v0",
  publisher: "v0",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ko-KR": "/ko",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Next.js 15 Boilerplate by v0",
    description:
      "Modern Next.js 15 boilerplate with App Router, TypeScript, and Tailwind CSS",
    siteName: "Next.js 15 Boilerplate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js 15 Boilerplate by v0",
    description:
      "Modern Next.js 15 boilerplate with App Router, TypeScript, and Tailwind CSS",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// NextJS 15: 뷰포트 설정 분리
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* NextJS 15: DNS 프리페치 최적화 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* 프리로드 힌트 */}
        <link
          rel="preload"
          href="/fonts/pretendard-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${pretendard.variable} antialiased dark`}>
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {/* Navigation Bar - Fixed at top */}
          <NavigationBar />
          
          {/* Sidebar Layout */}
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                </div>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
                {auth}
              </main>
            </SidebarInset>
          </SidebarProvider>
          
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
