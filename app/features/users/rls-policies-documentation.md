# 메시지 테이블 RLS 정책 설명

## 개요

메시지 관련 테이블(`messages`, `message_rooms`, `message_room_members`)에 Row Level Security (RLS)가 활성화되어 있습니다. 이를 통해 사용자는 자신이 속한 메시지 룸의 데이터만 접근할 수 있습니다.

## 활성화된 테이블

- ✅ `message_rooms` - 메시지 룸 테이블
- ✅ `message_room_members` - 메시지 룸 멤버 테이블
- ✅ `messages` - 메시지 테이블

## RLS 정책 상세

### message_rooms 테이블

#### 1. SELECT 정책: "Users can read message rooms they belong to"
- **목적**: 사용자가 속한 메시지 룸만 읽을 수 있음
- **조건**: `message_room_members` 테이블에 해당 사용자의 멤버십이 존재해야 함

#### 2. INSERT 정책: "Users can create message rooms"
- **목적**: 인증된 사용자는 새 메시지 룸을 생성할 수 있음
- **조건**: `authenticated` 역할 필요

### message_room_members 테이블

#### 1. SELECT 정책: "Users can read their own room memberships"
- **목적**: 사용자가 자신의 멤버십 또는 같은 룸의 다른 멤버들을 볼 수 있음
- **조건**: 
  - 자신의 멤버십이거나
  - 같은 룸의 다른 멤버

#### 2. INSERT 정책: "Users can join message rooms"
- **목적**: 사용자가 자신을 메시지 룸에 추가할 수 있음
- **조건**: `profile_id`가 현재 사용자의 `auth.uid()`와 일치해야 함

### messages 테이블

#### 1. SELECT 정책: "Users can read messages from their rooms"
- **목적**: 사용자가 속한 메시지 룸의 메시지만 읽을 수 있음
- **조건**: `message_room_members` 테이블에 해당 사용자의 멤버십이 존재해야 함

#### 2. INSERT 정책: "Users can send messages to their rooms"
- **목적**: 사용자가 속한 메시지 룸에만 메시지를 보낼 수 있음
- **조건**:
  - `sender_id`가 현재 사용자의 `auth.uid()`와 일치해야 함
  - 해당 메시지 룸의 멤버여야 함

#### 3. UPDATE 정책: "Users can update their own messages"
- **목적**: 사용자가 자신이 보낸 메시지만 수정할 수 있음
- **조건**: `sender_id`가 현재 사용자의 `auth.uid()`와 일치해야 함

#### 4. DELETE 정책: "Users can delete their own messages"
- **목적**: 사용자가 자신이 보낸 메시지만 삭제할 수 있음
- **조건**: `sender_id`가 현재 사용자의 `auth.uid()`와 일치해야 함

## Realtime과의 관계

Supabase Realtime은 RLS 정책을 자동으로 따릅니다. 따라서:

- ✅ 사용자는 자신이 접근할 수 있는 메시지만 실시간으로 수신합니다
- ✅ RLS 정책에 의해 필터링된 데이터만 `postgres_changes` 이벤트로 전달됩니다
- ✅ 보안이 데이터베이스 레벨에서 보장됩니다

## 보안 보장

이러한 RLS 정책을 통해:

1. **데이터 격리**: 사용자는 자신이 속한 메시지 룸의 데이터만 접근 가능
2. **무단 접근 방지**: 다른 사용자의 메시지나 메시지 룸에 접근 불가
3. **실시간 보안**: Realtime 구독도 RLS 정책을 따르므로 안전하게 작동
4. **서버 측 보안**: 애플리케이션 코드 레벨에서의 보안 검증 없이도 데이터베이스 레벨에서 보안 보장

## 테스트

RLS 정책이 올바르게 작동하는지 테스트하려면:

1. 다른 사용자로 로그인하여 다른 사람의 메시지 룸에 접근 불가능한지 확인
2. Realtime 구독 시 자신이 속한 룸의 메시지만 수신되는지 확인
3. 메시지 전송 시 자신이 속한 룸에만 전송되는지 확인

