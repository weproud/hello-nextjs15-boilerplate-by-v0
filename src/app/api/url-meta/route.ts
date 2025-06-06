import { JSDOM } from "jsdom";
import { type NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";

// NextJS 15: GET 메서드 캐싱 설정 (URL 메타데이터는 동적이므로 캐시하지 않음)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // NextJS 15: 동적 렌더링 명시
  await connection();
  
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // URL 검증 개선
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataFetcher/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
      // NextJS 15: 더 나은 에러 핸들링을 위한 설정
      next: { revalidate: 300 }, // 5분 캐시
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: response.status >= 500 ? 500 : 400 }
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("text/html")) {
      return NextResponse.json(
        { error: "URL does not return HTML content" },
        { status: 400 }
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 메타데이터 추출 로직 개선
    const getMetaContent = (selectors: string[]): string => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        const content = element?.getAttribute("content") || element?.textContent;
        if (content) return content.trim();
      }
      return "";
    };

    const title = getMetaContent([
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'title'
    ]) || document.querySelector("title")?.textContent?.trim() || "";

    const description = getMetaContent([
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]'
    ]);

    const image = getMetaContent([
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]'
    ]);

    // 상대 URL을 절대 URL로 변환
    const baseUrl = new URL(url);
    const absoluteImageUrl = image && !image.startsWith('http') 
      ? new URL(image, baseUrl).href 
      : image;

    return NextResponse.json({
      title: title.substring(0, 200), // 제목 길이 제한
      description: description.substring(0, 500), // 설명 길이 제한
      image: absoluteImageUrl,
      url,
    });
  } catch (error) {
    console.error("Error fetching URL metadata:", error);
    
    // 더 구체적인 에러 메시지
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: "Network error: Unable to reach the URL" },
        { status: 503 }
      );
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timeout: URL took too long to respond" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch URL metadata" },
      { status: 500 }
    );
  }
}
