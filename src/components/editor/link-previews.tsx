"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SitePreview } from "./previews/site-preview";
import { ThreadsPreview } from "./previews/threads-preview";
import { YouTubePreview } from "./previews/youtube-preview";

interface LinkPreviewsProps {
  links: string[];
  onRemove: (link: string) => void;
}

export function LinkPreviews({ links, onRemove }: LinkPreviewsProps) {
  if (links.length === 0) return null;

  // 첫 번째 URL만 사용
  const firstLink = links[0];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">URL Preview</h3>
      </div>
      <div className="space-y-4">
        <div key={firstLink} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => onRemove(firstLink)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
          <LinkPreview url={firstLink} />
        </div>
      </div>
    </div>
  );
}

interface LinkPreviewProps {
  url: string;
}

function LinkPreview({ url }: LinkPreviewProps) {
  // URL 유형 확인
  const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(
    url
  );

  // threads.net과 threads.com 모두 지원
  const isThreads =
    /^(https?:\/\/)?(www\.)?(threads\.net|threads\.com)\/.+$/.test(url);

  if (isYouTube) {
    return <YouTubePreview url={url} />;
  }

  if (isThreads) {
    return <ThreadsPreview url={url} />;
  }

  return <SitePreview url={url} />;
}
