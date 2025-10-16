import type { Route } from "./+types/monthly-leaderboard-page";

export function loader({ request, params }: Route.LoaderArgs) {
    return {
        year: params.year,
        month: params.month,
        products: []
    };
}

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Monthly Leaderboard - ${params.year}/${params.month} | ProductHunt Clone` },
        { name: "description", content: "See the top performers in your community" }
    ];
}

export default function MonthlyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Monthly Leaderboard - {loaderData.year}/{loaderData.month}
                </h1>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Monthly leaderboard for {loaderData.year}/{loaderData.month}</p>
            </div>
        </div>
    );
}
