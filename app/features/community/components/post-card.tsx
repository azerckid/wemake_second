import { Link, useFetcher, useRevalidator } from "react-router";
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/common/components/ui/card";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { ChevronUpIcon, DotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";
import { useEffect } from "react";

interface PostCardProps {
    post_id: number;
    title: string;
    author: string;
    authorAvatarUrl: string | null;
    topic_id: number;
    topic_name: string;
    created_at: string | Date;
    expanded?: boolean;
    votesCount?: number;
    isUpvoted?: boolean;
}

export function PostCard({
    post_id,
    title,
    author,
    authorAvatarUrl,
    topic_id,
    topic_name,
    created_at,
    expanded = false,
    votesCount = 0,
    isUpvoted = false,
}: PostCardProps) {
    const fetcher = useFetcher();
    const revalidator = useRevalidator();
    const postedAt = typeof created_at === 'string'
        ? DateTime.fromISO(created_at, { zone: "utc" }).setZone("Asia/Seoul").toRelative()
        : DateTime.fromJSDate(created_at).setZone("Asia/Seoul").toRelative();

    // Fetch가 완료되면 데이터를 다시 로드
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            revalidator.revalidate();
        }
    }, [fetcher.state, fetcher.data, revalidator]);

    return (
        <Card
            className={cn(
                "bg-transparent hover:bg-card/50 transition-colors",
                expanded ? "flex flex-row items-center justify-between" : ""
            )}
        >
            <Link to={`/community/${post_id}`} className="flex-1">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Avatar className="size-14">
                        <AvatarFallback>{author[0]}</AvatarFallback>
                        {authorAvatarUrl && <AvatarImage src={authorAvatarUrl} />}
                    </Avatar>
                    <div className="space-y-2 flex-1">
                        <CardTitle>{title}</CardTitle>
                        <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
                            <span>
                                {author} on {topic_name}
                            </span>
                            <DotIcon className="w-4 h-4" />
                            <span>{postedAt}</span>
                        </div>
                    </div>
                </CardHeader>
            </Link>
            {!expanded && (
                <Link to={`/community/${post_id}`}>
                    <CardFooter className="flex justify-end">
                        <Button variant="link">Reply &rarr;</Button>
                    </CardFooter>
                </Link>
            )}
            {expanded && (
                <CardFooter className="flex justify-end pb-0">
                    <fetcher.Form method="post" action={`/community/${post_id}/upvote`}>
                        <input type="hidden" name="post_id" value={post_id} />
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={fetcher.state !== "idle"}
                            className={cn(
                                "flex flex-col h-14",
                                isUpvoted ? "border-primary text-primary" : ""
                            )}
                        >
                            <ChevronUpIcon className="size-4 shrink-0" />
                            <span>{votesCount}</span>
                        </Button>
                    </fetcher.Form>
                </CardFooter>
            )}
        </Card>
    );
}