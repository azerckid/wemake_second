import { redirect } from "react-router";
import type { Route } from "./+types/my-profile-page";
import { getUserById } from "../queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
    const { supabase } = createSupabaseServerClient(request);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        const profile = await getUserById(supabase, { id: user.id });
        return redirect(`/users/${profile.username}`);
    }
    return redirect("/auth/login");
}

