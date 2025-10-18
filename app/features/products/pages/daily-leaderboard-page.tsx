import { data, isRouteErrorResponse, Link } from "react-router";
import { DateTime } from "luxon";
import { z } from "zod";

import type { Route } from "./+types/daily-leaderboard-page";

import { Hero } from "~/common/components/hero";
import ProductPagination from "~/common/components/product-pagination";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";

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
        ...parsedData,
    };
};

export const meta: Route.MetaFunction = ({ params }) => {
    const date = DateTime.fromObject({
        year: Number(params.year),
        month: Number(params.month),
        day: Number(params.day),
    })
        .setZone("Asia/Seoul")
        .setLocale("ko");
    return [
        {
            title: `The best products of ${date.toLocaleString(
                DateTime.DATE_MED
            )} | wemake`,
        },
    ];
};

export default function DailyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    const urlDate = DateTime.fromObject({
        year: loaderData.year,
        month: loaderData.month,
        day: loaderData.day,
    });
    const previousDay = urlDate.minus({ days: 1 });
    const nextDay = urlDate.plus({ days: 1 });
    const isToday = urlDate.equals(DateTime.now().startOf("day"));
    return (
        <div className="space-y-10">
            <Hero
                title={`The best products of ${urlDate.toLocaleString(
                    DateTime.DATE_MED
                )}`}
            />
            <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" asChild>
                    <Link
                        to={`/products/leaderboards/daily/${previousDay.year}/${previousDay.month}/${previousDay.day}`}
                    >
                        &larr; {previousDay.toLocaleString(DateTime.DATE_SHORT)}
                    </Link>
                </Button>
                {!isToday ? (
                    <Button variant="secondary" asChild>
                        <Link
                            to={`/products/leaderboards/daily/${nextDay.year}/${nextDay.month}/${nextDay.day}`}
                        >
                            {nextDay.toLocaleString(DateTime.DATE_SHORT)} &rarr;
                        </Link>
                    </Button>
                ) : null}
            </div>
            <div className="space-y-5 w-full max-w-screen-md mx-auto">
                {Array.from({ length: 11 }).map((_, index) => (
                    <ProductCard
                        key={`productId-${index}`}
                        id={`productId-${index}`}
                        name="Product Name"
                        description="Product Description"
                        commentsCount={12}
                        viewsCount={12}
                        votesCount={120}
                    />
                ))}
            </div>
            <ProductPagination totalPages={10} />
        </div>
    );
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