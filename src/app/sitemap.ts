import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 기본 페이지들
  const routes = ["", "/auth/signin"];

  // 다국어 지원을 위한 언어별 URL 생성
  const locales = ["en", "ko"];

  const staticUrls: MetadataRoute.Sitemap = [];

  // 기본 URL들 추가
  routes.forEach((route) => {
    locales.forEach((locale) => {
      staticUrls.push({
        url: `${baseUrl}${locale === "en" ? "" : `/${locale}`}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}${route}`,
            ko: `${baseUrl}/ko${route}`,
          },
        },
      });
    });
  });

  // TODO: 동적 페이지들 (게시글 등)을 데이터베이스에서 가져와서 추가
  // const dynamicUrls = await generateDynamicUrls()

  return [
    ...staticUrls,
    // ...dynamicUrls
  ];

  // 동적 URL 생성 함수 (필요시 구현)
  // async function generateDynamicUrls(): Promise<MetadataRoute.Sitemap> {
  //   // 게시글 등의 동적 페이지들을 데이터베이스에서 가져와서 sitemap에 추가
  //   return []
  // }
}
