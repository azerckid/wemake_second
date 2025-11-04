# ⚠️ Service Role Key 설정 오류 해결

## 문제 발견

로그에서 확인된 문제:
```
SUPABASE_SERVICE_ROLE_KEY: ✅ Set (length: 26)
Service Role Key prefix: your_service_role_key_here...
```

**문제**: `.env` 파일에 실제 키가 아닌 예시 텍스트(`your_service_role_key_here`)가 설정되어 있습니다.

## 해결 방법

### 1. Supabase Dashboard에서 실제 키 복사

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard/project/araxhycujuxowmzfjtkd/settings/api

2. **Service Role 키 찾기**
   - 두 번째 섹션에서 "service_role" 라벨이 있는 키 찾기
   - "secret" 태그가 붙어있는 키입니다
   - ⚠️ 경고: "This key has the ability to bypass Row Level Security..."

3. **키 복사**
   - 키 옆의 "Copy" 버튼 클릭
   - 전체 키를 복사 (200자 이상의 긴 문자열)

### 2. .env 파일에 실제 키 설정

`.env` 파일을 열어서 다음을 수정:

```env
# ❌ 잘못된 예시 (이것을 제거!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ✅ 올바른 형식 (실제 키를 붙여넣기)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyYXhoeWN1anV4b3dtemZqdGtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0NDM4MywiZXhwIjoyMDc2NjIwMzgzfQ...
```

**중요 사항**:
- 키 앞뒤에 공백이나 따옴표(`"`, `'`)를 넣지 마세요
- 키는 한 줄에 있어야 합니다
- 전체 키를 복사해야 합니다 (일부만 복사하면 안 됩니다)

### 3. 서버 재시작

환경 변수를 변경한 후 **반드시 서버를 재시작**하세요:

```bash
# 개발 서버 중지 (Ctrl+C)
# 그 다음 다시 시작
npm run dev
```

### 4. 확인

서버 재시작 후 콘솔 로그를 확인하세요:

```
🔍 Environment variables check:
SUPABASE_URL: ✅ Set (length: 40)
SUPABASE_SERVICE_ROLE_KEY: ✅ Set (length: 200+)  ← 200자 이상이어야 함!
Service Role Key prefix: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← 실제 JWT 토큰이어야 함!
```

## Service Role Key 특징

- **길이**: 보통 200자 이상의 긴 문자열
- **형식**: JWT 토큰 (`eyJ...`로 시작)
- **위치**: Supabase Dashboard → Settings → API → Service Role 섹션
- **라벨**: "service_role" + "secret" 태그

## 주의사항

⚠️ **보안 경고**:
- 이 키는 절대 브라우저에 노출되면 안 됩니다
- GitHub에 커밋하지 마세요
- `.env` 파일이 `.gitignore`에 포함되어 있는지 확인하세요

