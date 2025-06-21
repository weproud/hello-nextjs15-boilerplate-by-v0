"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "./theme-toggle";
import LocaleSwitcherSelect from "./locale-switcher-select";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  
  const isAuthenticated = status === "authenticated";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="navigation-bar fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-[var(--navigation-height)] items-center justify-between px-6">
        {/* 왼쪽: 로고 + 네비게이션 */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Next.js 15 Boilerplate
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  홈
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {isAuthenticated && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>게시글</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            게시글 관리
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            게시글을 작성하고 관리할 수 있습니다.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/" title="게시글 목록">
                      모든 게시글을 확인할 수 있습니다.
                    </ListItem>
                    <ListItem href="/" title="게시글 작성">
                      새로운 게시글을 작성합니다.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <NavigationMenuTrigger>도구</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="테마 변경">
                    다크/라이트 테마를 변경할 수 있습니다.
                  </ListItem>
                  <ListItem title="언어 변경">
                    한국어/영어를 선택할 수 있습니다.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>

        {/* 데스크톱 오른쪽 도구 모음 */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          
          <LocaleSwitcherSelect
            defaultValue={locale}
            items={[
              { value: "en", label: "English" },
              { value: "ko", label: "Korean" },
            ]}
            label="Language"
          />

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSignOut}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">로그인</Link>
            </Button>
          )}
        </div>

        {/* 모바일 메뉴 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-6">
              <Link
                href="/"
                className="text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                홈
              </Link>
              
              {isAuthenticated && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">게시글</h3>
                    <Link
                      href="/"
                      className="block text-sm pl-4"
                      onClick={() => setOpen(false)}
                    >
                      게시글 목록
                    </Link>
                    <Link
                      href="/"
                      className="block text-sm pl-4"
                      onClick={() => setOpen(false)}
                    >
                      게시글 작성
                    </Link>
                  </div>
                </>
              )}

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">테마</span>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">언어</span>
                  <LocaleSwitcherSelect
                    defaultValue={locale}
                    items={[
                      { value: "en", label: "English" },
                      { value: "ko", label: "Korean" },
                    ]}
                    label="Language"
                  />
                </div>
              </div>

              <Separator />

              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email}
                  </p>
                  <Button variant="outline" onClick={handleSignOut} className="w-full">
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/auth/signin" onClick={() => setOpen(false)}>
                    로그인
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 