# 실시간 메시지 기능 구현 작업 계획

커밋 b568063 "10.5 Realtime Messages" 참조

## 작업 순서 및 내용 요약

### 1단계: 브라우저 클라이언트 확인/준비
**목적:** 실시간 구독을 위한 브라우저 Supabase 클라이언트 확인 및 준비

**작업 내용:**
- `~/lib/supabase.client.ts` 파일 확인
- 브라우저 클라이언트 함수가 있는지 확인 (`createSupabaseBrowserClient` 또는 `browserClient`)
- 없으면 브라우저 클라이언트 함수 생성
- `window.ENV` 환경 변수 설정 확인 (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- `root.tsx`에서 환경 변수 주입 확인 필요

---

### 2단계: `messages-layout.tsx` 수정
**목적:** Outlet Context에 `name`, `avatar` 전달

**작업 내용:**
- `useOutletContext`에서 `currentUser` 추출
- `currentUser`에서 `name`, `avatar` 추출
- `<Outlet context={{ userId, name, avatar }} />`로 변경

**변경 위치:**
- `app/features/users/layouts/messages-layout.tsx`

---

### 3단계: `queries.ts` 수정
**목적:** 쿼리 최적화 및 실시간 처리 준비

**작업 내용:**
1. `getMessagesByMessagesRoomId` 함수 수정:
   - `sender:profiles!sender_id!inner(...)` join 제거
   - `select('*')`만 사용 (sender 정보는 클라이언트에서 처리)

2. `getRoomsParticipant` 함수 수정:
   - `profile_id` 필드 추가

**변경 위치:**
- `app/features/users/queries.ts`

---

### 4단계: `message-page.tsx` 수정
**목적:** 실시간 메시지 구독 및 상태 관리 추가

**작업 내용:**

#### 4-1. Import 추가
- 브라우저 클라이언트 함수 import (현재 프로젝트 구조에 맞게)
- `useState` from `react`
- `Database` type (필요시)

#### 4-2. State 추가
```typescript
const [messages, setMessages] = useState<Message[]>(initialMessages || []);
```

#### 4-3. 실시간 구독 로직 추가
- `useEffect`에서 `messageRoomId` 추출 (URL에서)
- 브라우저 클라이언트로 채널 생성
- `postgres_changes` 이벤트 리스너 추가:
  - `event: "INSERT"`
  - `schema: "public"`
  - `table: "messages"`
  - `filter: message_room_id=eq.${messageRoomId}`
- 새 메시지 수신 시 `setMessages`로 추가
- cleanup 함수에서 `unsubscribe()` 호출

#### 4-4. 렌더링 수정
- `loaderData.messages` → `messages` state 사용
- Avatar/Name 표시 로직 수정:
  - `message.sender_id === userId`면 outlet context의 `avatar`, `name` 사용
  - 아니면 `loaderData.participant?.profile` 사용

#### 4-5. 성능 최적화
- `export const shouldRevalidate = () => false;` 추가

**변경 위치:**
- `app/features/users/pages/message-page.tsx`

---

### 5단계: 테스트
**목적:** 실시간 메시지 기능 동작 확인

**테스트 항목:**
1. 메시지 전송 후 즉시 화면에 표시되는지 확인
2. 다른 브라우저/탭에서도 실시간 반영되는지 확인
3. 메시지 상태가 올바르게 관리되는지 확인
4. 페이지 이동 시 구독이 정리되는지 확인

---

## 주의사항

### 1. 파일/함수 이름 차이
- **커밋:** `makeSSRClient`, `browserClient` from `~/supa-client`
- **현재 프로젝트:** `createSupabaseServerClient`, 브라우저 클라이언트 함수 확인 필요

### 2. 환경 변수 설정
- 브라우저 클라이언트는 `window.ENV`가 필요함
- `root.tsx`에서 환경 변수 주입 확인 필요

### 3. 타입 정의
- `Message` 타입은 `Database["public"]["Tables"]["messages"]["Row"]` 사용

---

## 참고 커밋
- 커밋 해시: `b568063272e4032a0529b3c2c9c2cd1079f145de`
- 커밋 메시지: "10.5 Realtime Messages"
- 부모 커밋: `70224a3` (10.4 Sending Message)

