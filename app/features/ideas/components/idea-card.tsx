import { Link } from "react-router";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Badge } from "~/common/components/ui/badge";
import { DotIcon, EyeIcon, HeartIcon, LockIcon, CheckCircleIcon, UserIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DateTime } from "luxon";

interface IdeaCardProps {
    gpt_idea_id: number;
    idea: string;
    views: number;
    created_at: Date;
    likesCount: number;
    claimed_at: Date | null;
    claimed_by: string | null;
    isClaimedByCurrentUser?: boolean; // 현재 사용자가 클레임했는지 여부
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
}: IdeaCardProps) {
    const claimed = claimed_at !== null && claimed_by !== null;

    return (
        <Card className={cn(
            "bg-transparent hover:bg-card/50 transition-colors",
            isClaimedByCurrentUser && "ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20"
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
                    {isClaimedByCurrentUser && (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Claimed by You
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex items-center text-sm">
                <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{views}</span>
                </div>
                <DotIcon className="w-4 h-4" />
                <span>{DateTime.fromJSDate(created_at).setZone("Asia/Seoul").toRelative()}</span>
                {claimed_at && (
                    <>
                        <DotIcon className="w-4 h-4" />
                        <span className="text-green-600 dark:text-green-400">
                            Claimed {DateTime.fromJSDate(claimed_at).setZone("Asia/Seoul").toRelative()}
                        </span>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button variant="outline">
                    <HeartIcon className="w-4 h-4" />
                    <span>{likesCount}</span>
                </Button>
                {!claimed ? (
                    <Button asChild>
                        <Link to={`/ideas/${gpt_idea_id}/claim`}>Claim idea now &rarr;</Link>
                    </Button>
                ) : isClaimedByCurrentUser ? (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <UserIcon className="w-4 h-4 mr-1" />
                            Manage
                        </Button>
                        <Button variant="outline" size="sm">
                            View Details
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" disabled className="cursor-not-allowed">
                        <LockIcon className="size-4" />
                        Claimed by Others
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}