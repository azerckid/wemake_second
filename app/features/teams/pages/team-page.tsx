import { Form, redirect, useNavigation } from "react-router";

import type { Route } from "./+types/team-page";

import { z } from "zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { getTeamById } from "../queries";
import { applyToTeam } from "../mutations";
import { getLoggedInUserId } from "~/features/users/queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { Hero } from "~/common/components/hero";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/common/components/ui/card";
import { Alert, AlertDescription } from "~/common/components/ui/alert";


export const meta: Route.MetaFunction = () => [
    { title: "Team Details | wemake" },
];

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const success = url.searchParams.get("success") === "true";
    const team = await getTeamById(request, params.teamId);
    return { team, success };
};

const applicationSchema = z.object({
    introduction: z.string().min(1, "Introduction cannot be empty").max(500, "Introduction must be 500 characters or less"),
    role: z.string().optional(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const teamId = Number(params.teamId);

    if (isNaN(teamId)) {
        throw new Response("Invalid team ID", { status: 400 });
    }

    const formData = await request.formData();
    const { success, error, data } = applicationSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!success) {
        return {
            fieldErrors: error.flatten().fieldErrors,
        };
    }

    await applyToTeam(supabase, {
        team_id: teamId,
        user_id: userId,
        role: data.role || data.introduction.split(' ')[0] || "member", // Extract role from introduction if not provided
        introduction: data.introduction,
    });

    // 최소 0.5초 대기
    await new Promise(resolve => setTimeout(resolve, 500));

    return redirect(`/teams/${teamId}?success=true`);
};

export default function TeamPage({ loaderData, actionData }: Route.ComponentProps) {
    // 실제로는 loader에서 데이터를 가져와야 함
    const teamData = loaderData.team;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

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
                        <div className="flex flex-col items-start">
                            <h4 className="text-lg font-medium">{teamData.team_leader.name}</h4>
                            <Badge variant="secondary">{teamData.team_leader.role}</Badge>
                        </div>
                    </div>
                    {loaderData.success && (
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>제출완료</AlertDescription>
                        </Alert>
                    )}
                    <Form
                        className="space-y-5"
                        method="post"
                        action={`/users/${teamData.team_leader.username}/messages`}
                    >
                        <InputPair
                            label="Introduce yourself"
                            description="Tell us about yourself"
                            name="content"
                            type="text"
                            id="introduction"
                            required
                            textArea
                            placeholder={`i.e. I'm a ${teamData.roles?.split(',').map((role: string) => role.trim())[0] || 'developer'} with experience`}
                        />
                        {actionData && "fieldErrors" in actionData && actionData.fieldErrors?.introduction && (
                            <div className="text-red-500 text-sm">
                                {actionData.fieldErrors.introduction.join(", ")}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Get in touch"
                            )}
                        </Button>
                    </Form>
                </aside>
            </div>
        </div>
    );
}
