import { redirect } from "react-router";

import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "~/lib/supabase.server";
import { productListSelect } from "../products/queries";

// Realtime 메시지 타입 (데이터베이스 Row 타입)
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

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

export const getUserProfileByClient = async (
    client: SupabaseClient<Database>,
    { username }: { username: string }
): Promise<{ profile_id: string }> => {
    const { data, error } = await client
        .from("profiles")
        .select("profile_id")
        .eq("username", username)
        .single();
    if (error) {
        if (error.code === 'PGRST116') {
            throw new Response("User not found", { status: 404 });
        }
        throw error;
    }
    if (!data) {
        throw new Response("User not found", { status: 404 });
    }
    return data as { profile_id: string };
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

    // 뷰를 사용하여 메시지 룸 목록 가져오기
    const { data: roomsData, error } = await supabase
        .from("messages_view")
        .select("*")
        .eq("profile_id", userId)
        .neq("other_profile_id", userId);

    if (error || !roomsData) {
        return [];
    }

    // 뷰 데이터를 MessageRoom 형식으로 변환
    const rooms: MessageRoom[] = roomsData
        .filter((room) => room.message_room_id && room.other_profile_id)
        .map((room) => ({
            message_room_id: room.message_room_id!,
            otherUser: {
                profile_id: room.other_profile_id!,
                name: room.name || "",
                username: room.username || "",
                avatar: room.avatar,
            },
            lastMessage: room.last_message && room.last_message_created_at
                ? {
                    content: room.last_message,
                    created_at: room.last_message_created_at,
                }
                : null,
        }));

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

export const getMessagesByMessagesRoomId = async (
    client: SupabaseClient<Database>,
    { messageRoomId, userId }: { messageRoomId: number; userId: string }
) => {
    const { count, error: countError } = await client
        .from("message_room_members")
        .select("*", { count: "exact", head: true })
        .eq("message_room_id", messageRoomId)
        .eq("profile_id", userId);

    if (countError) {
        throw countError;
    }
    if (count === 0) {
        throw new Error("Message room not found");
    }

    const { data, error } = await client
        .from("messages")
        .select("*")
        .eq("message_room_id", messageRoomId)
        .order("created_at", { ascending: true });

    if (error) {
        throw error;
    }
    return data || [];
};

export const getRoomsParticipant = async (
    client: SupabaseClient<Database>,
    { messageRoomId, userId }: { messageRoomId: number; userId: string }
) => {
    const { count, error: countError } = await client
        .from("message_room_members")
        .select("*", { count: "exact", head: true })
        .eq("message_room_id", messageRoomId)
        .eq("profile_id", userId);

    if (countError) {
        throw countError;
    }
    if (count === 0) {
        throw new Error("Message room not found");
    }

    const { data, error } = await client
        .from("message_room_members")
        .select(
            `
            profile:profiles!profile_id!inner(
                name,
                profile_id,
                avatar
            )
            `
        )
        .eq("message_room_id", messageRoomId)
        .neq("profile_id", userId)
        .single();

    if (error) {
        throw error;
    }
    return data;
};

export const sendMessageToRoom = async (
    client: SupabaseClient<Database>,
    {
        messageRoomId,
        message,
        userId,
    }: { messageRoomId: string; message: string; userId: string }
) => {
    const messageRoomIdNum = Number(messageRoomId);
    const { count, error: countError } = await client
        .from("message_room_members")
        .select("*", { count: "exact", head: true })
        .eq("message_room_id", messageRoomIdNum)
        .eq("profile_id", userId);
    if (countError) {
        throw countError;
    }
    if (count === 0) {
        throw new Error("Message room not found");
    }
    const { error } = await client.from("messages").insert({
        content: message,
        message_room_id: messageRoomIdNum,
        sender_id: userId,
    });
    if (error) {
        throw error;
    }
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

type Notification = {
    notification_id: number;
    type: "follow" | "review" | "reply";
    source_id: string | null;
    target_id: string;
    product_id: number | null;
    post_id: number | null;
    seen: boolean;
    created_at: string;
    source_profile: {
        name: string;
        username: string;
        avatar: string | null;
    } | null;
    product_name: string | null;
    post_title: string | null;
};

export const getNotifications = async (request: Request): Promise<Notification[]> => {
    const { supabase } = createSupabaseServerClient(request);

    // 현재 로그인한 사용자의 ID 가져오기
    const userId = await getLoggedInUserId(supabase);

    // 알림 가져오기 (제품명과 포스트 제목도 함께 조회)
    const { data: notifications, error } = await supabase
        .from("notifications")
        .select(
            `
            notification_id,
            type,
            source_id,
            target_id,
            product_id,
            post_id,
            seen,
            created_at,
            products(name),
            posts(title)
            `
        )
        .eq("target_id", userId)
        .order("created_at", { ascending: false });

    if (error || !notifications) {
        return [];
    }

    // 발신자 프로필 정보 가져오기
    const sourceIds = notifications
        .map((n) => n.source_id)
        .filter((id): id is string => id !== null);

    if (sourceIds.length === 0) {
        return notifications.map((n: any) => {
            const product = Array.isArray(n.products) ? n.products[0] : n.products;
            const post = Array.isArray(n.posts) ? n.posts[0] : n.posts;

            return {
                notification_id: n.notification_id,
                type: n.type,
                source_id: n.source_id,
                target_id: n.target_id,
                product_id: n.product_id,
                post_id: n.post_id,
                seen: n.seen,
                created_at: n.created_at,
                source_profile: null,
                product_name: product?.name || null,
                post_title: post?.title || null,
            };
        });
    }

    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("profile_id, name, username, avatar")
        .in("profile_id", sourceIds);

    if (profilesError || !profiles) {
        return notifications.map((n: any) => {
            const product = Array.isArray(n.products) ? n.products[0] : n.products;
            const post = Array.isArray(n.posts) ? n.posts[0] : n.posts;

            return {
                notification_id: n.notification_id,
                type: n.type,
                source_id: n.source_id,
                target_id: n.target_id,
                product_id: n.product_id,
                post_id: n.post_id,
                seen: n.seen,
                created_at: n.created_at,
                source_profile: null,
                product_name: product?.name || null,
                post_title: post?.title || null,
            };
        });
    }

    const profileMap = new Map(profiles.map((p) => [p.profile_id, p]));

    return notifications.map((notification: any) => {
        // Supabase nested select는 배열 또는 객체로 반환될 수 있음
        const product = Array.isArray(notification.products)
            ? notification.products[0]
            : notification.products;
        const post = Array.isArray(notification.posts)
            ? notification.posts[0]
            : notification.posts;

        return {
            notification_id: notification.notification_id,
            type: notification.type,
            source_id: notification.source_id,
            target_id: notification.target_id,
            product_id: notification.product_id,
            post_id: notification.post_id,
            seen: notification.seen,
            created_at: notification.created_at,
            source_profile: notification.source_id
                ? profileMap.get(notification.source_id) || null
                : null,
            product_name: product?.name || null,
            post_title: post?.title || null,
        };
    });
};

export const countNotifications = async (
    client: SupabaseClient<Database>,
    { userId }: { userId: string }
) => {
    const { count, error } = await client
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("seen", false)
        .eq("target_id", userId);
    if (error) {
        throw error;
    }
    return count ?? 0;
};