"use client";

import { useState } from "react";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PostFormProps {
  className?: string;
}

export function PostForm({ className }: PostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 게시글 생성 서버 액션 호출
      const result = await createPost({
        content,
        // 현재는 contentHtml을 기본값으로 사용하고 있으므로 전달하지 않음
        // 실제로는 에디터에서 HTML 내용을 가져와서 전달해야 함
      });
      
      toast.success("게시글이 작성되었습니다.");
      setContent("");
      
      // 작성된 게시글 페이지로 이동 (옵션)
      // router.push(`/posts/${result.id}`);
      
      // 또는 현재 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "게시글을 작성하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <TiptapEditor
          contentText={content}
          onChange={setContent}
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
