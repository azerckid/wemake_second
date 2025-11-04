# 환경 변수 설정 안내

## 필요한 환경 변수

다음 환경 변수들을 `.env` 파일에 설정하세요:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Service Role Key (RLS 우회용)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 환경 변수 얻는 방법

### 1. OpenAI API Key
- OpenAI Dashboard: https://platform.openai.com/api-keys
- 새 API 키 생성 또는 기존 키 확인

### 2. Supabase Service Role Key
- Supabase Dashboard: https://supabase.com/dashboard/project/araxhycujuxowmzfjtkd/settings/api
- "Service Role" 키 확인 (주의: 이 키는 절대 브라우저에 노출되면 안 됩니다!)

## 중요 사항

⚠️ **보안 경고**:
- `SUPABASE_SERVICE_ROLE_KEY`는 RLS를 우회하는 강력한 키입니다
- 절대 브라우저에 노출되지 않도록 주의하세요
- `.env` 파일은 `.gitignore`에 포함되어 있는지 확인하세요

## 다음 단계

환경 변수를 설정한 후, 3단계로 진행하여 서버 사이드 Admin 클라이언트를 생성합니다.

