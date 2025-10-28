import { Link } from "react-router";

import type { Route } from "./+types/leaderboard-page";

import { DateTime } from "luxon";
import { getProductsByDateRange } from "../queries";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";
import { Hero } from "~/common/components/hero";

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Leaderboard | WeMake Clone" },
        { name: "description", content: "Leaderboard for WeMake" },
    ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
    const [dailyProducts, weeklyProducts, monthlyProducts, yearlyProducts] =
        await Promise.all([
            getProductsByDateRange(request, {
                startDate: DateTime.now().startOf("day"),
                endDate: DateTime.now().endOf("day"),
                limit: 7,
            }),
            getProductsByDateRange(request, {
                startDate: DateTime.now().startOf("week"),
                endDate: DateTime.now().endOf("week"),
                limit: 7,
            }),
            getProductsByDateRange(request, {
                startDate: DateTime.now().startOf("month"),
                endDate: DateTime.now().endOf("month"),
                limit: 7,
            }),
            getProductsByDateRange(request, {
                startDate: DateTime.now().startOf("year"),
                endDate: DateTime.now().endOf("year"),
                limit: 7,
            }),
        ]);
    return { dailyProducts, weeklyProducts, monthlyProducts, yearlyProducts };
};

export default function LeaderboardPage({ loaderData }: Route.ComponentProps) {
    const { dailyProducts, weeklyProducts, monthlyProducts, yearlyProducts } = loaderData;

    return (
        <div className="space-y-20">
            <Hero
                title="Leaderboards"
                subtitle="The most popular products on wemake"
            />
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-3xl font-bold leading-tight tracking-tight">
                        Daily Leaderboard
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        The most popular products on wemake by day.
                    </p>
                    <Button variant="link" asChild className="text-lg self-center">
                        <Link to="/products/leaderboards/daily">
                            Explore all products &rarr;
                        </Link>
                    </Button>
                </div>
                {dailyProducts.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        id={product.product_id}
                        name={product.name}
                        description={product.tagline}
                        reviewsCount={product.reviews ?? 0}
                        viewsCount={product.views ?? 0}
                        votesCount={product.upvotes ?? 0}
                    />
                ))}

            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-3xl font-bold leading-tight tracking-tight">
                        Weekly Leaderboard
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        The most popular products on wemake by week.
                    </p>
                    <Button variant="link" asChild className="text-lg self-center">
                        <Link to="/products/leaderboards/weekly">
                            Explore all products &rarr;
                        </Link>
                    </Button>
                </div>
                {weeklyProducts.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        id={product.product_id}
                        name={product.name}
                        description={product.tagline}
                        reviewsCount={product.reviews ?? 0}
                        viewsCount={product.views ?? 0}
                        votesCount={product.upvotes ?? 0}
                    />
                ))}

            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-3xl font-bold leading-tight tracking-tight">
                        Monthly Leaderboard
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        The most popular products on wemake by month.
                    </p>
                    <Button variant="link" asChild className="text-lg self-center">
                        <Link to="/products/leaderboards/monthly">
                            Explore all products &rarr;
                        </Link>
                    </Button>
                </div>
                {monthlyProducts.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        id={product.product_id}
                        name={product.name}
                        description={product.tagline}
                        reviewsCount={product.reviews ?? 0}
                        viewsCount={product.views ?? 0}
                        votesCount={product.upvotes ?? 0}
                    />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-3xl font-bold leading-tight tracking-tight">
                        Yearly Leaderboard
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        The most popular products on wemake by year.
                    </p>
                    <Button variant="link" asChild className="text-lg self-center">
                        <Link to="/products/leaderboards/yearly">
                            Explore all products &rarr;
                        </Link>
                    </Button>
                </div>
                {yearlyProducts.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        id={product.product_id}
                        name={product.name}
                        description={product.tagline}
                        reviewsCount={product.reviews ?? 0}
                        viewsCount={product.views ?? 0}
                        votesCount={product.upvotes ?? 0}
                    />
                ))}
            </div>
        </div>
    );
}
