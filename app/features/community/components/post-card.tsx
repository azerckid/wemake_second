import { Link } from "react-router";
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
}: PostCardProps) {
    const postedAt = typeof created_at === 'string'
        ? DateTime.fromISO(created_at).toLocaleString(DateTime.DATE_MED)
        : DateTime.fromJSDate(created_at).toLocaleString(DateTime.DATE_MED);
    return (
        <Link to={`/community/${post_id}`} className="block">
            <Card
                className={cn(
                    "bg-transparent hover:bg-card/50 transition-colors",
                    expanded ? "flex flex-row items-center justify-between" : ""
                )}
            >
                <CardHeader className="flex flex-row items-center gap-2 flex-1">
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
                {!expanded && (
                    <CardFooter className="flex justify-end">
                        <Button variant="link">Reply &rarr;</Button>
                    </CardFooter>
                )}
                {expanded && (
                    <CardFooter className="flex justify-end  pb-0">
                        <Button variant="outline" className="flex flex-col h-14">
                            <ChevronUpIcon className="size-4 shrink-0" />
                            <span>{votesCount}</span>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </Link>
    );
}