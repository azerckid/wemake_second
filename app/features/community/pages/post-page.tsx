import { Form, Link, useFetcher, useRevalidator, redirect } from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/post-page";

import { z } from "zod";
import { DateTime } from "luxon";
import { ChevronUpIcon, DotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { createReply } from "../mutations";
import { getPostById, getRepliesByPostId } from "../queries";
import { getLoggedInUserId } from "~/features/users/queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { Reply } from "../components/reply";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Avatar } from "~/common/components/ui/avatar";
import { Textarea } from "~/common/components/ui/textarea";
import { AvatarImage } from "~/common/components/ui/avatar";
import { AvatarFallback } from "~/common/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/common/components/ui/breadcrumb";

interface ReplyChild {
    post_reply_id: number;
    author_name: string;
    author_avatar: string | null;
    reply: string;
    created_at: string;
    children?: ReplyChild[];
}

function transformReply(reply: ReplyChild, depth: number = 0): any {
    return {
        username: reply.author_name,
        avatarUrl: reply.author_avatar || "",
        reply: reply.reply,
        created_at: reply.created_at, // Keep as string to preserve UTC from database
        children: reply.children?.map(child => transformReply(child, depth + 1)),
        post_reply_id: reply.post_reply_id,
        depth,
    };
}

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Post | wemake" },
        { name: "description", content: "View community post" },
    ];
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const [post, replies] = await Promise.all([
        getPostById(request, params.postId),
        getRepliesByPostId(request, params.postId),
    ]);

    // 현재 로그인한 사용자 프로필 정보 가져오기 (댓글 작성용)
    let currentUser = null;
    try {
        const userId = await getLoggedInUserId(supabase);
        const { data: profile } = await supabase
            .from("profiles")
            .select("profile_id, name, username, avatar")
            .eq("profile_id", userId)
            .single();
        if (profile) {
            currentUser = {
                profile_id: profile.profile_id,
                name: profile.name,
                username: profile.username,
                avatar: profile.avatar,
            };
        }
    } catch {
        // 로그인하지 않은 경우 무시
    }

    return { post, replies, currentUser };
};

const replySchema = z.object({
    reply: z.string().min(1, "Reply cannot be empty").max(1000, "Reply must be 1000 characters or less"),
    parent_id: z.string().optional(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const postId = Number(params.postId);
    const formData = await request.formData();

    if (isNaN(postId)) {
        throw new Response("Invalid post ID", { status: 400 });
    }

    const { success, error, data } = replySchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!success) {
        return {
            fieldErrors: error.flatten().fieldErrors,
        };
    }

    const { reply, parent_id } = data;

    await createReply(supabase, {
        post_id: postId,
        parent_id: parent_id ? Number(parent_id) : null,
        reply,
        userId,
    });

    // Redirect to the same page to refresh the replies
    return redirect(`/community/${postId}`);
};

export default function PostPage({ loaderData, actionData }: Route.ComponentProps) {
    const fetcher = useFetcher();
    const revalidator = useRevalidator();

    // Optimistic UI: 서버 응답 전에 즉시 UI 업데이트
    const optimisticVotesCount =
        fetcher.state === "idle"
            ? loaderData.post.upvotes
            : loaderData.post.is_upvoted
                ? loaderData.post.upvotes - 1  // 클릭 시 downvote 예상
                : loaderData.post.upvotes + 1; // 클릭 시 upvote 예상

    const optimisticIsUpvoted = fetcher.state === "idle" ? loaderData.post.is_upvoted : !loaderData.post.is_upvoted;

    // Fetch가 완료되면 데이터를 다시 로드
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            revalidator.revalidate();
        }
    }, [fetcher.state, fetcher.data, revalidator]);

    return (

        <div className="space-y-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/community">Community</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/community?topic=${loaderData.post.topic_slug}`}>{loaderData.post.topic_name}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/community/${loaderData.post.post_id}`}>
                                {loaderData.post.title}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-6 gap-40 items-start">
                <div className="col-span-4 space-y-10">
                    <div className="flex w-full items-start gap-10">
                        <fetcher.Form method="post" action={`/community/${loaderData.post.post_id}/upvote`}>
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={fetcher.state !== "idle"}
                                className={cn(
                                    "flex flex-col h-14",
                                    optimisticIsUpvoted ? "border-primary text-primary" : ""
                                )}
                            >
                                <ChevronUpIcon className="size-4 shrink-0" />
                                <span>{optimisticVotesCount}</span>
                            </Button>
                        </fetcher.Form>
                        <div className="space-y-20 flex-1">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold">
                                    {loaderData.post.title}
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>@{loaderData.post.author_name}</span>
                                    <DotIcon className="size-5" />
                                    <span>{DateTime.fromISO(loaderData.post.created_at, { zone: "utc" }).setZone("Asia/Seoul").toRelative()}</span>
                                    <DotIcon className="size-5" />
                                    <span>{loaderData.post.replies} replies</span>
                                </div>
                                <p className="text-muted-foreground w-full">
                                    {loaderData.post.content}
                                </p>
                            </div>
                            {loaderData.currentUser && (
                                <Form method="post" className="flex items-start gap-5 w-full">
                                    <Avatar className="size-14">
                                        <AvatarFallback>{loaderData.currentUser.name[0]?.toUpperCase() || "U"}</AvatarFallback>
                                        {loaderData.currentUser.avatar && <AvatarImage src={loaderData.currentUser.avatar} />}
                                    </Avatar>
                                    <div className="flex flex-col gap-5 items-end w-full">
                                        <Textarea
                                            key={`reply-${loaderData.post.replies}`}
                                            name="reply"
                                            placeholder="Write a reply"
                                            className="w-full resize-none"
                                            rows={5}
                                            required
                                        />
                                        {actionData && "fieldErrors" in actionData && actionData.fieldErrors && actionData.fieldErrors.reply && (
                                            <div className="text-red-500 text-sm">
                                                {actionData.fieldErrors.reply.join(", ")}
                                            </div>
                                        )}
                                        <Button type="submit">Reply</Button>
                                    </div>
                                </Form>
                            )}
                            <div className="space-y-10">
                                <h4 className="font-semibold">{loaderData.post.replies} Replies</h4>
                                <div className="flex flex-col gap-5">
                                    {loaderData.replies.length > 0 ? (
                                        loaderData.replies.map((reply) => (
                                            <Reply
                                                key={reply.post_reply_id}
                                                username={reply.author_name}
                                                avatarUrl={reply.author_avatar || ""}
                                                reply={reply.reply}
                                                created_at={reply.created_at}
                                                children={reply.children?.map(transformReply)}
                                                post_reply_id={reply.post_reply_id}
                                                currentUser={loaderData.currentUser}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <aside className="col-span-2 space-y-5 border rounded-lg p-6 shadow-sm">
                    <div className="flex gap-5">
                        <Avatar className="size-14">
                            <AvatarFallback>{loaderData.post.author_name[0]}</AvatarFallback>
                            {loaderData.post.author_avatar && <AvatarImage src={loaderData.post.author_avatar} />}
                        </Avatar>
                        <div className="flex flex-col">
                            <h4 className="text-lg font-medium">{loaderData.post.author_name}</h4>
                            <Badge variant="secondary">{loaderData.post.author_role}</Badge>
                        </div>
                    </div>
                    <div className="gap-2 text-sm flex flex-col">
                        <span>🎂 Joined {DateTime.fromISO(loaderData.post.author_created_at, { zone: "utc" }).setZone("Asia/Seoul").toRelative()}</span>
                        <span>🚀 Launched {loaderData.post.products} products</span>
                    </div>
                    <Button variant="outline" className="w-full">
                        Follow
                    </Button>
                </aside>
            </div>
        </div >
    );
}

