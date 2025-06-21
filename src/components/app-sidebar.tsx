"use client"

import { Calendar, Home, Inbox, Search, Settings, FileText, Plus, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  // 메인 메뉴 아이템들
  const mainItems = [
    {
      title: "홈",
      url: "/",
      icon: Home,
    },
    {
      title: "대시보드",
      url: "/dashboard",
      icon: Calendar,
    },
    {
      title: "메시지",
      url: "/messages",
      icon: Inbox,
    },
    {
      title: "검색",
      url: "/search",
      icon: Search,
    },
  ]

  // 게시글 관련 메뉴 (인증된 사용자만)
  const postItems = isAuthenticated ? [
    {
      title: "게시글 목록",
      url: "/posts",
      icon: FileText,
    },
    {
      title: "게시글 작성",
      url: "/posts/new",
      icon: Plus,
    },
  ] : []

  // 설정 메뉴
  const settingsItems = [
    {
      title: "설정",
      url: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar className="border-r" variant="inset">
      <SidebarContent>
        {/* 메인 네비게이션 */}
        <SidebarGroup>
          <SidebarGroupLabel>네비게이션</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 게시글 메뉴 (인증된 사용자만) */}
        {isAuthenticated && postItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>게시글</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {postItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator />

        {/* 설정 메뉴 */}
        <SidebarGroup>
          <SidebarGroupLabel>설정</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {session?.user?.email || "사용자"}
              </p>
              <p className="text-xs text-muted-foreground">온라인</p>
            </div>
          </div>
        ) : (
          <Button asChild size="sm" className="w-full">
            <Link href="/auth/signin">로그인</Link>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
} 