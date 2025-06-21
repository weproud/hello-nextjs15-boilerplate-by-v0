"use client";

import { ErrorTest } from "@/components/error-test";
import { PostList, PostListHandle } from "@/components/post/post-list";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export default function Home() {
  const t = useTranslations();
  const { status } = useSession();
  const postListRef = useRef<PostListHandle>(null);

  const isAuthenticated = status === "authenticated";

  // 게시글 작성 성공 시 목록 새로고침
  const handlePostCreated = () => {
    console.log("게시글 작성 성공, 목록 새로고침");
    postListRef.current?.refreshPosts();
  };

  return (
    <div className="min-h-screen">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <main className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("HomePage.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              Next.js 15 보일러플레이트에 오신 것을 환영합니다!
            </p>
          </div>



          <div>
            <h2 className="text-2xl font-bold mb-6">최근 게시글</h2>
            <PostList ref={postListRef} />
          </div>

          {/* Error Boundary 테스트 섹션 (개발 환경에서만) */}
          {process.env.NODE_ENV === "development" && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-bold mb-6">개발자 도구</h2>
                <ErrorTest />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
