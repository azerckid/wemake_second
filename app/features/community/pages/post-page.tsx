import { Form, Link } from "react-router";

import type { Route } from "./+types/post-page";

import { getPostById, getRepliesByPostId } from "../queries";
import { ChevronUpIcon, DotIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/common/components/ui/breadcrumb";
import { Button } from "~/common/components/ui/button";
import { Avatar } from "~/common/components/ui/avatar";
import { AvatarFallback } from "~/common/components/ui/avatar";
import { AvatarImage } from "~/common/components/ui/avatar";
import { Reply } from "../components/reply";
import { Badge } from "~/common/components/ui/badge";
import { Textarea } from "~/common/components/ui/textarea";

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
        created_at: new Date(reply.created_at),
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

export const loader = async ({ params }: Route.LoaderArgs) => {
    const [post, replies] = await Promise.all([
        getPostById(params.postId),
        getRepliesByPostId(params.postId),
    ]);
    return { post, replies };
};

export default function PostPage({ loaderData }: Route.ComponentProps) {
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
                        <Button variant="outline" className="flex flex-col h-14">
                            <ChevronUpIcon className="size-4 shrink-0" />
                            <span>{loaderData.post.upvotes}</span>
                        </Button>
                        <div className="space-y-20">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold">
                                    {loaderData.post.title}
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>@{loaderData.post.author_name}</span>
                                    <DotIcon className="size-5" />
                                    <span>{DateTime.fromISO(loaderData.post.created_at).toRelative()}</span>
                                    <DotIcon className="size-5" />
                                    <span>{loaderData.post.replies} replies</span>
                                </div>
                                <p className="text-muted-foreground w-3/4">
                                    {loaderData.post.content}
                                </p>
                            </div>

                            {/* TODO: Implement reply form submission */}
                            <Form className="flex items-start gap-5 w-3/4">
                                <Avatar className="size-14">
                                    <AvatarFallback>{loaderData.post.author_name[0]}</AvatarFallback>
                                    {loaderData.post.author_avatar && <AvatarImage src={loaderData.post.author_avatar} />}
                                </Avatar>
                                <div className="flex flex-col gap-5 items-end w-full">
                                    <Textarea
                                        placeholder="Write a reply"
                                        className="w-full resize-none"
                                        rows={5}
                                    />
                                    <Button>Reply</Button>
                                </div>
                            </Form>
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
                                                created_at={new Date(reply.created_at)}
                                                children={reply.children?.map(transformReply)}
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
                        <span>🎂 Joined {DateTime.fromISO(loaderData.post.author_created_at).toRelative()}</span>
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

