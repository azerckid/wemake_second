import type { Route } from "./+types/teams-page";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { TeamCard } from "../components/team-card";
import { Hero } from "~/common/components/hero";
import { Pagination } from "~/common/components/pagination";
import { getTeams } from "../queries";

export const meta: Route.MetaFunction = () => [{ title: "Teams | wemake" }];

export const loader = async ({ request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 6; // 한 페이지당 6개씩 표시

    const result = await getTeams(request, { limit, page });
    return result;
};

export default function TeamsPage({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentPage = loaderData.currentPage;
    const totalPages = loaderData.totalPages;

    const handlePageChange = (page: number) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", page.toString());
        navigate(`?${newSearchParams.toString()}`);
    };

    return (
        <div className="space-y-8">
            <Hero title="Teams" subtitle="Find a team looking for a new member." />
            <div className="grid grid-cols-3 gap-4">
                {loaderData.teams.map((team) => (
                    <TeamCard
                        key={team.team_id}
                        team_id={team.team_id}
                        product_name={team.product_name ?? ""}
                        team_size={team.team_size ?? 0}
                        equity_split={team.equity_split ?? 0}
                        product_stage={team.product_stage ?? ""}
                        roles={team.roles ?? ""}
                        product_description={team.product_description ?? ""}
                        created_at={team.created_at ? new Date(team.created_at) : new Date()}
                        leaderUsername={team.team_leader.username ?? ""}
                        leaderAvatarUrl={team.team_leader.avatar ?? ""}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    variant="full"
                />
            )}
        </div>
    );
}