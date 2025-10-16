import type { Route } from "./+types/weekly-leaderboard-page";

export function loader({ request, params }: Route.LoaderArgs) {
    return {
        year: params.year,
        week: params.week,
        products: []
    };
}

export function meta({ params }: Route.MetaArgs) {
    return [
        {
            title: `Week ${params.week}, ${params.year} Leaderboard | ProductHunt Clone`,
        },
        {
            name: "description",
            content: `Top products of week ${params.week}, ${params.year}`,
        },
    ];
}

export default function WeeklyLeaderboardPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Week {loaderData.week}, {loaderData.year} Leaderboard
                </h1>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Weekly leaderboard for {loaderData.year} Week {loaderData.week}</p>
            </div>
        </div>
    );
}
