import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // NextJS 15 최적화 설정
  experimental: {
    // 향후 동적 IO 기능을 위한 준비
    dynamicIO: false, // 기본값, 필요시 true로 변경
  },
  // 번들 분석 최적화
  bundlePagesRouterDependencies: true,
  // 타입 체크 최적화
  typescript: {
    // 빌드 중 타입 에러 무시 (개발용, 운영환경에서는 false 권장)
    ignoreBuildErrors: false,
  },
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 압축 최적화
  compress: true,
  // 런타임 최적화
  poweredByHeader: false,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
