import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const uploadProductIcon = async (
    client: SupabaseClient<Database>,
    userId: string,
    file: File
): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `icon-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await client.storage
        .from("icons")
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = client.storage
        .from("icons")
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const createProductReview = async (
    client: SupabaseClient<Database>,
    {
        productId,
        review,
        rating,
        userId,
    }: { productId: string; review: string; rating: number; userId: string }
) => {
    const { error } = await client.from("reviews").insert({
        product_id: +productId,
        review,
        rating,
        profile_id: userId,
    });
    if (error) {
        throw error;
    }
};

export const createProduct = async (
    client: SupabaseClient<Database>,
    {
        name,
        tagline,
        description,
        howItWorks,
        url,
        iconUrl,
        categoryId,
        userId,
    }: {
        name: string;
        tagline: string;
        description: string;
        howItWorks: string;
        url: string;
        iconUrl: string;
        categoryId: number;
        userId: string;
    }
) => {
    const { data, error } = await client
        .from("products")
        .insert({
            name,
            tagline,
            description,
            how_it_works: howItWorks,
            url,
            icon: iconUrl,
            category_id: categoryId,
            profile_id: userId,
        })
        .select("product_id")
        .single();
    if (error) throw error;
    return data.product_id;
};

export const toggleProductUpvote = async (
    client: SupabaseClient<Database>,
    {
        product_id,
        userId,
    }: {
        product_id: number;
        userId: string;
    }
) => {
    // Check if user has already upvoted
    const { data: existing } = await client
        .from("product_upvotes")
        .select("product_id, profile_id")
        .eq("product_id", product_id)
        .eq("profile_id", userId)
        .maybeSingle();

    if (existing) {
        // Remove upvote
        const { error } = await client
            .from("product_upvotes")
            .delete()
            .eq("product_id", product_id)
            .eq("profile_id", userId);
        if (error) {
            throw error;
        }
        return false; // Upvote removed
    } else {
        // Add upvote
        const { error } = await client
            .from("product_upvotes")
            .insert({
                product_id,
                profile_id: userId,
            });
        if (error) {
            throw error;
        }
        return true; // Upvote added
    }
};