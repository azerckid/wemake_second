import { IdeaCard } from "~/features/ideas/components/idea-card";
import { getUserClaimedIdeas } from "~/features/ideas/queries";
import { toggleIdeaLike } from "~/features/ideas/mutations";
import type { Route } from "./+types/dashboard-ideas-page";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "../queries";
import { redirect } from "react-router";

export const meta: Route.MetaFunction = () => {
    return [{ title: "My Ideas | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const currentUserProfileId = await getLoggedInUserId(supabase);

    try {
        const claimedIdeas = await getUserClaimedIdeas(request, currentUserProfileId);
        return { claimedIdeas };
    } catch (error) {
        console.error("Failed to load claimed ideas:", error);
        return { claimedIdeas: [] };
    }
};

export const action = async ({ request }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();

    if (formData.get("intent") === "like") {
        const ideaId = Number(formData.get("idea_id"));
        if (!isNaN(ideaId)) {
            await toggleIdeaLike(supabase, {
                idea_id: ideaId,
                userId,
            });
        }
    }

    // Redirect back to dashboard ideas page to refresh data
    return redirect("/my/dashboard/ideas");
};

export default function DashboardIdeasPage({ loaderData }: Route.ComponentProps) {
    const { claimedIdeas } = loaderData;

    return (
        <div className="space-y-5 h-full">
            <h1 className="text-2xl font-semibold mb-6">Claimed Ideas</h1>
            {claimedIdeas.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No claimed ideas yet.</p>
                    <p className="text-muted-foreground">Visit the Ideas page to claim some ideas!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {claimedIdeas.map((idea: any) => (
                        <IdeaCard
                            key={idea.gpt_idea_id}
                            gpt_idea_id={idea.gpt_idea_id}
                            idea={idea.idea}
                            views={idea.views}
                            created_at={idea.created_at}
                            likesCount={idea.likes || 0}
                            claimed_at={idea.claimed_at}
                            claimed_by={idea.claimed_by}
                            isClaimedByCurrentUser={true} // 대시보드에서는 모두 현재 사용자가 클레임한 아이디어
                            isLiked={idea.is_liked ?? false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
