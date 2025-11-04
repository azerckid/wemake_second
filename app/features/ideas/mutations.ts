import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const claimIdea = async (
    client: SupabaseClient<Database>,
    { ideaId, userId }: { ideaId: number; userId: string }
) => {
    const { error } = await client
        .from("gpt_ideas")
        .update({ claimed_by: userId, claimed_at: new Date().toISOString() })
        .eq("gpt_idea_id", ideaId);
    if (error) {
        throw error;
    }
};

export const toggleIdeaLike = async (
    client: SupabaseClient<Database>,
    {
        idea_id,
        userId,
    }: {
        idea_id: number;
        userId: string;
    }
) => {
    // Check if user has already liked
    const { data: existing } = await client
        .from("gpt_ideas_likes")
        .select("gpt_idea_id, profile_id")
        .eq("gpt_idea_id", idea_id)
        .eq("profile_id", userId)
        .maybeSingle();

    if (existing) {
        // Remove like
        const { error } = await client
            .from("gpt_ideas_likes")
            .delete()
            .eq("gpt_idea_id", idea_id)
            .eq("profile_id", userId);
        if (error) {
            throw error;
        }
        return false; // Like removed
    } else {
        // Add like
        const { error } = await client
            .from("gpt_ideas_likes")
            .insert({
                gpt_idea_id: idea_id,
                profile_id: userId,
            });
        if (error) {
            throw error;
        }
        return true; // Like added
    }
};

export const insertIdeas = async (
    client: SupabaseClient<Database>,
    ideas: string[]
) => {
    // 데이터 검증 및 로깅
    const validIdeas = ideas
        .filter((idea): idea is string => {
            if (typeof idea !== 'string') {
                console.warn('⚠️ Invalid idea (not a string):', idea);
                return false;
            }
            if (idea.trim().length === 0) {
                console.warn('⚠️ Invalid idea (empty string):', idea);
                return false;
            }
            return true;
        })
        .map((idea) => ({
            idea: idea.trim(),
        }));

    if (validIdeas.length === 0) {
        throw new Error('No valid ideas to insert');
    }

    console.log(`📝 Inserting ${validIdeas.length} ideas`);
    console.log('Sample idea:', validIdeas[0]?.idea);

    const { data, error } = await client.from("gpt_ideas").insert(validIdeas).select();

    if (error) {
        console.error('❌ Insert error:', error);
        console.error('Tried to insert:', JSON.stringify(validIdeas, null, 2));
        throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} ideas`);
    return data;
};