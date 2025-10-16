import type { Route } from "./+types/yearly-leaderboard-page";

export function loader({ request, params }: Route.LoaderArgs) {
    return {
        year: params.year,
        products: []
    };
}

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Yearly Leaderboard - ${params.year} | ProductHunt Clone` },
        { name: "description", content: "See the top performers in your community" }
    ];
}

export default function YearlyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Yearly Leaderboard - {loaderData.year}
                </h1>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Yearly leaderboard for {loaderData.year}</p>
            </div>
        </div>
    );
}
