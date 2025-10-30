import { redirect } from "react-router";

import type { Route } from "./+types/social-complete-page";

import { z } from "zod";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { ensureProfileForUser } from "../utils";

const paramsSchema = z.object({
    provider: z.enum(["github", "google", "kakao"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const { success, data } = paramsSchema.safeParse(params);
    if (!success) {
        return redirect("/auth/login");
    }
    const url = new URL(request.url);
    const providerError = url.searchParams.get("error");
    const providerErrorDescription = url.searchParams.get("error_description");
    if (providerError || providerErrorDescription) {
        const message = providerErrorDescription || providerError || "Social login failed";
        return redirect(`/auth/login?error=${encodeURIComponent(message)}`);
    }
    const code = url.searchParams.get("code");
    if (!code) {
        return redirect("/auth/login");
    }
    const { supabase, headers } = createSupabaseServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
        throw error;
    }

    // Ensure profile exists for social sign-ins
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
        throw userError;
    }
    if (user) {
        await ensureProfileForUser(supabase, user);
    }

    return redirect("/", { headers });
};
