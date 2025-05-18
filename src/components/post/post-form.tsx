"use client";

import { useState, useEffect } from "react";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/post"; // post-actions에서 post로 변경
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PostFormProps {
  className?: string;
  onPostCreated?: () => void;
}

interface PreviewData {
  url?: string;
  title?: string;
  description?: string;
  image?: string | null;
}

export function PostForm({ className, onPostCreated }: PostFormProps) {
  const [content, setContent] = useState("");
  const [contentHtml, setContentHtml] = useState("<p></p>");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [detectedLink, setDetectedLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // 링크가 감지되면 미리보기 정보 가져오기
  useEffect(() => {
    if (!detectedLink) {
      setPreview(null);
      return;
    }

    const fetchPreview = async () => {
      try {
        const response = await fetch(
          `/api/url-meta?url=${encodeURIComponent(detectedLink)}`
        );

        if (!response.ok) {
          throw new Error("미리보기 정보를 가져오는데 실패했습니다.");
        }

        const data = await response.json();

        setPreview({
          url: detectedLink,
          title: data.title || "제목 없음",
          description: data.description || "",
          image: data.image,
        });
      } catch (error) {
        console.error("미리보기 정보 가져오기 실패:", error);
        // 실패해도 URL은 저장
        setPreview({
          url: detectedLink,
        });
      }
    };

    fetchPreview();
  }, [detectedLink]);

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (text: string, html?: string) => {
    setContent(text);
    if (html) {
      setContentHtml(html);
    }

    // URL 감지 로직
    const urlRegex =
      /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))/gi;
    const urls = text.match(urlRegex);

    if (urls && urls.length > 0) {
      // 첫 번째 URL만 사용
      setDetectedLink(urls[0]);
    } else {
      setDetectedLink(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("게시글 작성 시도:", { content, contentHtml, preview });

      // 게시글 생성 서버 액션 호출
      const result = await createPost({
        content,
        contentHtml,
        preview: preview || undefined,
      });

      console.log("게시글 작성 성공:", result);

      toast.success("게시글이 작성되었습니다.");
      setContent("");
      setContentHtml("<p></p>");
      setPreview(null);
      setDetectedLink(null);

      // 게시글 작성 성공 콜백 호출
      if (onPostCreated) {
        onPostCreated();
      }

      // 현재 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);

      // 리다이렉트 오류인 경우 (인증 관련 문제)
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        toast.error("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        // 리다이렉트는 서버 액션에서 처리되므로 여기서는 추가 작업 불필요
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "게시글을 작성하는 중 오류가 발생했습니다."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <TiptapEditor
          contentText={content}
          onChange={handleEditorChange}
          placeholder="무슨 생각을 하고 계신가요?"
          className="min-h-[200px]"
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "게시 중..." : "게시하기"}
          </Button>
        </div>
      </div>
    </form>
  );
}
