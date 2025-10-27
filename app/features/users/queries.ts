import client from "~/supa-client";
import { productListSelect } from "../products/queries";

type UserProfile = {
    profile_id: string;
    name: string;
    username: string;
    avatar: string | null;
    role: "developer" | "designer" | "marketer" | "founder" | "product-manager";
    headline: string | null;
    bio: string | null;
    stats: {
        followers: number;
        following: number;
    } | null;
};

export const getUserProfile = async (username: string): Promise<UserProfile> => {
    const { data, error } = await client
        .from("profiles")
        .select(
            `
        profile_id,
        name,
        username,
        avatar,
        role,
        headline,
        bio,
        stats
        `
        )
        .eq("username", username)
        .single();
    if (error) {
        // 사용자가 없을 때 404 에러 발생
        if (error.code === 'PGRST116') {
            throw new Response("User not found", { status: 404 });
        }
        throw error;
    }
    return data as UserProfile;
};

export const getUserProducts = async (username: string) => {
    // First get the profile_id from username
    const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("profile_id")
        .eq("username", username)
        .single();

    if (profileError || !profile) {
        return [];
    }

    // Then get products for that profile
    const { data, error } = await client
        .from("products")
        .select(productListSelect)
        .eq("profile_id", profile.profile_id);

    if (error) {
        return [];
    }
    return data || [];
};

export const getUserPosts = async (username: string) => {
    // Use the existing view with username filter
    const { data, error } = await client
        .from("community_post_list_view")
        .select("*")
        .eq("author_username", username)
        .order("created_at", { ascending: false });

    if (error) {
        return [];
    }

    // Map view columns to match PostCard interface
    return (data || []).map((post: any) => ({
        post_id: post.post_id,
        title: post.title,
        upvotes: post.upvotes,
        created_at: post.created_at,
        topic_id: 0, // View doesn't have topic_id, not used in PostCard
        profiles: {
            username: post.author_username,
            avatar: post.author_avatar,
        },
        topics: {
            name: post.topic,
        },
    }));
};