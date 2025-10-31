import { Form } from "react-router";
import type { Route } from "./+types/message-page";

import { SendIcon } from "lucide-react";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { MessageBubble } from "../components/message-bubble";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";
import { getMessages, getMessageRoom, getLoggedInUserId } from "../queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

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

export default function MessagePage({ loaderData }: Route.ComponentProps) {
    const { messageRoom, messages, currentUserId } = loaderData;
    const otherUser = messageRoom.otherUser;

    return (
        <div className="h-full flex flex-col justify-between">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
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
            <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full">
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
            <Card>
                <CardHeader>
                    <Form className="relative flex justify-end items-center">
                        <Textarea
                            name="content"
                            placeholder="Write a message..."
                            rows={2}
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

