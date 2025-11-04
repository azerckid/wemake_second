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
        .upload(filePath, file, {
            contentType: file.type,
            upsert: true,
        });

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

export const seeNotification = async (
    client: SupabaseClient<Database>,
    {
        userId,
        notificationId,
    }: {
        userId: string;
        notificationId: number;
    }
) => {
    const { error } = await client
        .from("notifications")
        .update({ seen: true })
        .eq("notification_id", notificationId)
        .eq("target_id", userId);

    if (error) {
        throw error;
    }
};

export const sendMessage = async (
    client: SupabaseClient<Database>,
    {
        fromUserId,
        toUserId,
        content,
    }: {
        fromUserId: string;
        toUserId: string;
        content: string;
    }
): Promise<number> => {
    // 기존 룸이 있는지 확인
    const { data: existingRoom, error: rpcError } = await client.rpc("get_room", {
        from_user_id: fromUserId,
        to_user_id: toUserId,
    });

    if (rpcError) {
        console.error("RPC error in get_room:", rpcError);
        throw rpcError;
    }

    let messageRoomId: number;

    if (existingRoom && Array.isArray(existingRoom) && existingRoom.length > 0 && existingRoom[0]?.message_room_id) {
        // 기존 룸이 있으면 사용
        messageRoomId = existingRoom[0].message_room_id;
    } else {
        // 새 룸 생성
        const { data: newRoom, error: roomError } = await client
            .from("message_rooms")
            .insert({})
            .select("message_room_id")
            .single();

        if (roomError || !newRoom) {
            console.error("Error creating message room:", roomError);
            throw roomError || new Error("Failed to create message room");
        }

        messageRoomId = newRoom.message_room_id;

        // 룸 멤버 추가
        const { error: memberError } = await client
            .from("message_room_members")
            .insert([
                { message_room_id: messageRoomId, profile_id: fromUserId },
                { message_room_id: messageRoomId, profile_id: toUserId },
            ]);

        if (memberError) {
            console.error("Error adding room members:", memberError);
            throw memberError;
        }
    }

    // 메시지 전송
    const { error: messageError } = await client
        .from("messages")
        .insert({
            message_room_id: messageRoomId,
            sender_id: fromUserId,
            content,
        });

    if (messageError) {
        console.error("Error sending message:", messageError);
        throw messageError;
    }

    return messageRoomId;
};

