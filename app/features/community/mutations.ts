import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const createPost = async (
    supabase: SupabaseClient<Database>,
    {
        title,
        topic_id,
        content,
        userId,
    }: {
        title: string;
        topic_id: number;
        content: string;
        userId: string;
    }
) => {
    const { data, error } = await supabase
        .from("posts")
        .insert({
            title,
            content,
            profile_id: userId,
            topic_id,
        })
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const createReply = async (
    supabase: SupabaseClient<Database>,
    {
        post_id,
        parent_id,
        reply,
        userId,
    }: {
        post_id: number;
        parent_id?: number | null;
        reply: string;
        userId: string;
    }
) => {
    const { data, error } = await supabase
        .from("post_replies")
        .insert({
            post_id,
            parent_id: parent_id || null,
            reply,
            profile_id: userId,
        })
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const togglePostUpvote = async (
    supabase: SupabaseClient<Database>,
    {
        post_id,
        userId,
    }: {
        post_id: number;
        userId: string;
    }
) => {
    // Check if user has already upvoted
    const { data: existing } = await supabase
        .from("post_upvotes")
        .select("post_id, profile_id")
        .eq("post_id", post_id)
        .eq("profile_id", userId)
        .maybeSingle();

    if (existing) {
        // Remove upvote
        const { error } = await supabase
            .from("post_upvotes")
            .delete()
            .eq("post_id", post_id)
            .eq("profile_id", userId);
        if (error) {
            throw error;
        }
        return false; // Upvote removed
    } else {
        // Add upvote
        const { error } = await supabase
            .from("post_upvotes")
            .insert({
                post_id,
                profile_id: userId,
            });
        if (error) {
            throw error;
        }
        return true; // Upvote added
    }
};