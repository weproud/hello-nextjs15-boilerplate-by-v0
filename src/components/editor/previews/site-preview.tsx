"use client";

import { Globe } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SitePreviewProps {
  url: string;
}

interface Metadata {
  title: string;
  description: string;
  image: string | null;
  url: string;
}

export function SitePreview({ url }: SitePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/url-meta?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const data = await response.json();

        setMetadata({
          title: data.title || "Unknown Title",
          description: data.description || "No description available",
          image: data.image,
          url: url,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching metadata:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (error) {
    return null;
  }

  // URL에서 도메인 추출
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {loading ? (
          <div className="flex h-[200px] items-center justify-center bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <>
            {metadata?.image && (
              <div className="relative h-[200px] w-full">
                <img
                  src={metadata.image}
                  alt={metadata.title || "Site preview"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{getDomain(url)}</span>
              </div>
              <h3 className="mb-1 font-semibold">{metadata?.title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {metadata?.description}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
