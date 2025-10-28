import { redirect } from "react-router";

import type { Route } from "./+types/product-visit-page";

import { createSupabaseServerClient } from "~/lib/supabase.server";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);

    const { error, data } = await supabase
        .from("products")
        .select("url")
        .eq("product_id", parseInt(params.productId))
        .single();
    if (data) {
        await supabase.rpc("track_event", {
            p_event_type: "product_visit",
            p_event_data: {
                product_id: parseInt(params.productId),
            },
        });
        return redirect(data.url);
    }
};
