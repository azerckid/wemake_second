import { Form, useOutletContext, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import type { Route } from "./+types/message-page";

import { SendIcon } from "lucide-react";
import { MessageBubble } from "../components/message-bubble";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { createSupabaseBrowserClient } from "~/lib/supabase.client";
import {
    getLoggedInUserId,
    getMessagesByMessagesRoomId,
    getRoomsParticipant,
    sendMessageToRoom,
    type MessageRow,
} from "../queries";

import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Message | wemake" }];
};

export async function loader({ request, params }: Route.LoaderArgs) {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);

    const messageRoomId = Number(params.messageRoomId);

    const [messages, participant] = await Promise.all([
        getMessagesByMessagesRoomId(supabase, {
            messageRoomId,
            userId,
        }),
        getRoomsParticipant(supabase, {
            messageRoomId,
            userId,
        }),
    ]);

    return {
        messages,
        participant,
    };
}

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();
    const message = formData.get("message");
    await sendMessageToRoom(supabase, {
        messageRoomId: params.messageRoomId!,
        message: message as string,
        userId,
    });
    return {
        ok: true,
    };
};

export const shouldRevalidate = () => false;

export default function MessagePage({
    loaderData,
    actionData,
}: Route.ComponentProps) {
    const params = useParams();
    const { userId, name, avatar } = useOutletContext<{
        userId: string;
        name: string;
        avatar: string;
    }>();
    const formRef = useRef<HTMLFormElement>(null);
    const [messages, setMessages] = useState<MessageRow[]>(
        loaderData.messages || []
    );

    useEffect(() => {
        if (actionData?.ok) {
            formRef.current?.reset();
        }
    }, [actionData]);

    useEffect(() => {
        const messageRoomId = Number(params.messageRoomId);
        if (!messageRoomId) return;

        const supabase = createSupabaseBrowserClient();
        const channel = supabase
            .channel(`messages:${messageRoomId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `message_room_id=eq.${messageRoomId}`,
                },
                (payload) => {
                    console.log("📨 새 메시지 수신:", payload);
                    const newMessage = payload.new as MessageRow;
                    setMessages((prev) => {
                        // 중복 메시지 방지: 이미 존재하는 메시지 ID인지 확인
                        const exists = prev.some(
                            (msg) => msg.message_id === newMessage.message_id
                        );
                        if (exists) {
                            console.log("⚠️ 중복 메시지 감지, 무시:", newMessage.message_id);
                            return prev;
                        }

                        console.log("✅ 새 메시지 추가:", newMessage.content);
                        // 새 메시지를 추가하고 created_at 기준으로 정렬
                        return [...prev, newMessage].sort(
                            (a, b) =>
                                new Date(a.created_at).getTime() -
                                new Date(b.created_at).getTime()
                        );
                    });
                }
            )
            .subscribe((status) => {
                console.log("🔌 Realtime 구독 상태:", status);
                if (status === "SUBSCRIBED") {
                    console.log("✅ 메시지 룸 구독 성공:", messageRoomId);
                } else if (status === "CHANNEL_ERROR") {
                    console.error("❌ 채널 구독 실패:", messageRoomId);
                }
            });

        return () => {
            console.log("🧹 구독 정리:", messageRoomId);
            supabase.removeChannel(channel);
        };
    }, [params.messageRoomId]);
    return (
        <div className="h-full flex flex-col justify-between">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="size-14">
                        <AvatarImage src={loaderData.participant?.profile?.avatar ?? ""} />
                        <AvatarFallback>
                            {loaderData.participant?.profile?.name.charAt(0) ?? ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0">
                        <CardTitle className="text-xl">
                            {loaderData.participant?.profile?.name ?? ""}
                        </CardTitle>
                        <CardDescription>2 days ago</CardDescription>
                    </div>
                </CardHeader>
            </Card>
            <div className="py-10 overflow-y-scroll space-y-4 flex flex-col justify-start h-full">
                {messages.map((message) => {
                    const isCurrentUser = message.sender_id === userId;
                    return (
                        <MessageBubble
                            key={message.message_id}
                            avatarUrl={
                                isCurrentUser
                                    ? avatar
                                    : loaderData.participant?.profile?.avatar ?? ""
                            }
                            avatarFallback={
                                isCurrentUser
                                    ? name.charAt(0)
                                    : loaderData.participant?.profile?.name.charAt(0) ?? ""
                            }
                            content={message.content}
                            isCurrentUser={isCurrentUser}
                        />
                    );
                })}
            </div>
            <Card>
                <CardHeader>
                    <Form
                        ref={formRef}
                        method="post"
                        className="relative flex justify-end items-center"
                    >
                        <Textarea
                            placeholder="Write a message..."
                            rows={2}
                            required
                            name="message"
                            className="resize-none"
                        />
                        <Button type="submit" size="icon" className="absolute right-2">
                            <SendIcon className="size-4" />
                        </Button>
                    </Form>
                </CardHeader>
            </Card>
        </div>
    );
}

