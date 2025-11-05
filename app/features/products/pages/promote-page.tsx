import { useEffect, useRef, useState } from "react";

import type { DateRange } from "react-day-picker";
import type { Route } from "./+types/promote-page";
import type { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";

import { DateTime } from "luxon";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

import { Hero } from "~/common/components/hero";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";
import SelectPair from "~/common/components/select-pair";
import { Calendar } from "~/common/components/ui/calendar";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Promote Product | ProductHunt Clone" },
        { name: "description", content: "Promote your product" },
    ];
};

export default function PromotePage() {
    const [promotionPeriod, setPromotionPeriod] = useState<DateRange | undefined>();
    const totalDays =
        promotionPeriod?.from && promotionPeriod.to
            ? DateTime.fromJSDate(promotionPeriod.to).diff(
                DateTime.fromJSDate(promotionPeriod.from),
                "days"
            ).days
            : 0;
    const widgets = useRef<TossPaymentsWidgets | null>(null);
    const initedToss = useRef<boolean>(false);

    useEffect(() => {
        const initToss = async () => {
            if (initedToss.current) return;
            initedToss.current = true;

            const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
            if (!clientKey) {
                console.error('❌ VITE_TOSS_CLIENT_KEY가 환경 변수에 설정되지 않았습니다.');
                alert('결제 시스템 초기화에 실패했습니다. 관리자에게 문의해주세요.');
                return;
            }

            try {
                const toss = await loadTossPayments(clientKey);

                widgets.current = await toss.widgets({
                    customerKey: import.meta.env.VITE_TOSS_CUSTOMER_KEY || crypto.randomUUID(),
                });

                await widgets.current.setAmount({
                    value: 0,
                    currency: "KRW",
                });

                await widgets.current.renderPaymentMethods({
                    selector: "#toss-payment-methods",
                });

                await widgets.current.renderAgreement({
                    selector: "#toss-payment-agreement",
                });
            } catch (error) {
                console.error('❌ 토스페이먼츠 초기화 실패:', error);
            }
        };
        initToss();
    }, []);
    useEffect(() => {
        const updateAmount = async () => {
            if (widgets.current) {
                try {
                    const amount = totalDays * 10000;
                    await widgets.current.setAmount({
                        value: amount,
                        currency: "KRW",
                    });
                } catch (error) {
                    console.error('❌ 금액 업데이트 실패:', error);
                }
            }
        };
        updateAmount();
    }, [totalDays]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const product = formData.get("product") as string;

        if (!product || !promotionPeriod?.from || !promotionPeriod.to) {
            alert('제품과 날짜를 모두 선택해주세요.');
            return;
        }

        if (!widgets.current) {
            alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        const orderId = crypto.randomUUID();
        const amount = totalDays * 10000;
        const successUrl = `${window.location.href}/success`;
        const failUrl = `${window.location.href}/fail`;

        try {
            await widgets.current.requestPayment({
                orderId,
                orderName: `Promote ${product} for ${totalDays} days`,
                customerEmail: "azerckid@gmail.com",
                customerName: "Azerckid",
                customerMobilePhone: "01012345678",
                metadata: {
                    product,
                    promotionFrom: DateTime.fromJSDate(promotionPeriod.from).toISO(),
                    promotionTo: DateTime.fromJSDate(promotionPeriod.to).toISO(),
                },
                successUrl,
                failUrl,
            } as any);
        } catch (error) {
            alert(`결제 요청 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    return (
        <div>
            <Hero
                title="Promote Your Product"
                subtitle="Boost your product's visibility."
            />
            <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-10">
                <div className="col-span-3 mx-auto w-1/2 flex flex-col gap-10 items-start">
                    <SelectPair
                        required
                        label="Select a product"
                        description="Select the product you want to promote."
                        name="product"
                        placeholder="Select a product"
                        options={[
                            {
                                label: "AI Dark Mode Maker",
                                value: "ai-dark-mode-maker",
                            },
                        ]}
                    />
                    <div className="flex flex-col gap-2 items-center w-full">
                        <Label className="flex flex-col gap-1">
                            Select a range of dates for promotion{" "}
                            <small className="text-muted-foreground text-center ">
                                Minimum duration is 2 days.
                            </small>
                        </Label>
                        <div className="flex gap-20">
                            <Calendar
                                mode="range"
                                selected={promotionPeriod}
                                onSelect={setPromotionPeriod}
                                min={2}
                                disabled={{ before: new Date() }}
                                numberOfMonths={2}
                            />
                        </div>
                    </div>
                </div>
                <aside className="col-span-3 px-20 flex flex-col items-center">
                    <div id="toss-payment-methods" className="w-full" />
                    <div id="toss-payment-agreement" />
                    <Button className="w-full" disabled={totalDays === 0}>
                        Checkout (
                        {(totalDays * 10000).toLocaleString("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                        })}
                        )
                    </Button>
                </aside>
            </form>
        </div>
    );
}