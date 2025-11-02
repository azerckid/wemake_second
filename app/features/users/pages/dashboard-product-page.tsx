import { redirect } from "react-router";
import type { Route } from "./+types/dashboard-product-page";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "../queries";

import { Card, CardContent, CardHeader, CardTitle } from "~/common/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/common/components/ui/chart";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Product Dashboard | wemake" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const productId = Number(params.productId);

    const { error } = await supabase
        .from("products")
        .select("product_id")
        .eq("profile_id", userId)
        .eq("product_id", productId)
        .single();
    if (error) {
        throw redirect("/my/dashboard");
    }
    const { data, error: rcpError } = await supabase.rpc("get_product_stats", {
        product_id: String(productId),
    });
    if (rcpError) {
        throw rcpError;
    }
    return {
        chartData: data || [],
    };
};
const chartConfig = {
    views: {
        label: "Page Views",
        color: "var(--chart-1)",
    },
    visitors: {
        label: "Visitors",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig;

export default function DashboardProductPage({
    loaderData,
}: Route.ComponentProps) {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
            <Card className="w-2/3">
                <CardHeader>
                    <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={loaderData.chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                padding={{ left: 15, right: 15 }}
                            />
                            <Area
                                dataKey="product_views"
                                type="natural"
                                stroke="var(--color-views)"
                                fill="var(--color-views)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Area
                                dataKey="product_visits"
                                type="natural"
                                stroke="var(--color-visitors)"
                                fill="var(--color-visitors)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                wrapperStyle={{ minWidth: "200px" }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

