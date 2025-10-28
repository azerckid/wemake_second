import { data, isRouteErrorResponse, Link } from "react-router";
import { DateTime } from "luxon";
import { z } from "zod";

import type { Route } from "./+types/monthly-leaderboard-page";

import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { Pagination } from "~/common/components/pagination";
import { useSearchParams } from "react-router";
import { ProductCard } from "../components/product-card";
import { PAGE_SIZE } from "../constants";
import { getProductsByDateRange, getProductPagesByDateRange } from "../queries";

const paramsSchema = z.object({
    year: z.coerce.number(),
    month: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
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
    const date = DateTime.fromObject({
        year: parsedData.year,
        month: parsedData.month,
    }).setZone("Asia/Seoul");
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
    const today = DateTime.now().setZone("Asia/Seoul").startOf("month");
    if (date > today) {
        throw data(
            {
                error_code: "future_date",
                message: "Future date",
            },
            { status: 400 }
        );
    }

    const url = new URL(request.url);
    const products = await getProductsByDateRange(request, {
        startDate: date.startOf("month"),
        endDate: date.endOf("month"),
        limit: PAGE_SIZE,
        page: Number(url.searchParams.get("page") || 1),
    });
    const totalPages = await getProductPagesByDateRange(request, {
        startDate: date.startOf("month"),
        endDate: date.endOf("month"),
    });

    return {
        products,
        totalPages,
        ...parsedData,
    };
}

export const meta: Route.MetaFunction = ({ params }) => {
    const date = DateTime.fromObject({
        year: Number(params.year),
        month: Number(params.month),
    })
        .setZone("Asia/Seoul")
        .setLocale("ko");
    return [
        {
            title: `Best of ${date.toLocaleString({
                month: "long",
                year: "2-digit",
            })} | wemake`,
        },
    ];
};

export default function MonthlyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
    };

    const urlDate = DateTime.fromObject({
        year: loaderData.year,
        month: loaderData.month,
    });
    const previousMonth = urlDate.minus({ months: 1 });
    const nextMonth = urlDate.plus({ months: 1 });
    const isToday = urlDate.equals(DateTime.now().startOf("month"));
    return (
        <div className="space-y-10">
            <Hero
                title={`Best of ${urlDate.toLocaleString({
                    month: "long",
                    year: "2-digit",
                })}`}
            />
            <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" asChild>
                    <Link
                        to={`/products/leaderboards/monthly/${previousMonth.year}/${previousMonth.month}`}
                    >
                        &larr;{" "}
                        {previousMonth.toLocaleString({
                            month: "long",
                            year: "2-digit",
                        })}
                    </Link>
                </Button>
                {!isToday ? (
                    <Button variant="secondary" asChild>
                        <Link
                            to={`/products/leaderboards/monthly/${nextMonth.year}/${nextMonth.month}`}
                        >
                            {nextMonth.toLocaleString({
                                month: "long",
                                year: "2-digit",
                            })}{" "}
                            &rarr;
                        </Link>
                    </Button>
                ) : null}
            </div>
            <div className="space-y-5 w-full max-w-screen-md mx-auto">
                {loaderData.products.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        id={product.product_id}
                        name={product.name}
                        description={product.tagline}
                        reviewsCount={product.reviews}
                        viewsCount={product.views}
                        votesCount={product.upvotes}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={loaderData.totalPages}
                onPageChange={onPageChange}
                variant="simple"
            />
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