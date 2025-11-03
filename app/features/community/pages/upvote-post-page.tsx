import type { Route } from "./+types/upvote-post-page";

import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "~/features/users/queries";
import { togglePostUpvote } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        throw new Response("Method not allowed", { status: 405 });
    }

    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const postId = Number(params.postId);

    if (!isNaN(postId)) {
        await togglePostUpvote(supabase, {
            post_id: postId,
            userId,
        });
    }

    return { ok: true };
};

