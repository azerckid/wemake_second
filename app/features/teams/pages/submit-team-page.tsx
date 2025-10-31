import { Form, redirect } from "react-router";

import type { Route } from "./+types/submit-team-page";

import { z } from "zod";
import { PRODUCT_STAGES } from "../constants";
import { getLoggedInUserId } from "~/features/users/queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { createTeam } from "../mutations";

export const meta: Route.MetaFunction = () => [
    { title: "Create Team | wemake" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    await getLoggedInUserId(supabase);
};

export const formSchema = z.object({
    name: z.string().min(1).max(20),
    stage: z.string(),
    size: z.coerce.number().min(1).max(100),
    equity: z.coerce.number().min(1).max(100),
    roles: z.string(),
    description: z.string().min(1).max(200),
});

export const action = async ({ request }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();
    const { success, data, error } = formSchema.safeParse(
        Object.fromEntries(formData)
    );
    if (!success) {
        return { fieldErrors: error.flatten().fieldErrors };
    }
    const { team_id } = await createTeam(supabase, userId, {
        ...data,
    });
    return redirect(`/teams/${team_id}`);
};

export default function SubmitTeamPage({ actionData }: Route.ComponentProps) {
    return (
        <div className="space-y-20">
            <Hero title="Create Team" subtitle="Create a team to find a team mate." />
            <Form className="max-w-screen-2xl flex flex-col items-center gap-10 mx-auto" method="post">
                <div className="grid grid-cols-3 w-full gap-10">
                    <InputPair
                        label="What is the name of your product?"
                        description="(20 characters max)"
                        placeholder="i.e Doggy Social"
                        name="name"
                        maxLength={20}
                        type="text"
                        id="name"
                        required
                    />
                    {actionData && "fieldErrors" in actionData && (
                        <div className="text-red-500">
                            {actionData.fieldErrors.name?.join(", ")}
                        </div>
                    )}
                    <SelectPair
                        label="What is the stage of your product?"
                        description="Select the stage of your product"
                        name="stage"
                        required
                        placeholder="Select the stage of your product"
                        options={PRODUCT_STAGES}
                    />
                    {actionData && "fieldErrors" in actionData && (
                        <div className="text-red-500">
                            {actionData.fieldErrors.stage?.join(", ")}
                        </div>
                    )}
                    <InputPair
                        label="What is the size of your team?"
                        description="(1-100)"
                        name="size"
                        max={100}
                        min={1}
                        type="number"
                        id="size"
                        required
                    />
                    {actionData && "fieldErrors" in actionData && (
                        <div className="text-red-500">
                            {actionData.fieldErrors.size?.join(", ")}
                        </div>
                    )}
                    <InputPair
                        label="How much equity are you willing to give?"
                        description="(each)"
                        name="equity"
                        max={100}
                        min={1}
                        type="number"
                        id="equity"
                        required
                    />
                    {actionData && "fieldErrors" in actionData && (
                        <div className="text-red-500">
                            {actionData.fieldErrors.equity?.join(", ")}
                        </div>
                    )}
                    <InputPair
                        label="What roles are you looking for?"
                        placeholder="React Developer, Backend Developer, Product Manager"
                        description="(comma separated)"
                        name="roles"
                        type="text"
                        id="roles_text"
                        required
                    />
                    {actionData && "fieldErrors" in actionData && (
                        <div className="text-red-500">
                            {actionData.fieldErrors.roles?.join(", ")}
                        </div>
                    )}
                    <InputPair
                        label="What is the description of your product?"
                        description="(200 characters max)"
                        placeholder="i.e We are building a new social media platform for dogs to connect with each other"
                        name="description"
                        maxLength={200}
                        type="text"
                        id="description"
                        required
                        textArea
                    />
                    {actionData && "fieldErrors" in actionData && (
                        <div className="text-red-500">
                            {actionData.fieldErrors.description?.join(", ")}
                        </div>
                    )}
                </div>
                <Button type="submit" className="w-full max-w-sm" size="lg">
                    Create team
                </Button>
            </Form>
        </div>
    );
}