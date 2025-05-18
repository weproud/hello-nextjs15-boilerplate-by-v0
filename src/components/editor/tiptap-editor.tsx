"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { LinkPreviews } from "./link-previews";

interface TiptapEditorProps {
  contentText: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  autofocus?: boolean;
}

export function TiptapEditor({
  contentText: content,
  onChange,
  placeholder,
  className,
  autofocus = false,
}: TiptapEditorProps) {
  const [detectedLinks, setDetectedLinks] = useState<string[]>([]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "tiptap-placeholder",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
    autofocus,
    enableInputRules: true,
  });

  // 외부에서 content가 변경되면 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // 에디터 포커스 핸들러
  const focusEditor = useCallback(() => {
    if (editor) {
      editor.chain().focus().run();
    }
  }, [editor]);

  // 붙여넣기 이벤트 핸들러
  useEffect(() => {
    if (!editor) return;

    const handlePaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text/plain");
      if (!text) return;

      // URL 감지를 위한 정규식 (더 정확한 URL 매칭)
      const urlRegex =
        /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))/gi;
      const urls = text.match(urlRegex);

      if (urls && urls.length > 0) {
        // 첫 번째 URL만 사용
        setDetectedLinks([urls[0]]);
      }
    };

    // 에디터 DOM 요소에 붙여넣기 이벤트 리스너 추가
    const editorElement = editor.view.dom;
    editorElement.addEventListener("paste", handlePaste);

    return () => {
      editorElement.removeEventListener("paste", handlePaste);
    };
  }, [editor]);

  // 에디터 내용 변경 감지하여 URL 추출
  useEffect(() => {
    if (!editor) return;

    const checkContentForUrls = () => {
      const content = editor.getText();
      // HTML에서 URL 추출 (a 태그 내부 href 속성 값)
      const urlRegex =
        /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))/gi;
      const plainText = content.replace(/<[^>]*>/g, " ");
      const urls = plainText.match(urlRegex);

      if (urls && urls.length > 0) {
        // 첫 번째 URL만 사용
        setDetectedLinks([urls[0]]);
      } else {
        // URL이 없으면 배열을 비움
        setDetectedLinks([]);
      }
    };

    // onUpdate 이벤트에서 URL 확인
    editor.on("update", () => {
      checkContentForUrls();
    });

    // 초기 로드 시 한 번 확인
    checkContentForUrls();

    return () => {
      // 클린업: 이벤트 리스너 제거
      editor.off("update");
    };
  }, [editor]);

  // 링크 제거 핸들러
  const handleRemoveLink = (link: string) => {
    setDetectedLinks((prevLinks) => prevLinks.filter((l) => l !== link));
  };

  return (
    <div className={cn("rounded-md border", className)}>
      <div
        className="prose prose-sm min-h-[200px] max-w-none p-4 dark:prose-invert sm:prose prose-headings:my-2 prose-p:my-2 prose-blockquote:my-2 prose-ol:my-2 prose-ul:my-2"
        onClick={focusEditor}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            focusEditor();
          }
        }}
        role="textbox"
        tabIndex={0}
        aria-label="에디터 내용"
      >
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror:focus]:shadow-none [&_.ProseMirror:focus]:outline-none [&_.ProseMirror]:outline-none"
        />
      </div>

      <div className="border-t p-4">
        <LinkPreviews links={detectedLinks} onRemove={handleRemoveLink} />
      </div>
    </div>
  );
}
