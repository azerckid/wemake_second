import { redirect } from "react-router";

import type { Route } from "./+types/product-visit-page";

import client from "~/supa-client";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const { error, data } = await client
        .from("products")
        .select("url")
        .eq("product_id", parseInt(params.productId))
        .single();
    if (data) {
        await client.rpc("track_event", {
            p_event_type: "product_visit",
            p_event_data: {
                product_id: parseInt(params.productId),
            },
        });
        return redirect(data.url);
    }
};
