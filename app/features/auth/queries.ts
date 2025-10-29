import { createSupabaseServerClient } from "~/lib/supabase.server";

export const checkUsernameExists = async (
    request: Request,
    { username }: { username: string }
) => {
    const { supabase } = createSupabaseServerClient(request);
    const { error } = await supabase
        .from("profiles")
        .select("profile_id")
        .eq("username", username)
        .single();
    if (error) {
        console.error("Supabase checkUsernameExists error:", error);
        return false;
    }
    return true;
};