import { Form, useOutletContext } from "react-router";
import { SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import {
    getLoggedInUserId,
    getMessagesByMessagesRoomId,
    getRoomsParticipant,
    sendMessageToRoom,
} from "../queries";
import { MessageBubble } from "../components/message-bubble";
import type { Route } from "./+types/message-page";

import { Badge } from "~/common/components/ui/badge";
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

export default function MessagePage({
    loaderData,
    actionData,
}: Route.ComponentProps) {
    const { userId } = useOutletContext<{ userId: string }>();
    const formRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if (actionData?.ok) {
            formRef.current?.reset();
        }
    }, [actionData]);
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
                {loaderData.messages.map((message) => (
                    <MessageBubble
                        key={message.message_id}
                        avatarUrl={message.sender?.avatar ?? ""}
                        avatarFallback={message.sender?.name.charAt(0) ?? ""}
                        content={message.content}
                        isCurrentUser={message.sender?.profile_id === userId}
                    />
                ))}
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

