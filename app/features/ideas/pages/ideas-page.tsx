import type { Route } from "./+types/ideas-page";

import { Hero } from "~/common/components/hero";
import { IdeaCard } from "../components/idea-card";
import { getGptIdeas, getGptIdeasCount } from "../queries";
import { Pagination } from "~/common/components/pagination";
import { useSearchParams } from "react-router";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "IdeasGPT | wemake" },
        { name: "description", content: "Find ideas for your next project" },
    ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = 12;

    const [ideas, totalCount] = await Promise.all([
        getGptIdeas(request, { limit, page }),
        getGptIdeasCount(request),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { ideas, totalPages, currentPage: page };
};

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
    };
    return (
        <div className="space-y-20">
            <Hero title="IdeasGPT" subtitle="Find ideas for your next project" />
            <div className="grid grid-cols-4 gap-4">
                {loaderData.ideas.map((idea) => (
                    <IdeaCard
                        key={idea.gpt_idea_id}
                        gpt_idea_id={idea.gpt_idea_id ?? 0}
                        idea={idea.idea ?? ""}
                        views={idea.views ?? 0}
                        created_at={idea.created_at ? new Date(idea.created_at) : new Date()}
                        likesCount={idea.likes ?? 0}
                        claimed_at={idea.is_claimed ? new Date(idea.created_at ?? "") : null}
                        claimed_by={idea.is_claimed ? "user-123" : null}
                    />
                ))}
            </div>
            {loaderData.totalPages > 1 && (
                <div className="flex justify-center mt-10">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={loaderData.totalPages}
                        onPageChange={onPageChange}
                        variant="simple"
                    />
                </div>
            )}
        </div>
    );
}