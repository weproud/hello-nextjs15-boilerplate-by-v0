"use client";

import { PostForm } from "@/components/post/post-form";
import { PostList, PostListHandle } from "@/components/post/post-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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

          {isAuthenticated ? (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">게시글 작성</h2>
              <PostForm className="mb-8" onPostCreated={handlePostCreated} />
            </div>
          ) : (
            <div className="w-full p-6 border rounded-lg bg-muted/30">
              <p className="text-center text-lg mb-4">
                게시글을 작성하려면 로그인이 필요합니다.
              </p>
              <div className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signin">로그인하기</Link>
                </Button>
              </div>
            </div>
          )}

          <Separator />

          <div>
            <h2 className="text-2xl font-bold mb-6">최근 게시글</h2>
            <PostList ref={postListRef} />
          </div>
        </main>
      </div>
    </div>
  );
}
