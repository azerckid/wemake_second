import { Link } from "react-router";
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";

interface TeamCardProps {
    team_id: number;
    product_name: string;
    team_size: number;
    equity_split: number;
    product_stage: string;
    roles: string;
    product_description: string;
    created_at: Date;
    leaderUsername: string;
    leaderAvatarUrl: string;
}

export function TeamCard({
    team_id,
    product_name,
    team_size,
    equity_split,
    product_stage,
    roles,
    product_description,
    created_at,
    leaderUsername,
    leaderAvatarUrl,
}: TeamCardProps) {
    const rolesArray = roles.split(',').map(role => role.trim());

    return (
        <Link to={`/teams/${team_id}`}>
            <Card className="bg-transparent hover:bg-card/50 transition-colors">
                <CardHeader className="flex flex-row items-center">
                    <CardTitle className="text-base leading-loose">
                        <Badge
                            variant={"secondary"}
                            className="inline-flex shadow-sm items-center text-base"
                        >
                            <span>@{leaderUsername}</span>
                            <Avatar className="size-5">
                                <AvatarFallback>{leaderUsername[0]}</AvatarFallback>
                                <AvatarImage src={leaderAvatarUrl} />
                            </Avatar>
                        </Badge>
                        <span> is looking for </span>
                        {rolesArray.map((position, index) => (
                            <Badge key={index} className="text-sm">
                                {position}
                            </Badge>
                        ))}
                        <span> to build </span>
                        <span>{product_description}</span>
                    </CardTitle>
                </CardHeader>
                <CardFooter className="justify-end">
                    <Button variant={"link"}>Join team &rarr;</Button>
                </CardFooter>
            </Card>
        </Link>
    );
}