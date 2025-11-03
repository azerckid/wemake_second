import { Link, useFetcher, useRevalidator } from "react-router";
import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { DotIcon, EyeIcon, HeartIcon, LockIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";

interface IdeaCardProps {
    gpt_idea_id: number;
    idea: string;
    views: number;
    created_at: Date | string;
    likesCount: number;
    claimed_at: Date | string | null;
    claimed_by: string | null;
    isClaimedByCurrentUser?: boolean; // 현재 사용자가 클레임했는지 여부
    isLiked?: boolean;
}

export function IdeaCard({
    gpt_idea_id,
    idea,
    views,
    created_at,
    likesCount,
    claimed_at,
    claimed_by,
    isClaimedByCurrentUser = false,
    isLiked = false,
}: IdeaCardProps) {
    const claimed = claimed_at !== null && claimed_by !== null;
    const fetcher = useFetcher();
    const revalidator = useRevalidator();

    // Fetch가 완료되면 데이터를 다시 로드
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            revalidator.revalidate();
        }
    }, [fetcher.state, fetcher.data, revalidator]);

    return (
        <Card className={cn(
            "bg-transparent hover:bg-card/50 transition-colors",
            isClaimedByCurrentUser && "ring-2 ring-green-500/20"
        )}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <Link to={`/ideas/${gpt_idea_id}`}>
                        <CardTitle className="text-xl">
                            <span
                                className={cn(
                                    claimed && !isClaimedByCurrentUser
                                        ? "bg-muted-foreground selection:bg-muted-foreground text-muted-foreground"
                                        : ""
                                )}
                            >
                                {idea}
                            </span>
                        </CardTitle>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="flex items-center text-sm">
                <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{views}</span>
                </div>
                <DotIcon className="w-4 h-4" />
                <span>{DateTime.fromISO(typeof created_at === "string" ? created_at : created_at.toISOString(), { zone: "utc" }).setZone("Asia/Seoul").toRelative()}</span>
                {claimed_at && (
                    <>
                        <DotIcon className="w-4 h-4" />
                        <span className="text-green-600 dark:text-green-400">
                            Claimed {DateTime.fromISO(typeof claimed_at === "string" ? claimed_at : claimed_at.toISOString(), { zone: "utc" }).setZone("Asia/Seoul").toRelative()}
                        </span>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                {!claimed ? (
                    <fetcher.Form method="post" action={`/ideas/${gpt_idea_id}/like`}>
                        <input type="hidden" name="idea_id" value={gpt_idea_id} />
                        <Button 
                            type="submit" 
                            variant="outline" 
                            disabled={fetcher.state !== "idle"}
                            className={cn(isLiked && "border-red-500 text-red-500")}
                        >
                            <HeartIcon className={cn("w-4 h-4", isLiked && "fill-current")} />
                            <span>{likesCount}</span>
                        </Button>
                    </fetcher.Form>
                ) : (
                    <Button variant="outline" disabled>
                        <HeartIcon className="w-4 h-4" />
                        <span>{likesCount}</span>
                    </Button>
                )}
                {!claimed ? (
                    <Button asChild>
                        <Link to={`/ideas/${gpt_idea_id}`}>Claim idea now &rarr;</Link>
                    </Button>
                ) : (
                    <Button variant="outline" disabled className="cursor-not-allowed">
                        <LockIcon className="size-4" />
                        {isClaimedByCurrentUser ? "Claimed by You" : "Claimed by Others"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}