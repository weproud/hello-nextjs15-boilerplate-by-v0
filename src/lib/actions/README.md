# Actions Library

이 라이브러리는 Next.js 15와 `next-safe-action` v8을 사용하여 타입 안전한 서버 액션을 구현합니다.

## 주요 업데이트 사항 (v8)

### Schema → InputSchema 변경

`next-safe-action` v8에서 `schema()` 메서드가 `inputSchema()`로 변경되었습니다. 

**이전 (deprecated):**
```typescript
authActionClient.schema(schema)
```

**현재 (권장):**
```typescript
authActionClient.inputSchema(schema)
```

> `schema()` 메서드는 여전히 호환성을 위해 지원되지만, `inputSchema()`를 사용하는 것이 권장됩니다.

## 사용법

### 1. 인증이 필요한 액션

```typescript
import { createAuthAction } from "@/lib/actions/auth-handlers";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  content: z.string(),
});

export const createPost = createAuthAction(schema).action(
  async ({ parsedInput, ctx }) => {
    // ctx.user.id 사용 가능
    console.log("사용자 ID:", ctx.user.id);
    
    // 비즈니스 로직 구현
    return { success: true };
  }
);
```

### 2. 공개 액션

```typescript
import { createPublicAction } from "@/lib/actions/auth-handlers";
import { z } from "zod";

const schema = z.object({
  query: z.string(),
});

export const searchPosts = createPublicAction(schema).action(
  async ({ parsedInput, ctx }) => {
    // ctx.session은 선택적으로 사용 가능
    console.log("세션:", ctx.session);
    
    // 비즈니스 로직 구현
    return { results: [] };
  }
);
```

## 클라이언트 구조

### baseActionClient
- 기본 액션 클라이언트
- 오류 처리 및 검증 오류 형태 설정

### authActionClient
- 인증이 필요한 액션용 클라이언트
- 세션 확인 및 사용자 정보를 컨텍스트에 추가
- 인증 실패 시 로그인 페이지로 리다이렉트

### publicActionClient
- 인증이 필요 없는 액션용 클라이언트
- 선택적으로 세션 정보 제공

## 에러 처리

- 개발 환경: 자세한 오류 메시지 반환
- 프로덕션 환경: 일반적인 오류 메시지 반환
- 검증 오류는 flattened 형태로 반환

## 마이그레이션 가이드

기존 코드에서 deprecated된 함수들:
- `withAuth` → `createAuthAction` 사용
- `withoutAuth` → `createPublicAction` 사용
- 직접 `schema()` 호출 → `inputSchema()` 사용

## 주요 개선 사항

### 1. 타입 안전성
- Zod 스키마를 통한 자동 유효성 검사
- TypeScript 타입 추론
- 런타임 타입 체킹

### 2. 에러 핸들링
- 통합된 에러 처리 메커니즘
- 개발/프로덕션 환경별 에러 메시지
- 자동 유효성 검사 에러 포맷팅

### 3. 인증 통합
- 자동 세션 확인
- 컨텍스트를 통한 사용자 정보 전달
- 권한 기반 액션 분리

## 장점

1. **중복 코드 제거**: 유효성 검사와 인증 로직이 자동화됨
2. **타입 안전성**: 컴파일 타임에 타입 체크
3. **일관된 에러 처리**: 표준화된 에러 응답
4. **더 나은 개발자 경험**: 자동완성과 타입 추론
5. **유지보수성**: 구조화된 코드와 명확한 관심사 분리

## 파일 구조

```
src/lib/actions/
├── auth-handlers.ts    # 액션 클라이언트 및 헬퍼
├── post-actions.ts     # 게시글 관련 액션
└── README.md          # 이 문서
``` 