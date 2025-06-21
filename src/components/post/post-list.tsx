"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getPosts } from "@/lib/actions/post";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/components/app-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PostListProps {
  className?: string;
}

export interface PostListHandle {
  refreshPosts: () => void;
}

interface Post {
  id: string;
  content: string;
  contentHtml: string;
  preview: {
    url?: string;
    title?: string;
    description?: string;
    image?: string | null;
  } | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    displayName: string | null;
    image: string | null;
  };
}

export const PostList = forwardRef<PostListHandle, PostListProps>(
  ({ className }, ref) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // 강제 새로고침을 위한 키

    // 게시글 목록 가져오기
    const fetchPosts = async (cursor?: string) => {
      try {
        console.log("게시글 목록 가져오기 시작", { cursor });
        setLoading(true);

        const result = await getPosts({
          limit: 10,
          cursor,
        });

        console.log("게시글 목록 가져오기 응답:", result);

        // 서버 액션 에러 처리
        if (result.serverError) {
          throw new Error(result.serverError);
        }

        // 서버 액션이 성공했지만 데이터가 없는 경우
        if (!result.data) {
          console.error("데이터가 없음:", result);
          throw new Error("게시글 데이터를 가져올 수 없습니다.");
        }

        const { posts, nextCursor } = result.data;

        console.log("게시글 목록 가져오기 성공", {
          postsCount: posts.length,
          nextCursor,
        });

        if (cursor) {
          // 더 불러오기인 경우 기존 목록에 추가
          setPosts((prev) => [...prev, ...posts]);
        } else {
          // 처음 불러오는 경우 목록 교체
          setPosts(posts);
        }

        setNextCursor(nextCursor);
        setHasMore(!!nextCursor);
      } catch (error) {
        console.error("게시글 목록 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    // 게시글 목록 새로고침
    const refreshPosts = () => {
      console.log("게시글 목록 새로고침");
      setRefreshKey((prev) => prev + 1); // 강제 새로고침을 위한 키 증가
    };

    // ref를 통해 refreshPosts 함수 노출
    useImperativeHandle(ref, () => ({
      refreshPosts,
    }));

    // 컴포넌트가 마운트되거나 refreshKey가 변경될 때 게시글 목록 가져오기
    useEffect(() => {
      fetchPosts();
    }, [refreshKey]);

    const handleLoadMore = () => {
      if (nextCursor) {
        setLoading(true);
        fetchPosts(nextCursor);
      }
    };

    if (loading && posts.length === 0) {
      return (
        <div className={className}>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <AppCard key={i}>
                <AppCardHeader>
                  <Skeleton className="h-6 w-32" />
                </AppCardHeader>
                <AppCardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </AppCardContent>
              </AppCard>
            ))}
          </div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className={className}>
          <AppCard>
            <AppCardContent className="p-6 text-center">
              <p className="text-muted-foreground">아직 게시글이 없습니다.</p>
            </AppCardContent>
          </AppCard>
        </div>
      );
    }

    return (
      <div className={className}>
        <div className="space-y-4">
          {posts.map((post) => (
            <AppCard key={post.id} variant="hover" className="rounded-xl">
              <AppCardHeader>
                <div className="flex items-center justify-between">
                  <AppCardTitle className="text-base">
                    {post.user.displayName || post.user.name}
                  </AppCardTitle>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </AppCardHeader>
              <AppCardContent>
                <div className="mb-2">{post.content}</div>
                {post.preview && post.preview.url && (
                  <div className="mt-4 border rounded-md p-3 bg-muted/30">
                    <a
                      href={post.preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {post.preview.title || post.preview.url}
                    </a>
                    {post.preview.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.preview.description}
                      </p>
                    )}
                  </div>
                )}
              </AppCardContent>
            </AppCard>
          ))}
        </div>

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "불러오는 중..." : "더 보기"}
            </Button>
          </div>
        )}
      </div>
    );
  }
);
