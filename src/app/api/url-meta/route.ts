import { JSDOM } from "jsdom";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataFetcher/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL" },
        { status: 500 }
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 메타데이터 추출
    const title = document.querySelector("title")?.textContent || "";
    const description =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ||
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") ||
      "";
    const image =
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content") ||
      document
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute("content") ||
      null;

    return NextResponse.json({
      title,
      description,
      image,
      url,
    });
  } catch (error) {
    console.error("Error fetching URL metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL metadata" },
      { status: 500 }
    );
  }
}
