# Next.js 15 Boilerplate by v0

## 🚀 Project Summary

이 프로젝트는 **Next.js 15**의 최신 기능을 활용한 모던 웹 애플리케이션 보일러플레이트입니다. 다음과 같은 주요 기능을 제공합니다:

### ✨ 핵심 기능

- **🔐 인증 시스템**: Auth.js(NextAuth)를 사용한 소셜 로그인(Google) 지원
- **🌐 다국어 지원**: next-intl을 통한 다국어 지원 (한국어, 영어)
- **🌙 다크 모드**: next-themes를 활용한 시스템 설정 기반 다크 모드
- **💎 UI 컴포넌트**: shadcn/ui를 활용한 모던하고 접근성 높은 UI 컴포넌트
- **🗄️ 데이터베이스**: Prisma ORM을 통한 PostgreSQL 데이터베이스 연동
- **📝 리치 텍스트 에디터**: Tiptap 에디터를 활용한 게시글 작성 기능
- **🔗 URL 미리보기**: 게시글 내 URL 자동 감지 및 미리보기 기능
- **⚡ 서버 액션**: Next.js의 Server Actions를 활용한 데이터 처리

### 🆕 Next.js 15 최신 기능

- **📦 Turbopack**: 향상된 개발 환경과 빌드 성능
- **🔄 App Router**: 최신 App Router 구조 완전 적용
- **🛡️ 보안 강화**: CSP 헤더 및 보안 미들웨어 적용
- **📊 메타데이터 API**: 향상된 SEO 및 소셜 미디어 지원
- **⚡ 성능 최적화**: 이미지, 폰트, 번들링 최적화

## 📁 Project Architecture

```
hello-nextjs15-boilerplate-by-v0/
├── prisma/                  # Prisma ORM 설정 및 스키마
│   ├── schema.prisma        # 데이터베이스 스키마 정의
│   └── migrations/          # 데이터베이스 마이그레이션 파일
├── public/                  # 정적 파일 디렉토리
├── src/                     # 소스 코드
│   ├── app/                 # Next.js App Router 구조
│   │   ├── api/             # API 라우트 (Next.js 15 최적화)
│   │   │   └── url-meta/    # URL 메타데이터 추출 API
│   │   ├── auth/            # 인증 관련 페이지
│   │   ├── providers.tsx    # 앱 전체 프로바이더 설정
│   │   ├── layout.tsx       # 루트 레이아웃 (메타데이터 API 활용)
│   │   ├── page.tsx         # 메인 페이지
│   │   └── globals.css      # 글로벌 스타일
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── editor/          # Tiptap 에디터 관련 컴포넌트
│   │   ├── post/            # 게시글 관련 컴포넌트
│   │   ├── ui/              # UI 컴포넌트 (shadcn/ui)
│   │   └── ...
│   ├── lib/                 # 유틸리티 및 공통 함수
│   │   ├── actions/         # 서버 액션 함수
│   │   ├── prisma.ts        # Prisma 클라이언트 설정
│   │   ├── env.ts           # 환경 변수 관리
│   │   └── fonts.ts         # 폰트 설정
│   ├── types/               # TypeScript 타입 정의
│   ├── auth.ts              # Auth.js 설정
│   └── middleware.ts        # Next.js 15 향상된 미들웨어
├── .env                     # 환경 변수 파일 (gitignore에 포함)
├── next.config.ts           # Next.js 15 최적화 설정
├── package.json             # 프로젝트 의존성 및 스크립트
└── tsconfig.json            # TypeScript 설정
```

## 🛠️ Tech Stack

### Next.js 15 ⚡

최신 버전의 Next.js 프레임워크로 최첨단 웹 개발 기능을 제공합니다.

- **App Router**: 완전한 App Router 구조 채택
- **Server Components**: 서버 사이드 렌더링 최적화
- **Server Actions**: 타입 안전한 서버 액션
- **Turbopack**: 초고속 개발 빌드 시스템
- **Dynamic IO**: 향후 비동기 최적화 준비
- **Enhanced Middleware**: 보안 및 성능 강화된 미들웨어

### Auth.js (NextAuth) 🔐

차세대 인증 시스템으로 안전하고 유연한 인증을 제공합니다.

- [Auth.js 공식 문서](https://authjs.dev/)
- Google OAuth 인증 지원
- Prisma 어댑터를 통한 데이터베이스 연동
- JWT 세션 관리

### shadcn/ui 💎

접근성과 사용자 경험을 고려한 최신 UI 컴포넌트 라이브러리입니다.

- Radix UI 기반의 접근성 높은 컴포넌트
- Tailwind CSS v4를 활용한 스타일링
- 테마 커스터마이징 용이

### next-themes 🌙

다크 모드 및 테마 관리를 위한 라이브러리입니다.

- 시스템 설정 기반 테마 적용
- 사용자 테마 선택 지원
- [다크 모드 구현 가이드](https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4)

### Prisma ORM 🗄️

차세대 타입 안전한 데이터베이스 ORM입니다.

- [Prisma with Next.js](https://www.prisma.io/docs/guides/nextjs)
- PostgreSQL 데이터베이스 지원
- 마이그레이션 및 스키마 관리
- [Auth.js 어댑터 통합](https://authjs.dev/getting-started/adapters/prisma)

### next-intl 🌐

강력한 다국어 지원을 위한 라이브러리입니다.

- [next-intl 공식 문서](https://next-intl.dev/)
- 메시지 번역 및 포맷팅
- 타임존 지원
- [Auth.js와의 통합 예제](https://github.com/amannn/next-intl/tree/main/examples/example-app-router-next-auth)

### Tiptap Editor 📝

확장 가능한 현대적 리치 텍스트 에디터입니다.

- 마크다운 스타일 편집 지원
- 이미지, 링크 등 다양한 확장 기능
- URL 자동 감지 및 미리보기 기능

### Tailwind CSS v4 🎨

차세대 유틸리티 우선 CSS 프레임워크입니다.

- 반응형 디자인 지원
- 다크 모드 완전 통합
- 커스텀 디자인 시스템 구축 용이
- 성능 최적화된 CSS 생성

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 이상
- PostgreSQL 데이터베이스
- Google OAuth 애플리케이션 (소셜 로그인용)

### Installation

1. **저장소 클론**

   ```bash
   git clone https://github.com/your-repo/hello-nextjs15-boilerplate-by-v0.git
   cd hello-nextjs15-boilerplate-by-v0
   ```

2. **의존성 설치**

   ```bash
   pnpm install
   # 또는 npm install
   ```

3. **환경 변수 설정**

   ```bash
   cp .env.example .env
   # .env 파일을 편집하여 필요한 환경 변수를 설정
   ```

4. **데이터베이스 설정**

   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

5. **개발 서버 실행**
   ```bash
   pnpm dev
   ```

### Scripts

- `pnpm dev` - Turbopack을 사용한 개발 서버 실행
- `pnpm build` - 프로덕션 빌드
- `pnpm start` - 프로덕션 서버 실행
- `pnpm lint` - ESLint 실행
- `pnpm ui:add` - shadcn/ui 컴포넌트 추가

## 🎯 Next.js 15 최적화 특징

### 성능 최적화

- **번들 최적화**: 향상된 번들링 및 트리 쉐이킹
- **이미지 최적화**: WebP, AVIF 포맷 지원
- **폰트 최적화**: 프리로드 및 캐싱 최적화

### 보안 강화

- **CSP 헤더**: Content Security Policy 적용
- **보안 헤더**: XSS, CSRF 등 보안 위협 방어
- **Nonce 기반 스크립트**: 안전한 인라인 스크립트

### 개발자 경험

- **타입 안전성**: 완전한 TypeScript 지원
- **Hot Reload**: Turbopack 기반 초고속 리로드
- **에러 처리**: 향상된 에러 바운더리 및 디버깅

## 📚 Additional Resources

### 폰트

- **Pretendard**: 한글 웹 타이포그래피를 위한 고품질 폰트
  - [Pretendard 적용 가이드](https://white-blank.tistory.com/213)

### 배포

- **Vercel**: Next.js 15 최적화된 배포 플랫폼
- **Docker**: 컨테이너 기반 배포 지원

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

**Built with ❤️ using Next.js 15 and modern web technologies**
