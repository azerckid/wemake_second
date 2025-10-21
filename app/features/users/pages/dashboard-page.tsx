import type { Route } from "./+types/dashboard-page";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card } from "~/common/components/ui/card";
import { CardHeader } from "~/common/components/ui/card";
import { CardTitle } from "~/common/components/ui/card";
import { CardContent } from "~/common/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/common/components/ui/chart";

// Custom Dot Component
const CustomDot = ({ cx, cy }: { cx?: number; cy?: number }) => {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={4}
            fill="hsl(222.2 47.4% 11.2%)"
            stroke="white"
            strokeWidth={2}
        />
    );
};

export const meta: Route.MetaFunction = () => {
    return [{ title: "Dashboard | wemake" }];
};

const chartData = [
    { month: "January", views: 186 },
    { month: "February", views: 305 },
    { month: "March", views: 237 },
    { month: "April", views: 73 },
    { month: "May", views: 209 },
    { month: "June", views: 214 },
];
const chartConfig = {
    views: {
        label: "views",
        color: "var(--chart-1)", // Tailwind v4: 직접 HSL 값 사용
    },
} satisfies ChartConfig;

export default function DashboardPage() {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <Card className="w-1/2">
                <CardHeader>
                    <CardTitle>Profile views</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
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
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <Line
                                dataKey="views"
                                type="natural"
                                stroke="var(--chart-1)"
                                strokeWidth={2}
                                dot={<CustomDot />}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

