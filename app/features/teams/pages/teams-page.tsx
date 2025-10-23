import type { Route } from "./+types/teams-page";

import { TeamCard } from "../components/team-card";
import { Hero } from "~/common/components/hero";

export const meta: Route.MetaFunction = () => [{ title: "Teams | wemake" }];

export function loader({ request }: Route.LoaderArgs) {
    return {
        teams: [],
    };
}

export default function TeamsPage() {
    return (
        <div className="space-y-20">
            <Hero title="Teams" subtitle="Find a team looking for a new member." />
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <TeamCard
                        key={`team-${index}`}
                        team_id={index + 1}
                        product_name="Doggie Social"
                        team_size={3}
                        equity_split={50}
                        product_stage="mvp"
                        roles="React Developer, Backend Developer, Product Manager"
                        product_description="a new social media platform for dogs to connect with each other"
                        created_at={new Date()}
                        leaderUsername="Azer.C"
                        leaderAvatarUrl="https://github.com/azerckid.png"
                    />
                ))}
            </div>
        </div>
    );
}