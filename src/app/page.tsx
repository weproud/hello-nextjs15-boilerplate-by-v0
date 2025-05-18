"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "@/components/locale-switcher-select";
import { useSession, signOut } from "next-auth/react";
import { PostForm } from "@/components/post/post-form";
import { PostList, PostListHandle } from "@/components/post/post-list";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const { status } = useSession();
  const postListRef = useRef<PostListHandle>(null);

  const isAuthenticated = status === "authenticated";

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut({ callbackUrl: "/" });
    }
  };

  // 게시글 작성 성공 시 목록 새로고침
  const handlePostCreated = () => {
    console.log("게시글 작성 성공, 목록 새로고침");
    postListRef.current?.refreshPosts();
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Label className="text-4xl font-black block mb-4">
            Hello Nextjs 15 Boilerplate by v0
          </Label>
          <div className="flex gap-2 flex-wrap">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button onClick={handleAuthAction}>Sign Out</Button>
            ) : (
              <Button>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
            <LocaleSwitcherSelect
              defaultValue={locale}
              items={[
                { value: "en", label: "English" },
                { value: "ko", label: "Korean" },
              ]}
              label="Language"
            />
            <Label>{t("HomePage.title")}</Label>
          </div>
        </header>

        <main className="space-y-8">
          {isAuthenticated ? (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">게시글 작성</h2>
              <PostForm className="mb-8" onPostCreated={handlePostCreated} />
            </div>
          ) : (
            <div className="w-full p-6 border rounded-lg bg-muted/30">
              <p className="text-center">
                게시글을 작성하려면 로그인이 필요합니다.
              </p>
              <div className="flex justify-center mt-4">
                <Button>
                  <Link href="/auth/signin">로그인하기</Link>
                </Button>
              </div>
            </div>
          )}

          <Separator />

          <PostList ref={postListRef} />
        </main>
      </div>
    </div>
  );
}
