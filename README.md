# hello-nextjs15-boilerplate-by-v0

## Project Summary

이 프로젝트는 Next.js 15를 기반으로 한 모던 웹 애플리케이션 보일러플레이트입니다. 다음과 같은 주요 기능을 제공합니다:

- **인증 시스템**: Auth.js(NextAuth)를 사용한 소셜 로그인(Google) 지원
- **다국어 지원**: next-intl을 통한 다국어 지원 (한국어, 영어)
- **다크 모드**: next-themes를 활용한 다크 모드 지원
- **UI 컴포넌트**: shadcn/ui를 활용한 모던하고 접근성 높은 UI 컴포넌트
- **데이터베이스**: Prisma ORM을 통한 PostgreSQL 데이터베이스 연동
- **리치 텍스트 에디터**: Tiptap 에디터를 활용한 게시글 작성 기능
- **URL 미리보기**: 게시글 내 URL 자동 감지 및 미리보기 기능
- **서버 액션**: Next.js의 Server Actions를 활용한 데이터 처리

이 보일러플레이트는 모던 웹 개발의 최신 트렌드와 기술을 적용하여 빠르게 프로젝트를 시작할 수 있도록 설계되었습니다.

## Project Architecture

```
hello-nextjs15-boilerplate-by-v0/
├── prisma/                  # Prisma ORM 설정 및 스키마
│   ├── schema.prisma        # 데이터베이스 스키마 정의
│   └── migrations/          # 데이터베이스 마이그레이션 파일
├── public/                  # 정적 파일 디렉토리
├── src/                     # 소스 코드
│   ├── app/                 # Next.js App Router 구조
│   │   ├── api/             # API 라우트
│   │   ├── auth/            # 인증 관련 페이지
│   │   ├── providers.tsx    # 앱 전체 프로바이더 설정
│   │   ├── layout.tsx       # 루트 레이아웃
│   │   └── page.tsx         # 메인 페이지
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── editor/          # Tiptap 에디터 관련 컴포넌트
│   │   ├── post/            # 게시글 관련 컴포넌트
│   │   ├── ui/              # UI 컴포넌트 (shadcn/ui)
│   │   └── ...
│   ├── lib/                 # 유틸리티 및 공통 함수
│   │   ├── actions/         # 서버 액션 함수
│   │   ├── prisma.ts        # Prisma 클라이언트 설정
│   │   ├── env.ts           # 환경 변수 관리
│   │   └── ...
│   ├── types/               # TypeScript 타입 정의
│   └── auth.ts              # Auth.js 설정
├── .env                     # 환경 변수 파일 (gitignore에 포함)
├── next.config.ts           # Next.js 설정
├── package.json             # 프로젝트 의존성 및 스크립트
└── tsconfig.json            # TypeScript 설정
```

## Tech Stack

### Next.js 15

최신 버전의 Next.js 프레임워크를 사용하여 서버 컴포넌트, 스트리밍, 서버 액션 등의 최신 기능을 활용합니다.

- App Router 구조 채택
- Server Components 및 Server Actions 활용
- Turbopack을 통한 빠른 개발 환경

### Auth.js (NextAuth)

안전하고 유연한 인증 시스템을 제공합니다.

- https://authjs.dev/
- Google OAuth 인증 지원
- Prisma 어댑터를 통한 데이터베이스 연동
- JWT 세션 관리

### shadcn/ui

접근성과 사용자 경험을 고려한 UI 컴포넌트 라이브러리입니다.

- Radix UI 기반의 접근성 높은 컴포넌트
- Tailwind CSS를 활용한 스타일링
- 테마 커스터마이징 용이

### next-themes

다크 모드 및 테마 관리를 위한 라이브러리입니다.

- 시스템 설정 기반 테마 적용
- 사용자 테마 선택 지원
- https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4

### Prisma

타입 안전한 데이터베이스 ORM입니다.

- https://www.prisma.io/docs/guides/nextjs
- PostgreSQL 데이터베이스 지원
- 마이그레이션 및 스키마 관리
- Auth.js 어댑터 통합
  https://authjs.dev/getting-started/adapters/prisma

### next-intl

다국어 지원을 위한 라이브러리입니다.

- https://next-intl.dev/
- 메시지 번역 및 포맷팅
- 타임존 지원
- Auth.js와의 통합
  https://github.com/amannn/next-intl/tree/main/examples/example-app-router-next-auth

### Tiptap Editor

확장 가능한 리치 텍스트 에디터입니다.

- 마크다운 스타일 편집 지원
- 이미지, 링크 등 다양한 확장 기능
- URL 자동 감지 및 미리보기 기능

### Tailwind CSS v4

유틸리티 우선 CSS 프레임워크입니다.

- 반응형 디자인 지원
- 다크 모드 통합
- 커스텀 디자인 시스템 구축 용이

## Etc

### Pretendard 폰트

한글 웹 타이포그래피를 위한 고품질 폰트입니다.

- https://white-blank.tistory.com/213
# lagompath
