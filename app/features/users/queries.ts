import { redirect } from "react-router";

import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "~/lib/supabase.server";
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

export const getUserProfile = async (request: Request, username: string): Promise<UserProfile> => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
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

export const getUserProducts = async (request: Request, username: string) => {
    const { supabase } = createSupabaseServerClient(request);

    // First get the profile_id from username
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("profile_id")
        .eq("username", username)
        .single();

    if (profileError || !profile) {
        return [];
    }

    // Then get products for that profile
    const { data, error } = await supabase
        .from("products")
        .select(productListSelect)
        .eq("profile_id", profile.profile_id);

    if (error) {
        return [];
    }
    return data || [];
};

export const getProductsByUserId = async (
    client: SupabaseClient<Database>,
    { userId }: { userId: string }
) => {
    const { data, error } = await client
        .from("products")
        .select(`name, product_id`)
        .eq("profile_id", userId);
    if (error) {
        throw error;
    }
    return data;
};

export const getUserPosts = async (request: Request, username: string) => {
    const { supabase } = createSupabaseServerClient(request);

    // Use the existing view with username filter
    const { data, error } = await supabase
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

export const getUserById = async (
    client: SupabaseClient<Database>,
    { id }: { id: string }
) => {
    const { data, error } = await client
        .from("profiles")
        .select(
            `
          profile_id,
          name,
          username,
          avatar,
          headline,
          bio,
          role 
          `
        )
        .eq("profile_id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
    const { data, error } = await client.auth.getUser();
    if (error || data.user === null) {
        throw redirect("/auth/login");
    }
    return data.user.id;
};

export const getUserJobs = async (request: Request, userId: string) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("jobs")
        .select(
            `
            job_id,
            position,
            overview,
            company_name,
            company_logo,
            company_location,
            job_type,
            location,
            salary_range,
            created_at
            `
        )
        .eq("profile_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }
    return data || [];
};

type MessageRoom = {
    message_room_id: number;
    otherUser: {
        profile_id: string;
        name: string;
        username: string;
        avatar: string | null;
    };
    lastMessage: {
        content: string;
        created_at: string;
    } | null;
};

export const getMessageRooms = async (request: Request): Promise<MessageRoom[]> => {
    const { supabase } = createSupabaseServerClient(request);

    // 현재 로그인한 사용자의 ID 가져오기
    const userId = await getLoggedInUserId(supabase);

    // 현재 사용자가 속한 메시지 룸들 가져오기
    const { data: roomMembers, error: membersError } = await supabase
        .from("message_room_members")
        .select("message_room_id")
        .eq("profile_id", userId);

    if (membersError || !roomMembers || roomMembers.length === 0) {
        return [];
    }

    const roomIds = roomMembers.map((rm) => rm.message_room_id);

    // 각 룸의 상대방과 마지막 메시지 정보 가져오기
    const rooms: MessageRoom[] = [];

    for (const roomId of roomIds) {
        // 해당 룸의 멤버들 가져오기
        const { data: members, error: membersError2 } = await supabase
            .from("message_room_members")
            .select("profile_id")
            .eq("message_room_id", roomId);

        if (membersError2 || !members) continue;

        // 상대방 찾기 (현재 사용자가 아닌 멤버)
        const otherMember = members.find((m) => m.profile_id !== userId);
        if (!otherMember) continue;

        // 상대방 프로필 정보 가져오기
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("profile_id, name, username, avatar")
            .eq("profile_id", otherMember.profile_id)
            .single();

        if (profileError || !profile) continue;

        // 마지막 메시지 가져오기
        const { data: lastMessage, error: messageError } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("message_room_id", roomId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        rooms.push({
            message_room_id: roomId,
            otherUser: {
                profile_id: profile.profile_id,
                name: profile.name,
                username: profile.username,
                avatar: profile.avatar,
            },
            lastMessage: lastMessage
                ? {
                    content: lastMessage.content,
                    created_at: lastMessage.created_at,
                }
                : null,
        });
    }

    // 마지막 메시지 시간 기준으로 정렬
    rooms.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
    });

    return rooms;
};

type Message = {
    message_id: number;
    sender_id: string;
    content: string;
    created_at: string;
    sender: {
        name: string;
        username: string;
        avatar: string | null;
    };
};

export const getMessages = async (
    request: Request,
    messageRoomId: number
): Promise<Message[]> => {
    const { supabase } = createSupabaseServerClient(request);

    // 메시지 룸에 속한 멤버인지 확인
    const userId = await getLoggedInUserId(supabase);
    const { data: member, error: memberError } = await supabase
        .from("message_room_members")
        .select("profile_id")
        .eq("message_room_id", messageRoomId)
        .eq("profile_id", userId)
        .single();

    if (memberError || !member) {
        throw new Response("Unauthorized", { status: 403 });
    }

    // 메시지들 가져오기
    const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("message_id, sender_id, content, created_at")
        .eq("message_room_id", messageRoomId)
        .order("created_at", { ascending: true });

    if (messagesError || !messages) {
        return [];
    }

    // 각 메시지의 발신자 정보 가져오기
    const messagesWithSenders: Message[] = [];
    const senderIds = [
        ...new Set(messages.map((m) => m.sender_id).filter((id): id is string => id !== null)),
    ];

    if (senderIds.length === 0) {
        return [];
    }

    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("profile_id, name, username, avatar")
        .in("profile_id", senderIds);

    if (profilesError || !profiles) {
        return [];
    }

    const profileMap = new Map(profiles.map((p) => [p.profile_id, p]));

    for (const message of messages) {
        if (!message.sender_id) continue;

        const sender = profileMap.get(message.sender_id);
        if (!sender) continue;

        messagesWithSenders.push({
            message_id: message.message_id,
            sender_id: message.sender_id,
            content: message.content,
            created_at: message.created_at,
            sender: {
                name: sender.name,
                username: sender.username,
                avatar: sender.avatar,
            },
        });
    }

    return messagesWithSenders;
};

type MessageRoomDetail = {
    message_room_id: number;
    otherUser: {
        profile_id: string;
        name: string;
        username: string;
        avatar: string | null;
    };
};

export const getMessageRoom = async (
    request: Request,
    messageRoomId: number
): Promise<MessageRoomDetail> => {
    const { supabase } = createSupabaseServerClient(request);

    // 현재 로그인한 사용자의 ID 가져오기
    const userId = await getLoggedInUserId(supabase);

    // 메시지 룸에 속한 멤버인지 확인하고 멤버들 가져오기
    const { data: members, error: membersError } = await supabase
        .from("message_room_members")
        .select("profile_id")
        .eq("message_room_id", messageRoomId);

    if (membersError || !members) {
        throw new Response("Message room not found", { status: 404 });
    }

    // 현재 사용자가 룸의 멤버인지 확인
    const isMember = members.some((m) => m.profile_id === userId);
    if (!isMember) {
        throw new Response("Unauthorized", { status: 403 });
    }

    // 상대방 찾기 (현재 사용자가 아닌 멤버)
    const otherMember = members.find((m) => m.profile_id !== userId);
    if (!otherMember) {
        throw new Response("Invalid message room", { status: 400 });
    }

    // 상대방 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("profile_id, name, username, avatar")
        .eq("profile_id", otherMember.profile_id)
        .single();

    if (profileError || !profile) {
        throw new Response("Profile not found", { status: 404 });
    }

    return {
        message_room_id: messageRoomId,
        otherUser: {
            profile_id: profile.profile_id,
            name: profile.name,
            username: profile.username,
            avatar: profile.avatar,
        },
    };
};