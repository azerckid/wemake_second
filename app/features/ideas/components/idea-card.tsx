import { Link } from "react-router";
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
    created_at: Date;
    likesCount: number;
    claimed_at: Date | null;
    claimed_by: string | null;
}

export function IdeaCard({
    gpt_idea_id,
    idea,
    views,
    created_at,
    likesCount,
    claimed_at,
    claimed_by,
}: IdeaCardProps) {
    const claimed = claimed_at !== null && claimed_by !== null;
    return (
        <Card className="bg-transparent hover:bg-card/50 transition-colors">
            <CardHeader>
                <Link to={`/ideas/${gpt_idea_id}`}>
                    <CardTitle className="text-xl">
                        <span
                            className={cn(
                                claimed
                                    ? "bg-muted-foreground selection:bg-muted-foreground text-muted-foreground"
                                    : ""
                            )}
                        >
                            {idea}
                        </span>
                    </CardTitle>
                </Link>
            </CardHeader>
            <CardContent className="flex items-center text-sm">
                <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{views}</span>
                </div>
                <DotIcon className="w-4 h-4" />
                <span>{DateTime.fromJSDate(created_at).toRelative()}</span>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">
                    <HeartIcon className="w-4 h-4" />
                    <span>{likesCount}</span>
                </Button>
                {!claimed ? (
                    <Button asChild>
                        <Link to={`/ideas/${gpt_idea_id}/claim`}>Claim idea now &rarr;</Link>
                    </Button>
                ) : (
                    <Button variant="outline" disabled className="cursor-not-allowed">
                        <LockIcon className="size-4" />
                        Claimed
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}