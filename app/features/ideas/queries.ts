import type { Database } from "database.types";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export const getGptIdeas = async (
    request: Request,
    {
        limit,
        page = 1
    }: {
        limit: number;
        page?: number;
    }
) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("gpt_ideas_view")
        .select("*")
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
    if (error) {
        throw error;
    }
    return data;
};

export const getGptIdeasCount = async (request: Request) => {
    const { supabase } = createSupabaseServerClient(request);
    const { count, error } = await supabase
        .from("gpt_ideas_view")
        .select("*", { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count || 0;
};

export const getGptIdea = async (request: Request, gpt_idea_id: number) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("gpt_ideas_view")
        .select("*")
        .eq("gpt_idea_id", gpt_idea_id)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getUserClaimedIdeas = async (request: Request, profileId: string) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("gpt_ideas")
        .select(`
            gpt_idea_id,
            idea,
            views,
            claimed_at,
            claimed_by,
            created_at,
            gpt_ideas_likes!left(count)
        `)
        .eq("claimed_by", profileId)
        .order("claimed_at", { ascending: false });

    if (error) {
        throw error;
    }

    // Transform the data to include likes count
    return (data || []).map((idea: any) => ({
        ...idea,
        likes: idea.gpt_ideas_likes?.length || 0
    }));
};

export const getClaimedIdeas = async (
    request: Request,
    profileId: string
) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("gpt_ideas")
        .select("gpt_idea_id, claimed_at, idea")
        .eq("claimed_by", profileId)
        .order("claimed_at", { ascending: false });
    if (error) {
        throw error;
    }
    return data;
};