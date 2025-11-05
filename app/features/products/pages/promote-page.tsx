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
        { title: "PromoteProduct | ProductHunt Clone" },
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
            const toss = await loadTossPayments(
                "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
            );
            widgets.current = await toss.widgets({
                customerKey: "1111111",
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
        };
        initToss();
    }, []);
    useEffect(() => {
        const updateAmount = async () => {
            if (widgets.current) {
                await widgets.current.setAmount({
                    value: totalDays * 20000,
                    currency: "KRW",
                });
            }
        };
        updateAmount();
    }, [totalDays]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const product = formData.get("product") as string;
        if (!product || !promotionPeriod?.from || !promotionPeriod.to) {
            return;
        }
        if (!widgets.current) {
            return;
        }
        await widgets.current.requestPayment({
            amount: totalDays * 20000,
            orderId: crypto.randomUUID(),
            orderName: `Promote ${product} for ${totalDays} days`,
            customerEmail: "nico@nomadcoders.co",
            customerName: "Nico",
            customerMobilePhone: "01012345678",
            metadata: {
                product,
                promotionFrom: DateTime.fromJSDate(promotionPeriod.from).toISO(),
                promotionTo: DateTime.fromJSDate(promotionPeriod.to).toISO(),
            },
            successUrl: `${window.location.href}/success`,
            failUrl: `${window.location.href}/fail`,
        } as any);
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
                                Minimum duration is 3 days.
                            </small>
                        </Label>
                        <div className="flex gap-20">
                            <Calendar
                                mode="range"
                                selected={promotionPeriod}
                                onSelect={setPromotionPeriod}
                                min={3}
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
                        {(totalDays * 20000).toLocaleString("ko-KR", {
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