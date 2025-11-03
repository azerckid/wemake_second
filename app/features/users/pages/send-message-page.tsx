import { redirect } from "react-router";
import { isRouteErrorResponse } from "react-router";
import { Form } from "react-router";

import type { Route } from "./+types/send-message-page";

import { SendIcon } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId, getUserProfileByClient, getUserProfile } from "../queries";
import { sendMessage } from "../mutations";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";
import { Card, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Send Message | wemake" }];
};

export async function loader({ request, params }: Route.LoaderArgs) {
    if (!params.username) {
        throw new Response("Username is required", { status: 400 });
    }
    
    try {
        const userProfile = await getUserProfile(request, params.username);
        return {
            userProfile,
        };
    } catch (error) {
        if (error instanceof Response) {
            throw error;
        }
        throw new Response("Failed to load user profile", { status: 500 });
    }
}

export const action = async ({ request, params }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    
    if (!params.username) {
        return Response.json({ error: "Username is required" }, { status: 400 });
    }
    
    try {
        const formData = await request.formData();
        const content = formData.get("content") as string;
        
        if (!content || content.trim() === "") {
            return Response.json({ error: "Message content is required" }, { status: 400 });
        }
        
        const { supabase } = createSupabaseServerClient(request);
        const fromUserId = await getLoggedInUserId(supabase);
        
        const { profile_id: toUserId } = await getUserProfileByClient(supabase, {
            username: params.username,
        });
        
        const messageRoomId = await sendMessage(supabase, {
            fromUserId,
            toUserId,
            content,
        });
        
        return redirect(`/my/messages/${messageRoomId}`);
    } catch (error) {
        console.error("Error in send-message-page action:", error);
        if (error instanceof Response) {
            throw error;
        }
        if (error instanceof Error) {
            throw new Response(error.message, { status: 500 });
        }
        throw new Response("Failed to send message", { status: 500 });
    }
};

export default function SendMessagePage({ loaderData }: Route.ComponentProps) {
    const { userProfile } = loaderData;
    
    return (
        <div className="h-full flex flex-col justify-between">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="size-14">
                        <AvatarImage src={userProfile.avatar || undefined} />
                        <AvatarFallback>
                            {userProfile.name[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0">
                        <CardTitle className="text-xl">{userProfile.name}</CardTitle>
                        <CardDescription>@{userProfile.username}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
            <div className="py-10 flex items-center justify-center h-full">
                <div className="text-muted-foreground text-center">
                    <p className="text-lg mb-2">Start a conversation with {userProfile.name}</p>
                    <p className="text-sm">Send a message below to get started!</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Form method="post" className="relative flex justify-end items-center">
                        <Textarea
                            name="content"
                            placeholder="Write a message..."
                            rows={2}
                            className="resize-none"
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Error";
    let details = "An unexpected error occurred.";
    
    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details = error.status === 404 
            ? "User not found" 
            : error.statusText || details;
    } else if (error instanceof Error) {
        details = error.message;
    }
    
    return (
        <div className="pt-16 p-4 container mx-auto">
            <h1 className="text-2xl font-bold mb-4">{message}</h1>
            <p className="text-muted-foreground">{details}</p>
        </div>
    );
}

