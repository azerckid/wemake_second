# 🔐 Supabase SSR Authentication Setup

## 📦 설치된 패키지

```bash
npm install @supabase/ssr
```

## 🏗️ 구조

### 1. Server-Side Client (`app/lib/supabase.server.ts`)

서버 사이드에서 Supabase를 사용하기 위한 유틸리티 함수들:

- `createSupabaseServerClient(request)` - Request에서 쿠키를 읽어 Supabase 클라이언트 생성
  - 쿠키 기반 인증 처리
  - undefined 쿠키 값 자동 필터링
  - 타입 안전성 보장
- `getSession(request)` - 현재 사용자 세션 가져오기
- `getUser(request)` - 현재 사용자 정보 가져오기
- `getUserProfile(request)` - 현재 사용자 프로필 정보 가져오기
  - `profile_id`로 auth.users.id와 연결
- `requireAuth(request)` - 인증 필수 (미인증 시 401 에러)
- `requireProfile(request)` - 프로필 필수 (미인증 시 401 에러)

**✅ 타입 안전성:**
- TypeScript 완전 지원
- 쿠키 타입 가드로 런타임 안전성 확보
- Database 타입과 완벽한 호환

### 2. Client-Side Client (`app/lib/supabase.client.ts`)

브라우저에서 Supabase를 사용하기 위한 클라이언트:

- `createSupabaseBrowserClient()` - 브라우저용 Supabase 클라이언트 (싱글톤)
  - 브라우저 환경 자동 체크
  - 환경 변수 유효성 검증
  - 명확한 에러 메시지 제공

**✅ 안전장치:**
- SSR 환경에서 호출 시 명확한 에러 발생
- 환경 변수 누락 시 즉시 감지
- 클라이언트 재사용으로 성능 최적화

### 3. Root Loader (`app/root.tsx`)

모든 페이지에서 세션 정보를 사용할 수 있도록 root loader에서 세션을 로드합니다:

```typescript
export async function loader({ request }: Route.LoaderArgs) {
  const { headers } = createSupabaseServerClient(request);
  const session = await getSession(request);
  const profile = session ? await getUserProfile(request) : null;

  return {
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
    session,
    profile,
    headers,
  };
}
```

## 🎯 사용 예시

### 1. 페이지에서 세션 확인

```typescript
// 인증 필수 페이지
export const loader = async ({ request }: Route.LoaderArgs) => {
  await requireAuth(request);
  // 인증되지 않은 경우 401 에러 자동 발생
  // ... 나머지 로직
};

// 프로필 필수 페이지
export const loader = async ({ request }: Route.LoaderArgs) => {
  const profile = await requireProfile(request);
  // profile은 항상 존재하거나 401 에러 발생
  // TypeScript가 자동으로 타입 추론
  return { profileName: profile.name }; // ✅ 타입 안전
};
```

### 2. 사용자 데이터 로드

```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  const profile = await requireProfile(request);
  
  // 사용자의 claimed ideas 가져오기
  const claimedIdeas = await getUserClaimedIdeas(profile.profile_id);
  
  return { claimedIdeas, profile };
};
```

### 3. 컴포넌트에서 세션 사용

```typescript
export default function MyPage({ loaderData }: Route.ComponentProps) {
  const { profile, claimedIdeas } = loaderData;
  
  return (
    <div>
      <h1>Welcome, {profile.name}!</h1>
      {/* ... */}
    </div>
  );
}
```

## 📝 업데이트된 페이지들

### ✅ 보호된 페이지 (인증 필요)

- `/my/dashboard` - Dashboard 메인
- `/my/dashboard/products` - 제품 대시보드
- `/my/dashboard/ideas` - 클레임한 아이디어 (실제 세션 데이터 사용)

### 🔄 변경 사항

#### `dashboard-ideas-page.tsx`

**Before:**
```typescript
const currentUserProfileId = "67ac33ac-e49c-4c36-8d71-f12fdaea0e4f"; // 하드코딩
```

**After:**
```typescript
const profile = await requireProfile(request);
const claimedIdeas = await getUserClaimedIdeas(profile.profile_id);
```

## 🚨 주의사항

### Profile ID = User ID

현재 데이터베이스 스키마에서:
- `profiles.profile_id` = `auth.users.id` (동일한 값)
- `profile_id`가 곧 user의 식별자입니다
- 별도의 `user_id` 컬럼은 없습니다
- `profile_id`는 `auth.users` 테이블의 `id`를 참조하는 FK입니다

### 환경 변수

`.env` 파일에 다음 환경 변수가 필요합니다:

```env
SUPABASE_URL=https://araxhycujuxowmzfjtkd.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
```

## 🔍 기술적 세부사항

### 쿠키 타입 가드 구현

```typescript
// app/lib/supabase.server.ts
getAll() {
    const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
    // undefined 값을 가진 쿠키 필터링
    return cookies.filter((cookie): cookie is { name: string; value: string } => 
        cookie.value !== undefined
    );
}
```

**이유:**
- `parseCookieHeader`는 `value?: string`을 반환
- Supabase는 `value: string` (non-optional)을 요구
- 타입 가드로 타입 좁히기 및 런타임 안전성 확보

### 브라우저 클라이언트 안전성

```typescript
// app/lib/supabase.client.ts
export function createSupabaseBrowserClient() {
    // 1. 싱글톤 패턴으로 재사용
    if (client) return client;
    
    // 2. SSR 환경 체크
    if (typeof window === "undefined") {
        throw new Error("createSupabaseBrowserClient can only be called in the browser");
    }
    
    // 3. 환경 변수 검증
    if (!window.ENV?.SUPABASE_URL || !window.ENV?.SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
    }
    
    // 4. 클라이언트 생성
    client = createBrowserClient<Database>(...);
    return client;
}
```

## 🛠️ 트러블슈팅

### 1. TypeScript 에러: "No overload matches this call"

**문제:** 쿠키 타입 불일치
**해결:** 타입 가드로 undefined 필터링

### 2. "window is not defined" 에러

**문제:** 서버에서 브라우저 클라이언트 호출
**해결:** `createSupabaseServerClient` 사용

### 3. "Missing Supabase environment variables"

**문제:** `window.ENV`가 정의되지 않음
**해결:** `root.tsx`의 loader와 Layout에서 ENV 주입 확인

### 4. 401 Unauthorized 에러

**문제:** 인증되지 않은 상태로 보호된 페이지 접근
**해결:** 
- 로그인 페이지로 리다이렉트 구현 필요
- 또는 `requireAuth` 대신 `getUser`로 optional 처리

## 🔧 다음 단계

1. **로그인/회원가입 플로우 구현**
   - `/auth/login` 페이지 완성
   - `/auth/join` 페이지 완성
   - OAuth 플로우 구현

2. **로그아웃 기능 추가**
   - 로그아웃 액션 생성
   - Navigation 컴포넌트에 로그아웃 버튼 추가

3. **추가 보호 기능**
   - 미인증 사용자 리다이렉트
   - 권한 기반 접근 제어 (Role-based)

4. **사용자 경험 개선**
   - 세션 만료 처리
   - 자동 리프레시
   - 에러 핸들링 개선

## ⚡ 성능 최적화

### 1. 클라이언트 재사용
```typescript
// ✅ Good: 싱글톤 패턴
const client = createSupabaseBrowserClient(); // 한 번만 생성

// ❌ Bad: 매번 새로 생성
function MyComponent() {
  const client = createBrowserClient(...); // 렌더링마다 생성
}
```

### 2. 세션 캐싱
```typescript
// Root loader에서 한 번만 로드
// 모든 자식 라우트에서 재사용 가능
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  return { session }; // 캐시됨
}
```

### 3. 선택적 프로필 로드
```typescript
// ✅ Good: 필요한 경우만 프로필 로드
const user = await getUser(request);
if (user && needsProfile) {
  const profile = await getUserProfile(request);
}

// ❌ Bad: 항상 프로필 로드
const profile = await getUserProfile(request); // 불필요한 DB 쿼리
```

## 📋 베스트 프랙티스

### 1. 에러 처리
```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const profile = await requireProfile(request);
    return { profile };
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      // 로그인 페이지로 리다이렉트
      return redirect("/auth/login");
    }
    throw error;
  }
};
```

### 2. 타입 안전성
```typescript
// ✅ Good: 타입 추론 활용
const profile = await requireProfile(request);
console.log(profile.name); // ✅ TypeScript가 타입 인식

// ❌ Bad: any 타입
const profile: any = await getUserProfile(request);
console.log(profile.name); // ⚠️ 타입 체크 없음
```

### 3. 조건부 렌더링
```typescript
export default function App({ loaderData }: Route.ComponentProps) {
  const isLoggedIn = !!loaderData?.session;
  
  return (
    <>
      {isLoggedIn ? <UserMenu /> : <LoginButton />}
    </>
  );
}
```

## 🎓 학습한 내용

1. **타입 가드의 중요성**
   - 런타임과 컴파일 타임 모두에서 안전성 확보
   - `cookie is { name: string; value: string }` 패턴 활용

2. **SSR vs CSR 클라이언트 분리**
   - 서버: `createSupabaseServerClient` (쿠키 기반)
   - 클라이언트: `createSupabaseBrowserClient` (localStorage 기반)

3. **환경 변수 주입**
   - 서버 환경 변수를 안전하게 클라이언트에 전달
   - `<script>` 태그로 `window.ENV` 주입

4. **인증 패턴**
   - `getUser`: Optional 인증 (null 반환)
   - `requireAuth`: Mandatory 인증 (401 에러)

## 📚 참고 자료

- [Supabase SSR 공식 문서](https://supabase.com/docs/guides/auth/server-side-rendering)
- [React Router 인증 가이드](https://reactrouter.com/en/main/guides/authentication)
- [TypeScript Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

