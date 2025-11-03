import { Form } from "react-router";
import { redirect } from "react-router";

import type { Route } from "./+types/message-page";

import { SendIcon } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getMessages, getMessageRoom, getLoggedInUserId } from "../queries";
import { MessageBubble } from "../components/message-bubble";

import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Message | wemake" }];
};

export async function loader({ request, params }: Route.LoaderArgs) {
    const messageRoomId = Number(params.messageId);
    if (isNaN(messageRoomId)) {
        throw new Response("Invalid message room ID", { status: 400 });
    }

    const [messageRoom, messages] = await Promise.all([
        getMessageRoom(request, messageRoomId),
        getMessages(request, messageRoomId),
    ]);

    const { supabase } = createSupabaseServerClient(request);
    const currentUserId = await getLoggedInUserId(supabase);

    return {
        messageRoom,
        messages,
        currentUserId,
    };
}

export async function action({ request, params }: Route.ActionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const messageRoomId = Number(params.messageId);
    if (isNaN(messageRoomId)) {
        return Response.json({ error: "Invalid message room ID" }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const content = formData.get("content") as string;

        if (!content || content.trim() === "") {
            return Response.json({ error: "Message content is required" }, { status: 400 });
        }

        const { supabase } = createSupabaseServerClient(request);
        const currentUserId = await getLoggedInUserId(supabase);

        // 메시지 룸에서 상대방 찾기
        const messageRoom = await getMessageRoom(request, messageRoomId);
        const otherUserId = messageRoom.otherUser.profile_id;

        // 메시지 전송 (기존 룸 사용)
        const { error: messageError } = await supabase.from("messages").insert({
            message_room_id: messageRoomId,
            sender_id: currentUserId,
            content,
        });

        if (messageError) {
            console.error("Error sending message:", messageError);
            throw new Response("Failed to send message", { status: 500 });
        }

        return redirect(`/my/messages/${messageRoomId}`);
    } catch (error) {
        console.error("Error in message-page action:", error);
        if (error instanceof Response) {
            throw error;
        }
        throw new Response("Failed to send message", { status: 500 });
    }
}

export default function MessagePage({ loaderData }: Route.ComponentProps) {
    const { messageRoom, messages, currentUserId } = loaderData;
    const otherUser = messageRoom.otherUser;

    return (
        <div className="h-full flex flex-col">
            <Card className="rounded-none border-x-0 border-t-0">
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <div className="relative">
                        <Avatar className="size-14">
                            <AvatarImage src={otherUser.avatar || undefined} />
                            <AvatarFallback>
                                {otherUser.name[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <Badge
                            className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-background bg-green-500 p-0"
                        />
                    </div>
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{otherUser.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                                Online
                            </Badge>
                        </div>
                        <CardDescription>@{otherUser.username}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((message) => {
                        const isCurrentUser = message.sender_id === currentUserId;
                        return (
                            <MessageBubble
                                key={message.message_id}
                                avatarUrl={message.sender.avatar || undefined}
                                avatarFallback={message.sender.name[0]?.toUpperCase() || "U"}
                                content={message.content}
                                isCurrentUser={isCurrentUser}
                            />
                        );
                    })
                )}
            </div>
            <Card className="rounded-none border-x-0 border-b-0">
                <CardHeader className="py-4">
                    <Form method="post" className="relative flex items-center gap-2">
                        <Textarea
                            name="content"
                            placeholder="Write a message..."
                            rows={2}
                            className="resize-none pr-12"
                            required
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

