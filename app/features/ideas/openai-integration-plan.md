# OpenAI API를 사용한 아이디어 자동 생성 기능 적용 작업 순서

## 📋 작업 개요

OpenAI API를 사용하여 스타트업 아이디어를 자동 생성하는 기능을 추가합니다.

## 🔄 작업 순서

### **1단계: 의존성 설치**
- **파일**: `package.json`
- **작업**: `openai` 패키지 추가
- **명령어**: `npm install openai`
- **목적**: OpenAI API 클라이언트 라이브러리 설치

---

### **2단계: 환경 변수 설정 확인**
- **파일**: `.env` (또는 환경 변수 설정 파일)
- **필요한 환경 변수**:
  - `OPENAI_API_KEY` - OpenAI API 키
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase 서비스 역할 키 (RLS 우회용)
- **확인 사항**: 
  - `.env` 파일에 위 변수들이 설정되어 있는지 확인
  - 없으면 Supabase Dashboard에서 `SUPABASE_SERVICE_ROLE_KEY` 확인
  - OpenAI Dashboard에서 `OPENAI_API_KEY` 확인

---

### **3단계: 서버 사이드 Admin 클라이언트 생성**
- **파일**: `app/lib/supabase.server.ts`
- **작업**: `adminClient` 함수 추가
- **목적**: RLS를 우회하여 데이터베이스에 직접 접근할 수 있는 관리자 클라이언트 생성
- **주의사항**: 서버 사이드에서만 사용 가능, 절대 브라우저에 노출 금지

---

### **4단계: 아이디어 삽입 함수 추가**
- **파일**: `app/features/ideas/mutations.ts`
- **작업**: `insertIdeas` 함수 추가
- **기능**: 여러 아이디어를 `gpt_ideas` 테이블에 일괄 삽입
- **파라미터**: `client`, `ideas: string[]`

---

### **5단계: 아이디어 생성 페이지 생성**
- **파일**: `app/features/ideas/pages/generate-idea-page.tsx`
- **작업**: 새로운 페이지 컴포넌트 생성
- **기능**:
  - OpenAI API 호출 (GPT-4o 모델)
  - Zod 스키마를 사용한 Structured Output
  - 10개의 스타트업 아이디어 생성
  - 생성된 아이디어를 데이터베이스에 저장
- **주의사항**: 
  - `loader` 함수로 구현 (서버 사이드에서 실행)
  - OpenAI API 키 환경 변수 사용
  - `adminClient` 사용하여 RLS 우회

---

### **6단계: 라우트 추가**
- **파일**: `app/routes.ts`
- **작업**: `/ideas/generate` 라우트 추가
- **위치**: `ideas` prefix 내부에 추가
- **경로**: `/ideas/generate`

---

## 📝 작업 전 체크리스트

- [ ] OpenAI API 키 발급 확인
- [ ] Supabase Service Role Key 확인
- [ ] 환경 변수 설정 완료
- [ ] 현재 코드베이스 백업 (선택사항)

## ⚠️ 주의사항

1. **보안**: `SUPABASE_SERVICE_ROLE_KEY`는 절대 브라우저에 노출되면 안 됩니다
2. **비용**: OpenAI API 사용 시 비용이 발생할 수 있습니다
3. **환경 변수**: 프로덕션 환경에서도 환경 변수가 올바르게 설정되어 있는지 확인하세요
4. **RLS**: `adminClient`는 RLS를 우회하므로, 신뢰할 수 있는 서버 사이드 코드에서만 사용해야 합니다

## ✅ 작업 완료 후 확인 사항

- [ ] `npm install` 실행하여 의존성 설치 확인
- [ ] `/ideas/generate` 경로 접근 테스트
- [ ] OpenAI API 호출 성공 확인
- [ ] 데이터베이스에 아이디어가 저장되는지 확인
- [ ] 에러 처리 동작 확인

