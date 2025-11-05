import { Link } from "react-router";

import type { Route } from "./+types/promote-success-page";

import { z } from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

const paramsSchema = z.object({
    paymentType: z.string(),
    orderId: z.string().uuid(),
    paymentKey: z.string(),
    amount: z.coerce.number(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const { success, data } = paramsSchema.safeParse(
        Object.fromEntries(url.searchParams)
    );

    if (!success) {
        return {
            success: false,
            error: "Invalid payment parameters",
            paymentData: null,
        };
    }

    const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
    if (!TOSS_SECRET_KEY) {
        console.error('❌ TOSS_SECRET_KEY가 환경 변수에 설정되지 않았습니다.');
        return {
            success: false,
            error: "Payment configuration error",
            paymentData: null,
        };
    }

    try {
        const encryptedSecretKey = `Basic ${Buffer.from(
            TOSS_SECRET_KEY + ":"
        ).toString("base64")}`;

        const response = await fetch(
            "https://api.tosspayments.com/v1/payments/confirm",
            {
                method: "POST",
                headers: {
                    Authorization: encryptedSecretKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: data.orderId,
                    paymentKey: data.paymentKey,
                    amount: data.amount,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                error: errorData.message || "Payment confirmation failed",
                paymentData: null,
            };
        }

        const responseData = await response.json();
        return {
            success: true,
            error: null,
            paymentData: responseData,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            paymentData: null,
        };
    }
};

export default function PromoteSuccessPage({ loaderData }: Route.ComponentProps) {
    const { success, error, paymentData } = loaderData;

    if (success && paymentData) {
        return (
            <div>
                <Hero
                    title="Payment Successful!"
                    subtitle="Your product promotion has been confirmed."
                />
                <div className="max-w-screen-sm mx-auto p-4 space-y-6">
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription className="font-semibold">
                            결제가 성공적으로 완료되었습니다!
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">결제 정보</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">주문번호:</dt>
                                    <dd className="font-mono">{paymentData.orderId || paymentData.order?.id}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">결제 금액:</dt>
                                    <dd>
                                        {paymentData.totalAmount?.toLocaleString("ko-KR", {
                                            style: "currency",
                                            currency: "KRW",
                                        }) || paymentData.amount?.toLocaleString("ko-KR", {
                                            style: "currency",
                                            currency: "KRW",
                                        })}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">결제 수단:</dt>
                                    <dd>{paymentData.method || "알 수 없음"}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button asChild>
                                <Link to="/products">View Products</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/my/dashboard">Go to Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Hero
                title="Payment Error"
                subtitle="There was an issue processing your payment."
            />
            <div className="max-w-screen-sm mx-auto p-4 space-y-6">
                <Alert className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>결제 승인 중 오류가 발생했습니다:</strong> {error || "Unknown error"}
                    </AlertDescription>
                </Alert>

                <div className="flex gap-4 justify-center">
                    <Button variant="outline" asChild>
                        <Link to="/products/promote">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/products">Back to Products</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

