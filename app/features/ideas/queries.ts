import client from "~/supa-client";

export const getGptIdeas = async ({
    limit,
    page = 1
}: {
    limit: number;
    page?: number;
}) => {
    const { data, error } = await client
        .from("gpt_ideas_view")
        .select("*")
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
    if (error) {
        throw error;
    }
    return data;
};

export const getGptIdeasCount = async () => {
    const { count, error } = await client
        .from("gpt_ideas_view")
        .select("*", { count: "exact", head: true });
    if (error) {
        throw error;
    }
    return count || 0;
};

export const getGptIdea = async (gpt_idea_id: number) => {
    const { data, error } = await client
        .from("gpt_ideas_view")
        .select("*")
        .eq("gpt_idea_id", gpt_idea_id)
        .single();
    if (error) {
        throw error;
    }
    return data;
};