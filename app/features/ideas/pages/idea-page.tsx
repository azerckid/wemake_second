import type { Route } from "./+types/idea-page";

import { DotIcon, HeartIcon, EyeIcon } from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { getGptIdea } from "../queries";
import { DateTime } from "luxon";
import { Form, Link, redirect, useNavigation } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "~/features/users/queries";
import { claimIdea } from "../mutations";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

export const meta = ({
    data: {
        idea: { gpt_idea_id, idea },
    },
}: Route.MetaArgs) => {
    return [
        { title: `Idea #${gpt_idea_id}: ${idea} | wemake` },
        { name: "description", content: "Find ideas for your next project" },
    ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const url = new URL(request.url);
    const success = url.searchParams.get("success") === "true";

    // 로그인한 사용자인지 확인 (Claim 버튼 사용을 위해 필요)
    // 하지만 인증 실패 시에도 페이지는 볼 수 있도록 try-catch 사용
    let isAuthenticated = false;
    try {
        await getLoggedInUserId(supabase);
        isAuthenticated = true;
    } catch {
        // 로그인하지 않은 경우 무시 (페이지는 볼 수 있음)
    }

    const idea = await getGptIdea(request, Number(params.ideaId));

    return { idea, success, isAuthenticated };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const ideaId = Number(params.ideaId);
    const idea = await getGptIdea(request, ideaId);

    if (isNaN(ideaId)) {
        throw new Response("Invalid idea ID", { status: 400 });
    }
    // 이미 클레임된 경우 체크
    if (idea.is_claimed) {
        return { ok: false };
    }
    // Claim the idea
    await claimIdea(supabase, { ideaId, userId });

    // 최소 0.5초 대기
    await new Promise(resolve => setTimeout(resolve, 500));

    return redirect(`/ideas/${ideaId}?success=true`);
};

export default function IdeaPage({ loaderData }: Route.ComponentProps) {
    const { idea, success, isAuthenticated } = loaderData;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="space-y-20">
            <Hero title={`Idea #${idea.gpt_idea_id}`} />
            <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-10">
                <p className="italic text-center">
                    "{idea.idea}"
                </p>
                <div className="flex items-center text-sm">
                    <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{idea.views}</span>
                    </div>
                    <DotIcon className="w-4 h-4" />
                    <span>{DateTime.fromJSDate(idea.created_at ? new Date(idea.created_at) : new Date(), { zone: "utc" }).setZone("Asia/Seoul").toLocaleString(DateTime.DATE_MED)}</span>
                    <DotIcon className="w-4 h-4" />
                    <Button variant="outline">
                        <HeartIcon className="w-4 h-4" />
                        <span>{idea.likes}</span>
                    </Button>
                </div>
                {success && (
                    <div className="space-y-5 w-full">
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>Successfully claimed this idea!</AlertDescription>
                        </Alert>
                        <Button size="lg" asChild className="w-full">
                            <Link to="/my/dashboard/ideas">Go to My Ideas &rarr;</Link>
                        </Button>
                    </div>
                )}
                {!idea.is_claimed && isAuthenticated && !success ? (
                    <Form method="post" className="space-y-5">
                        <Button size="lg" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin mr-2" />
                                    Claiming...
                                </>
                            ) : (
                                "Claim idea now"
                            )}
                        </Button>
                    </Form>
                ) : (
                    <Button size="lg" variant="outline" disabled className="cursor-not-allowed">
                        Already Claimed
                    </Button>
                )}
            </div>
        </div>
    );
}