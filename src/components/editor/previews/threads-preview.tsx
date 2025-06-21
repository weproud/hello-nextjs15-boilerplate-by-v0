'use client';

import { MessageCircle } from 'lucide-react';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { AppCard, AppCardContent } from '@/components/app-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ThreadsPreviewProps {
  url: string;
  className?: string;
}

// 전역 타입 선언
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface ThreadsData {
  url: string;
  username?: string;
  postId?: string;
  domain?: string;
}

export function ThreadsPreview({ url, className }: ThreadsPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [threadsData, setThreadsData] = useState<ThreadsData>({ url });

  // URL에서 username, postId, domain 추출
  useEffect(() => {
    const getThreadsData = (url: string): ThreadsData => {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const domain = urlObj.hostname.includes('threads.com') ? 'threads.com' : 'threads.net';

        return {
          url,
          username: pathParts[1]?.replace('@', ''),
          postId: pathParts[3] || pathParts[1], // URL 형식에 따라 다르게 추출
          domain,
        };
      } catch (error) {
        console.error('Error parsing Threads URL:', error);
        return { url };
      }
    };

    const data = getThreadsData(url);
    setThreadsData(data);

    if (data.postId) {
      setLoading(true);
    }
  }, [url]);

  // 스크립트가 로드된 후 임베드 초기화하는 함수
  const initEmbed = useCallback(() => {
    if (window.instgrm) {
      try {
        window.instgrm.Embeds.process();
        setLoading(false);
      } catch (error) {
        console.error('Error processing Threads embed:', error);
      }
    } else {
      console.warn('instgrm object not found');
    }
  }, []);

  // 스크립트 로드 완료 핸들러
  const handleScriptLoad = useCallback(() => {
    setScriptLoaded(true);
    setTimeout(() => {
      initEmbed();
    }, 500);
  }, [initEmbed]);

  useEffect(() => {
    // blockquote에 원본 스타일 적용
    if (blockquoteRef.current) {
      blockquoteRef.current.style.cssText = `
        background: #FFF;
        border-width: 1px;
        border-style: solid;
        border-color: #00000026;
        border-radius: 16px;
        max-width: none;
        width: 100%;
        margin: 0;
        padding: 0;
      `;
    }

    // 이미 스크립트가 로드되었다면 초기화 시도
    if (scriptLoaded && window.instgrm) {
      initEmbed();
    }

    // 컴포넌트가 마운트된 후 일정 시간 후에 다시 초기화 시도 (안전장치)
    const timeoutId = setTimeout(() => {
      if (window.instgrm) {
        initEmbed();
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [url, initEmbed, scriptLoaded]);

  if (!threadsData.postId) {
    return (
      <AppCard variant="border" className="overflow-hidden rounded-lg">
        <AppCardContent className="p-0">
          <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            올바르지 않은 Threads URL입니다
          </div>
        </AppCardContent>
      </AppCard>
    );
  }

  return (
    <AppCard variant="gradient" className={cn('overflow-hidden rounded-lg', className)}>
      <AppCardContent className="p-0">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="flex flex-col">
            <div ref={containerRef} className="w-full bg-white">
              <blockquote
                ref={blockquoteRef}
                className="text-post-media"
                data-text-post-permalink={url}
                data-text-post-version="0"
                id={`ig-tp-${threadsData.postId}`}
                style={{ minHeight: '350px' }}
              >
                <a
                  href={url}
                  style={{
                    background: '#FFFFFF',
                    lineHeight: '0',
                    padding: '0',
                    textAlign: 'center',
                    textDecoration: 'none',
                    width: '100%',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'block',
                        height: '32px',
                        width: '32px',
                        paddingBottom: '20px',
                      }}
                    >
                      <svg
                        aria-label="Threads"
                        height="32px"
                        role="img"
                        viewBox="0 0 192 192"
                        width="32px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        lineHeight: '21px',
                        color: '#000000',
                        fontWeight: 600,
                      }}
                    >
                      View on Threads
                    </div>
                  </div>
                </a>
              </blockquote>
            </div>
            <div className="flex items-center gap-2 border-t p-3">
              <MessageCircle className="h-5 w-5 text-pink-600" />
              <span className="font-medium">Threads Post</span>
            </div>
          </div>
        )}
      </AppCardContent>

      {/* Threads 임베드 스크립트 */}
      <Script
        src={`https://www.${threadsData.domain || 'threads.net'}/embed.js`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </AppCard>
  );
}
