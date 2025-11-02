import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { z } from "zod";

export const uploadAvatar = async (
    client: SupabaseClient<Database>,
    userId: string,
    file: File
): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = client.storage
        .from("avatars")
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const uploadAndSaveAvatar = async (
    client: SupabaseClient<Database>,
    userId: string,
    file: File
): Promise<void> => {
    const avatarUrl = await uploadAvatar(client, userId, file);

    const { error } = await client
        .from("profiles")
        .update({ avatar: avatarUrl })
        .eq("profile_id", userId);

    if (error) {
        throw error;
    }
};

export const profileUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    role: z.enum(["developer", "designer", "marketer", "product-manager", "founder"]),
    headline: z.string().min(1, "Headline is required").max(200, "Headline must be 200 characters or less"),
    bio: z.string().min(1, "Bio is required").max(1000, "Bio must be 1000 characters or less"),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

export const updateProfile = async (
    client: SupabaseClient<Database>,
    userId: string,
    data: ProfileUpdateData
) => {
    const { error } = await client
        .from("profiles")
        .update({
            name: data.name,
            role: data.role,
            headline: data.headline,
            bio: data.bio,
        })
        .eq("profile_id", userId);

    if (error) {
        throw error;
    }
};

