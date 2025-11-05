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

    // 현재 요청의 origin을 사용하여 동적으로 콜백 URL 생성
    const url = new URL(request.url);
    const redirectTo = `${url.origin}/auth/social/${provider}/complete`;

    const { supabase, headers } = createSupabaseServerClient(request);
    const {
        data: { url: authUrl },
        error,
    } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
        },
    });
    if (authUrl) {
        return redirect(authUrl, { headers });
    }
    if (error) {
        throw error;
    }
};
