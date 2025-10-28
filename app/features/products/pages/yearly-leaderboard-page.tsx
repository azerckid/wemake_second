import { data, isRouteErrorResponse, Link } from "react-router";
import { DateTime } from "luxon";
import { z } from "zod";

import type { Route } from "./+types/yearly-leaderboard-page";

import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { Pagination } from "~/common/components/pagination";
import { useSearchParams } from "react-router";
import { ProductCard } from "../components/product-card";
import { PAGE_SIZE } from "../constants";
import { getProductsByDateRange, getProductPagesByDateRange } from "../queries";

const paramsSchema = z.object({
    year: z.coerce.number(),
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
    const today = DateTime.now().setZone("Asia/Seoul").startOf("year");
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
        startDate: date.startOf("year"),
        endDate: date.endOf("year"),
        limit: PAGE_SIZE,
        page: Number(url.searchParams.get("page") || 1),
    });
    const totalPages = await getProductPagesByDateRange(request, {
        startDate: date.startOf("year"),
        endDate: date.endOf("year"),
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
    })
        .setZone("Asia/Seoul")
        .setLocale("ko");
    return [
        {
            title: `Best of ${date.toLocaleString({
                year: "numeric",
            })} | wemake`,
        },
    ];
};

export default function YearlyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
    };

    const urlDate = DateTime.fromObject({
        year: loaderData.year,
    });
    const previousYear = urlDate.minus({ years: 1 });
    const nextYear = urlDate.plus({ years: 1 });
    const isToday = urlDate.equals(DateTime.now().startOf("year"));
    return (
        <div className="space-y-10">
            <Hero
                title={`Best of ${urlDate.toLocaleString({
                    year: "numeric",
                })}`}
            />
            <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" asChild>
                    <Link to={`/products/leaderboards/yearly/${previousYear.year}`}>
                        &larr;{" "}
                        {previousYear.toLocaleString({
                            year: "numeric",
                        })}
                    </Link>
                </Button>
                {!isToday ? (
                    <Button variant="secondary" asChild>
                        <Link to={`/products/leaderboards/yearly/${nextYear.year}`}>
                            {nextYear.toLocaleString({
                                year: "numeric",
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
                        id={product.product_id.toString()}
                        name={product.name}
                        description={product.description}
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