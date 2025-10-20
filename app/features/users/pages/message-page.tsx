import { Form } from "react-router";

import type { Route } from "./+types/message-page";

import { SendIcon } from "lucide-react";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { MessageBubble } from "../components/message-bubble";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Message | wemake" }];
};

export default function MessagePage() {
    return (
        <div className="h-full flex flex-col justify-between">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="relative">
                        <Avatar className="size-14">
                            <AvatarImage src="https://github.com/zizimoos.png" />
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <Badge
                            className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-background bg-green-500 p-0"
                        />
                    </div>
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">zizimoos</CardTitle>
                            <Badge variant="outline" className="text-xs">
                                Online
                            </Badge>
                        </div>
                        <CardDescription>2 days ago</CardDescription>
                    </div>
                </CardHeader>
            </Card>
            <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full">
                {Array.from({ length: 10 }).map((_, index) => {
                    const isCurrentUser = index % 2 === 0;
                    return (
                        <MessageBubble
                            key={index}
                            avatarUrl={
                                isCurrentUser
                                    ? "https://github.com/zizimoos.png"
                                    : "https://github.com/azerckid.png"
                            }
                            avatarFallback={isCurrentUser ? "Z" : "A"}
                            content="this is a message from steve jobs in iheaven, make sure to reply because if you don't, you will be punished."
                            isCurrentUser={isCurrentUser}
                        />
                    );
                })}
            </div>
            <Card>
                <CardHeader>
                    <Form className="relative flex justify-end items-center">
                        <Textarea
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

