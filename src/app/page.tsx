"use client";

import ThemeToggle from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "@/components/locale-switcher-select";
import { useSession, signOut } from "next-auth/react";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { useState } from "react";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const { status } = useSession();
  const [content, setContent] = useState("");

  const isAuthenticated = status === "authenticated";

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
        <TiptapEditor
          contentText={content}
          onChange={setContent}
          placeholder="Enter content"
          className="min-h-[400px] min-w-[800px]"
        />
      </main>
    </div>
  );
}
