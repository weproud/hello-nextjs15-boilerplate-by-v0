"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "@/components/locale-switcher-select";
import { useSession, signOut } from "next-auth/react";
import { PostForm } from "@/components/post/post-form";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Toaster />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Label className="text-4xl font-black">
          Hello Nextjs 15 Boilerplate by v0
        </Label>
        <div className="flex gap-2">
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

        {isAuthenticated ? (
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">게시글 작성</h2>
            <PostForm className="mb-8" />
          </div>
        ) : (
          <div className="w-full max-w-3xl p-6 border rounded-lg bg-muted/30">
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
      </main>
    </div>
  );
}
