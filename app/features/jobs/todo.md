# Job Apply 페이지 구현 작업 순서

## 1. 데이터베이스 스키마 설계
   - **목적**: job applications 저장할 테이블 설계
   - **작업**:
     - `job_applications` 테이블 구조 설계
       - 필수 필드: `application_id`, `job_id`, `profile_id`, `introduction`, `resume_url` (선택), `status` (pending/approved/rejected), `created_at`, `updated_at`
     - team_members 테이블 구조를 참고해서 비슷한 패턴으로 설계

## 2. Drizzle Schema 정의
   - **파일**: `app/features/jobs/schema.ts`
   - **작업**:
     - `jobApplications` 테이블 정의 추가
     - 필요한 enum 타입 정의 (status 등)
     - Foreign key 관계 설정 (jobs, profiles)
     - TypeScript 타입 추론 타입 정의 (`InsertJobApplication`, `SelectJobApplication`)

## 3. 데이터베이스 마이그레이션 생성
   - **작업**:
     - 새로운 마이그레이션 파일 생성 (`app/sql/migrations/0014_add_job_applications_table.sql`)
     - `job_applications` 테이블 생성 SQL 작성
     - 필요한 인덱스 추가 (job_id, profile_id 등)
     - Foreign key 제약 조건 추가

## 4. Mutations 함수 작성
   - **파일**: `app/features/jobs/mutations.ts`
   - **작업**:
     - `applyToJob` 함수 추가
       - 파라미터: `job_id`, `profile_id`, `introduction`, `resume_url` (선택)
       - 중복 지원 체크 로직 (이미 지원했는지 확인)
       - 새 지원 생성 또는 기존 지원 업데이트

## 5. Queries 함수 작성
   - **파일**: `app/features/jobs/queries.ts`
   - **작업**:
     - `getJobApplication` 함수 추가 (특정 job에 대한 사용자 지원 정보 조회)
     - 필요시 `getJobApplicationsByJobId` 함수 추가 (특정 job의 모든 지원 조회)

## 6. Apply 페이지 생성
   - **파일**: `app/features/jobs/pages/apply-job-page.tsx`
   - **작업**:
     - `loader` 함수: job 정보와 기존 지원 정보(있다면) 가져오기
     - `action` 함수: 지원 폼 제출 처리
       - Zod schema로 validation (`introduction`, `resume_url` 등)
       - `applyToJob` mutation 호출
       - 성공 시 성공 메시지와 함께 리다이렉트 또는 현재 페이지 새로고침
     - `meta` 함수: 페이지 메타데이터
     - UI 컴포넌트:
       - Job 정보 표시 (position, company 등)
       - 지원 폼 (introduction textarea, resume_url input 등)
       - "Apply Now" 버튼 (로딩 상태 포함)
       - 성공/에러 메시지 표시

## 7. Routes 설정
   - **파일**: `app/routes.ts`
   - **작업**:
     - `/jobs/:jobId/apply` 라우트 추가
     - `apply-job-page.tsx` 파일과 연결

## 8. Job Page 수정
   - **파일**: `app/features/jobs/pages/job-page.tsx`
   - **작업**:
     - "Apply Now" 버튼 링크 수정
       - 기존: `/jobs/submit` (잘못된 링크)
       - 변경: `/jobs/${jobId}/apply`
     - 선택사항: 지원 여부 확인 및 UI 조건부 표시 (이미 지원한 경우 "Applied" 표시 등)

## 9. 선택적 개선 사항
   - 지원 상태 표시 (Applied, Pending 등)
   - 지원 취소 기능
   - 지원 목록 페이지 (마이 대시보드에 "My Applications" 추가)

---

## 작업 우선순위
- **필수**: 1-8 (기본 지원 기능 구현)
- **선택**: 9 (추가 기능)

**참고**: 위 순서대로 진행하면 체계적으로 Job Apply 기능을 구현할 수 있습니다.

