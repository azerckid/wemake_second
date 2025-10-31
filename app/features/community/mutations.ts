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