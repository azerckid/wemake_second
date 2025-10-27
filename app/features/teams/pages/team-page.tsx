import { Form } from "react-router";

import type { Route } from "./+types/team-page";

import { getTeamById } from "../queries";
import { Hero } from "~/common/components/hero";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/common/components/ui/card";


export const meta: Route.MetaFunction = () => [
    { title: "Team Details | wemake" },
];

export const loader = async ({ params }: Route.LoaderArgs) => {
    const team = await getTeamById(params.teamId);
    return { team };
};

export default function TeamPage({ loaderData }: Route.ComponentProps) {
    // 실제로는 loader에서 데이터를 가져와야 함
    const teamData = loaderData.team;

    const rolesArray = teamData.roles?.split(',').map(role => role.trim()) || [];

    return (
        <div className="space-y-20">
            <Hero title={`Join ${teamData.team_leader.name}'s team`} />
            <div className="grid grid-cols-6 gap-40 items-start">
                <div className="col-span-4 grid grid-cols-4 gap-5">
                    {[
                        {
                            title: "Product name",
                            value: teamData.product_name || "",
                        },
                        {
                            title: "Stage",
                            value: teamData.product_stage?.toUpperCase() || "",
                        },
                        {
                            title: "Team size",
                            value: teamData.team_size || 0,
                        },
                        {
                            title: "Available equity",
                            value: teamData.equity_split || 0,
                        },
                    ].map((item, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.title}
                                </CardTitle>
                                <CardContent className="p-0 font-bold text-2xl">
                                    <p>{item.value}</p>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    ))}
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Looking for
                            </CardTitle>
                            <CardContent className="p-0 font-bold text-2xl">
                                <ul className="text-lg list-disc list-inside">
                                    {rolesArray.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </CardHeader>
                    </Card>
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Idea description
                            </CardTitle>
                            <CardContent className="p-0 font-medium text-xl">
                                <p>
                                    {teamData.product_description || ""}
                                </p>
                            </CardContent>
                        </CardHeader>
                    </Card>
                </div>
                <aside className="col-span-2 space-y-5 border rounded-lg p-6 shadow-sm">
                    <div className="flex gap-5">
                        <Avatar className="size-14">
                            <AvatarFallback>{teamData.team_leader.name[0]}</AvatarFallback>
                            {teamData.team_leader.avatar && <AvatarImage src={teamData.team_leader.avatar} />}
                        </Avatar>
                        <div className="flex flex-col">
                            <h4 className="text-lg font-medium">{teamData.team_leader.name}</h4>
                            <Badge variant="secondary">{teamData.team_leader.role}</Badge>
                        </div>
                    </div>
                    <Form className="space-y-5">
                        <InputPair
                            label="Introduce yourself"
                            description="Tell us about yourself"
                            name="introduction"
                            type="text"
                            id="introduction"
                            required
                            textArea
                            placeholder={`i.e. I'm a ${teamData.roles?.split(',').map(role => role.trim())[0]} with ${teamData.team_size} years of experience`}
                        />
                        <Button type="submit" className="w-full">
                            Get in touch
                        </Button>
                    </Form>
                </aside>
            </div>
        </div>
    );
}
