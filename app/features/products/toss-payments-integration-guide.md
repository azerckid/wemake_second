# 토스페이먼츠(Toss Payments) 통합 가이드

## 개요

토스페이먼츠(Toss Payments)는 토스에서 제공하는 결제 솔루션입니다. 여러 결제 수단을 통합하여 제공하며, 간편한 SDK와 REST API를 제공합니다.

## 토스페이먼츠 주요 특징

- **통합 결제**: 신용카드, 계좌이체, 가상계좌, 휴대폰 결제 등 다양한 결제 수단 지원
- **간편 결제**: 토스페이, 카카오페이, 네이버페이 등 간편 결제 수단 지원
- **JavaScript SDK**: 브라우저에서 쉽게 결제 위젯을 통합할 수 있는 SDK 제공
- **REST API**: 서버 사이드에서 결제 승인 및 관리가 가능한 REST API 제공

## 현재 프로젝트 상태

`promote-page.tsx`에 "Go to checkout" 버튼이 있지만, 실제 결제 기능은 아직 구현되지 않았습니다.

현재 프로모션 페이지:
- 위치: `/products/promote`
- 기능: 제품 선택, 프로모션 기간 선택, 결제 금액 계산 (`${totalDays * 20}`)
- 결제 버튼: "Go to checkout" (아직 링크/기능 없음)

## 통합 방법

### 1. 토스페이먼츠 계정 및 API 키 발급

1. **토스페이먼츠 대시보드 접속**
   - https://developers.toss.im/ 접속
   - 계정 생성 및 로그인

2. **애플리케이션 생성**
   - 대시보드에서 "애플리케이션 추가" 클릭
   - 애플리케이션 이름 입력
   - 결제 환경 선택 (테스트/실서비스)

3. **API 키 발급**
   - **Client Key**: 프론트엔드에서 사용 (공개 키)
   - **Secret Key**: 백엔드에서 사용 (비밀 키, 절대 노출 금지)

4. **웹훅 설정**
   - 결제 완료/실패 알림을 받을 웹훅 URL 설정
   - 예: `https://your-domain.com/api/payments/webhook`

### 2. Checkout 페이지 생성

**파일 생성**: `app/features/products/pages/promote-checkout-page.tsx`

**기능**:
- 결제 정보 확인 (제품명, 기간, 금액)
- 토스페이먼츠 결제 위젯 통합
- 결제 진행 상태 표시

**라우트 추가**: `app/routes.ts`
```typescript
route("/promote/checkout", "features/products/pages/promote-checkout-page.tsx"),
```

### 3. 결제 위젯 통합 (프론트엔드)

#### 3.1 패키지 설치

```bash
npm install @tosspayments/payment-widget-sdk
```

#### 3.2 환경 변수 설정

`.env` 파일에 추가:
```env
TOSS_PAYMENTS_CLIENT_KEY=your_client_key_here
```

#### 3.3 결제 위젯 초기화

```typescript
import { loadPaymentWidget, PaymentWidget } from '@tosspayments/payment-widget-sdk';

// 위젯 초기화
const paymentWidget = await loadPaymentWidget(
  process.env.TOSS_PAYMENTS_CLIENT_KEY!,
  'customer-key' // 고객 ID (예: 사용자 UUID)
);

// 결제 금액 설정
await paymentWidget.renderPaymentMethods('#payment-widget', {
  value: totalAmount, // 결제 금액
  currency: 'KRW',
  country: 'KR',
});
```

### 4. 서버 사이드 결제 승인 처리

#### 4.1 결제 승인 API 엔드포인트 생성

**파일 생성**: `app/features/products/mutations.ts` 또는 별도 파일

```typescript
import { createAdminClient } from '~/lib/supabase.server';

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.TOSS_PAYMENTS_SECRET_KEY}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  if (!response.ok) {
    throw new Error('Payment confirmation failed');
  }

  return await response.json();
}
```

#### 4.2 Action 함수 생성

`promote-checkout-page.tsx`에 action 추가:

```typescript
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const paymentKey = formData.get('paymentKey') as string;
  const orderId = formData.get('orderId') as string;
  const amount = Number(formData.get('amount'));

  try {
    const paymentResult = await confirmPayment(paymentKey, orderId, amount);
    
    // 데이터베이스에 결제 정보 저장
    const adminClient = createAdminClient();
    await adminClient.from('promotions').insert({
      order_id: orderId,
      payment_key: paymentKey,
      amount: amount,
      status: 'completed',
      // ... 기타 정보
    });

    return redirect(`/products/promote/success?orderId=${orderId}`);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    };
  }
};
```

### 5. 결제 성공/실패 처리

#### 5.1 성공 페이지

**파일 생성**: `app/features/products/pages/promote-success-page.tsx`

**기능**:
- 결제 완료 메시지 표시
- 주문 번호 표시
- 프로모션 정보 확인

#### 5.2 실패 페이지

**파일 생성**: `app/features/products/pages/promote-failure-page.tsx`

**기능**:
- 결제 실패 메시지 표시
- 다시 시도 버튼
- 고객센터 연락처

### 6. 데이터베이스 스키마

프로모션 및 결제 정보를 저장할 테이블 생성:

```sql
-- 프로모션 테이블
CREATE TABLE promotions (
  promotion_id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(product_id),
  profile_id UUID NOT NULL REFERENCES profiles(profile_id),
  order_id TEXT UNIQUE NOT NULL,
  payment_key TEXT NOT NULL,
  amount INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled, refunded
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 결제 이력 테이블 (선택사항)
CREATE TABLE payment_logs (
  log_id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  payment_key TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  response_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 구현 단계

### Phase 1: 기본 설정
1. ✅ 토스페이먼츠 계정 생성 및 API 키 발급
2. ✅ 환경 변수 설정
3. ✅ 패키지 설치

### Phase 2: 프론트엔드 통합
1. ✅ Checkout 페이지 생성
2. ✅ 결제 위젯 통합
3. ✅ 결제 진행 UI 구현

### Phase 3: 백엔드 통합
1. ✅ 결제 승인 API 구현
2. ✅ 데이터베이스 스키마 생성
3. ✅ 결제 정보 저장 로직 구현

### Phase 4: 결제 완료 처리
1. ✅ 성공 페이지 구현
2. ✅ 실패 페이지 구현
3. ✅ 웹훅 처리 (선택사항)

### Phase 5: 보안 및 테스트
1. ✅ 서버 사이드 검증 강화
2. ✅ 결제 금액 검증
3. ✅ 중복 결제 방지
4. ✅ 테스트 결제 진행

## 보안 고려사항

1. **Secret Key 보안**
   - 절대 클라이언트에 노출하지 않기
   - 환경 변수로 관리
   - 서버 사이드에서만 사용

2. **결제 금액 검증**
   - 클라이언트에서 전달받은 금액을 서버에서 다시 검증
   - 데이터베이스에 저장된 금액과 비교

3. **중복 결제 방지**
   - `orderId`를 고유하게 생성
   - 동일 `orderId`로 중복 결제 방지

4. **웹훅 서명 검증**
   - 토스페이먼츠에서 전달하는 웹훅의 서명 검증
   - 위조 요청 방지

## 참고 자료

- [토스페이먼츠 공식 문서](https://docs.tosspayments.com/)
- [JavaScript SDK 문서](https://docs.tosspayments.com/reference/widget-sdk)
- [REST API 문서](https://docs.tosspayments.com/reference)
- [토스페이먼츠 개발자 센터](https://developers.toss.im/)

## 다음 단계

1. 토스페이먼츠 계정 생성 및 API 키 발급
2. Checkout 페이지 생성 및 라우트 추가
3. 결제 위젯 통합
4. 서버 사이드 결제 승인 처리 구현
5. 데이터베이스 스키마 생성 및 마이그레이션
6. 결제 성공/실패 페이지 구현
7. 테스트 결제 진행 및 검증

