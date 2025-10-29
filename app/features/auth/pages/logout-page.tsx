import { redirect } from "react-router";

import type { Route } from "./+types/logout-page";

import { createSupabaseServerClient } from "~/lib/supabase.server";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Logout | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase, headers } = createSupabaseServerClient(request);
    await supabase.auth.signOut();
    return redirect("/auth/login", { headers });
};

export default function LogoutPage() {
    return null;
}

