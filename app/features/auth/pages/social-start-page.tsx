import { redirect } from "react-router";

import type { Route } from "./+types/social-start-page";

import { createSupabaseServerClient } from "~/lib/supabase.server";
import { z } from "zod";

const paramsSchema = z.object({
    provider: z.enum(["github", "google", "kakao"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const { success, data } = paramsSchema.safeParse(params);
    if (!success) {
        return redirect("/auth/login");
    }
    const { provider } = data;
    const redirectTo = `http://localhost:5173/auth/social/${provider}/complete`;
    const { supabase, headers } = createSupabaseServerClient(request);
    const {
        data: { url },
        error,
    } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
        },
    });
    if (url) {
        return redirect(url, { headers });
    }
    if (error) {
        throw error;
    }
};
