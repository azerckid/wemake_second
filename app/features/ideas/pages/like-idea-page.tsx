import type { Route } from "./+types/like-idea-page";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "~/features/users/queries";
import { toggleIdeaLike } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();
    const ideaId = Number(formData.get("idea_id") || params.ideaId);

    if (!isNaN(ideaId)) {
        await toggleIdeaLike(supabase, {
            idea_id: ideaId,
            userId,
        });
    }

    return { ok: true };
};

