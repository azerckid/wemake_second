# Supabase CRON Jobs 설정 가이드

## 개요

`/ideas/generate` 엔드포인트를 CRON Jobs 전용으로 변경했으므로, 이제 Supabase에서 이 엔드포인트를 주기적으로 호출하는 CRON Job을 설정해야 합니다.

```
임시로 외부 url 받는 방법
cloudflared tunnel --url http://localhost:5173/  
```

## 방법 1: Supabase Dashboard 사용 (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard/project/araxhycujuxowmzfjtkd/integrations/cron/jobs

2. **CRON Job 생성**
   - "Create job" 버튼 클릭
   - Job 이름: `generate-ideas` (소문자, 대시 사용)
   - Schedule: `0 */6 * * *` (6시간마다) 또는 원하는 스케줄
   - Type: "HTTP Request" 선택

3. **HTTP Request 설정**
   - Method: `POST`
   - URL: `https://your-domain.com/ideas/generate` (실제 배포 URL)
   - Headers:
     ```
     Content-Type: application/json
     X-POTATO: X-TOMATO
     ```
   - Body: `{}` (빈 JSON 객체)

4. **저장**
   - "Save cron job" 클릭

## 방법 2: SQL을 사용한 설정

Supabase SQL Editor에서 다음 SQL을 실행:

```sql
-- pg_cron extension 활성화 (필요한 경우)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- CRON Job 생성
-- 6시간마다 실행 (매일 00:00, 06:00, 12:00, 18:00)
SELECT cron.schedule(
    'generate-ideas', -- Job 이름
    '0 */6 * * *',    -- Cron 스케줄 (6시간마다)
    $$
    SELECT net.http_post(
        url := 'https://your-domain.com/ideas/generate',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'X-POTATO', 'X-TOMATO'
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 300000  -- 5분 타임아웃
    ) as request_id;
    $$
);
```

**참고**: `pg_net` extension이 필요합니다. 활성화되지 않은 경우:

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## Cron 스케줄 예시

```
┌───────────── min (0 - 59)
│ ┌────────────── hour (0 - 23)
│ │ ┌─────────────── day of month (1 - 31)
│ │ │ ┌──────────────── month (1 - 12)
│ │ │ │ ┌───────────────── day of week (0 - 6)
│ │ │ │ │
* * * * *
```

### 자주 사용하는 스케줄:

- **매일 자정**: `0 0 * * *`
- **6시간마다**: `0 */6 * * *`
- **매일 오전 9시**: `0 9 * * *`
- **30초마다** (테스트용): `30 seconds` (Postgres 15.1.1.61 이상 필요)
- **매주 월요일 오전 9시**: `0 9 * * 1`

## CRON Job 관리

### Job 수정

```sql
SELECT cron.alter_job(
    job_id := (SELECT jobid FROM cron.job WHERE jobname = 'generate-ideas'),
    schedule := '0 */12 * * *'  -- 12시간마다로 변경
);
```

### Job 활성화/비활성화

```sql
-- 비활성화
SELECT cron.alter_job(
    job_id := (SELECT jobid FROM cron.job WHERE jobname = 'generate-ideas'),
    active := false
);

-- 활성화
SELECT cron.alter_job(
    job_id := (SELECT jobid FROM cron.job WHERE jobname = 'generate-ideas'),
    active := true
);
```

### Job 실행 기록 확인

```sql
SELECT *
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'generate-ideas')
ORDER BY start_time DESC
LIMIT 10;
```

### Job 삭제

```sql
SELECT cron.unschedule('generate-ideas');
```

## 환경 변수 설정

배포 환경에서 다음 환경 변수들이 설정되어 있어야 합니다:

- `OPENAI_API_KEY`: OpenAI API 키
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role 키
- `SUPABASE_URL`: Supabase 프로젝트 URL

## 보안 주의사항

1. **헤더 검증**: `X-POTATO: X-TOMATO` 헤더가 없으면 요청이 거부됩니다.
2. **POST 요청만 허용**: GET 요청은 404를 반환합니다.
3. **Service Role Key**: 데이터베이스에 직접 접근할 수 있는 권한이 필요합니다.

## 테스트

로컬 개발 환경에서 테스트하려면:

```bash
# POST 요청으로 테스트
curl -X POST http://localhost:5173/ideas/generate \
  -H "Content-Type: application/json" \
  -H "X-POTATO: X-TOMATO" \
  -d '{}'
```

성공하면 `{"ok": true, "count": 10, "insertedIds": [...]}` 형태의 응답을 받아야 합니다.

## 문제 해결

### CRON Job이 실행되지 않는 경우

1. **Extension 확인**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_cron';
   SELECT * FROM pg_extension WHERE extname = 'pg_net';
   ```

2. **Job 상태 확인**
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'generate-ideas';
   ```

3. **실행 기록 확인**
   ```sql
   SELECT * FROM cron.job_run_details
   WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'generate-ideas')
   ORDER BY start_time DESC;
   ```

4. **HTTP 응답 확인** (pg_net 사용 시)
   ```sql
   SELECT * FROM net._http_response
   ORDER BY created_at DESC
   LIMIT 10;
   ```

## 참고 자료

- [Supabase CRON Jobs 문서](https://supabase.com/docs/guides/cron/quickstart)
- [pg_cron 문서](https://github.com/citusdata/pg_cron)
- [pg_net 문서](https://supabase.com/docs/guides/database/extensions/pg_net)

