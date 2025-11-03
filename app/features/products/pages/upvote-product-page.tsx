import type { Route } from "./+types/upvote-product-page";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "~/features/users/queries";
import { toggleProductUpvote } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();
    const productId = Number(formData.get("product_id") || params.productId);

    if (!isNaN(productId)) {
        await toggleProductUpvote(supabase, {
            product_id: productId,
            userId,
        });
    }

    return { ok: true };
};

