'use client';

import { YoutubeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface YouTubePreviewProps {
  url: string;
}

export function YouTubePreview({ url }: YouTubePreviewProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // YouTube URL에서 비디오 ID 추출
    const extractVideoId = (url: string) => {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    };

    const id = extractVideoId(url);
    setVideoId(id);

    // 실제 구현에서는 YouTube API를 사용하여 비디오 정보를 가져올 수 있습니다
    // 여기서는 간단히 로딩 상태만 시뮬레이션합니다
    if (id) {
      setLoading(true);
      setTimeout(() => {
        setTitle(`YouTube Video (${id})`);
        setLoading(false);
      }, 500);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [url]);

  if (error) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {loading ? (
          <div className="flex aspect-video items-center justify-center bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-center gap-2 p-3">
              <YoutubeIcon className="h-5 w-5 text-red-600" />
              <span className="font-medium">{title}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
