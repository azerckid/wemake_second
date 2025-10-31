# Teams 기능 개선 작업 순서

## 1. 데이터베이스 스키마 확인 및 설계
   - `team_members` 테이블에 `introduction` 컬럼 추가 필요 여부 확인
   - 현재 스키마에서 `introduction`을 어디에 저장할지 결정
     - 옵션 A: `team_members` 테이블에 `introduction` 컬럼 추가
     - 옵션 B: 별도 `team_applications` 테이블 생성
   - 적절한 데이터 타입 및 제약 조건 결정 (text, max length 등)

## 2. 데이터베이스 마이그레이션 작성
   - 새로운 마이그레이션 파일 생성 (`app/sql/migrations/`)
   - `introduction` 컬럼 추가 또는 새 테이블 생성 SQL 작성
   - 기존 데이터 마이그레이션 전략 수립 (필요시)

## 3. Drizzle Schema 업데이트
   - `app/features/teams/schema.ts` 수정
   - `teamMembers` 테이블에 `introduction` 필드 추가 또는 새 테이블 정의
   - 타입 정의 업데이트

## 4. Mutations 수정
   - `app/features/teams/mutations.ts`의 `applyToTeam` 함수 수정
   - `introduction` 필드를 올바른 컬럼에 저장하도록 변경
   - `role` 필드에서 `introduction`을 추출하는 로직 제거 또는 수정

## 5. Action 함수 개선 (성공 메시지)
   - `app/features/teams/pages/team-page.tsx`의 `action` 함수 수정
   - 성공 시 쿼리 파라미터로 성공 메시지 전달
   - 예: `redirect(`/teams/${teamId}?success=true`)`

## 6. Loader 함수 수정
   - `team-page.tsx`의 `loader` 함수에서 쿼리 파라미터 확인
   - `success` 파라미터가 있으면 성공 메시지 데이터 반환

## 7. UI 컴포넌트 업데이트
   - `team-page.tsx` 컴포넌트에 성공 메시지 표시 로직 추가
   - `loaderData`에서 성공 메시지 확인 후 표시
   - Alert 또는 Toast 컴포넌트로 성공 메시지 UI 추가
   - 성공 메시지는 자동으로 사라지거나 닫기 버튼 제공

## 8. 에러 처리 개선 (선택사항)
   - 이미 지원했을 경우 안내 메시지 표시
   - 중복 지원 시도 방지 로직 검토

## 9. 팀 리더 알림 기능 (선택사항, 나중에 구현)
   - 알림 테이블/시스템 확인
   - 팀 지원 시 팀 리더에게 알림 생성 로직 추가

## 작업 우선순위
- **필수**: 1-7 (데이터 저장 구조 수정 및 성공 메시지)
- **선택**: 8-9 (에러 처리 개선 및 알림)

---

**참고**: 위 순서대로 진행하면 문제를 단계적으로 해결할 수 있습니다.

