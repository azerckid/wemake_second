import type { Route } from "./+types/daily-leaderboard-page";
import { DateTime } from "luxon";
import { data, isRouteErrorResponse } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";

const paramsSchema = z.object({
    year: z.coerce.number(),
    month: z.coerce.number(),
    day: z.coerce.number(),
});

export const loader = ({ params }: Route.LoaderArgs) => {
    const { success, data: parsedData } = paramsSchema.safeParse(params);
    if (!success) {
        throw data(
            {
                error_code: "invalid_params",
                message: "Invalid params",
            },
            { status: 400 }
        );
    }
    const date = DateTime.fromObject(parsedData).setZone("Asia/Seoul");
    if (!date.isValid) {
        throw data(
            {
                error_code: "invalid_date",
                message: "Invalid date",
            },
            {
                status: 400,
            }
        );
    }
    const today = DateTime.now().setZone("Asia/Seoul").startOf("day");
    if (date > today) {
        throw data(
            {
                error_code: "future_date",
                message: "Future date",
            },
            { status: 400 }
        );
    }
    return {
        date: {
            year: date.year,
            month: date.month,
            day: date.day,
        },
    };
};

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Daily Leaderboard - ${params.year}/${params.month}/${params.day} | ProductHunt Clone` },
        { name: "description", content: "See the top performers in your community" }
    ];
}

export default function DailyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    return <div className="container mx-auto px-4 py-8">
        <Hero
            title={`Daily Leaderboard - ${loaderData.date.year}/${loaderData.date.month}/${loaderData.date.day}`}
            subtitle="The most popular products on wemake by day"
        />
    </div>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                {error.data.message} / {error.data.error_code}
            </div>
        );
    }
    if (error instanceof Error) {
        return <div>{error.message}</div>;
    }
    return <div>Unknown error</div>;
}