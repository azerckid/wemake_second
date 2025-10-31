import { Form, redirect } from "react-router";

import type { Route } from "../../community/pages/+types/submit-post-page";

import { z } from "zod";
import { getTopics } from "../queries";
import { createPost } from "../mutations";
import { getLoggedInUserId } from "~/features/users/queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Button } from "~/common/components/ui/button";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Submit Post | wemake" },
        { name: "description", content: "Submit a new community post" },
    ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    await getLoggedInUserId(supabase);
    const topics = await getTopics(request);
    return { topics };
};

const formSchema = z.object({
    title: z.string().min(1).max(40),
    topic_id: z.coerce.number(),
    content: z.string().min(1).max(1000),
});

export const action = async ({ request }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();
    const { success, error, data } = formSchema.safeParse(
        Object.fromEntries(formData)
    );
    if (!success) {
        return {
            fieldErrors: error.flatten().fieldErrors,
        };
    }
    const { title, topic_id, content } = data;
    const { post_id } = await createPost(supabase, {
        title,
        topic_id,
        content,
        userId,
    });
    return redirect(`/community/${post_id}`);
};

export default function SubmitPostPage({
    loaderData,
    actionData,
}: Route.ComponentProps) {
    const { topics } = loaderData;
    const topicOptions = topics.map((topic) => ({
        label: topic.name,
        value: String(topic.topic_id),
    }));
    return (
        <div className="space-y-20">
            <Hero
                title="Create Discussion"
                subtitle="Ask questions, share ideas, and connect with other developers"
            />
            <Form className="flex flex-col gap-10 max-w-screen-md mx-auto" method="post">
                <InputPair
                    label="Title"
                    name="title"
                    id="title"
                    description="(40 characters or less)"
                    required
                    placeholder="i.e What is the best productivity tool?"
                />
                {actionData && "fieldErrors" in actionData && (
                    <div className="text-red-500">
                        {actionData.fieldErrors.title?.join(", ")}
                    </div>
                )}
                <SelectPair
                    required
                    name="topic_id"
                    label="Topic"
                    description="Select the topic that best fits your discussion"
                    placeholder="i.e Productivity"
                    options={topicOptions}
                />
                {actionData && "fieldErrors" in actionData && (
                    <div className="text-red-500">
                        {actionData.fieldErrors.topic_id?.join(", ")}
                    </div>
                )}
                <InputPair
                    label="Content"
                    name="content"
                    id="content"
                    description="(1000 characters or less)"
                    required
                    placeholder="i.e I'm looking for a tool that can help me manage my time and tasks. What are the best tools out there?"
                    textArea
                />
                {actionData && "fieldErrors" in actionData && (
                    <div className="text-red-500">
                        {actionData.fieldErrors.content?.join(", ")}
                    </div>
                )}
                <Button className="mx-auto">Create Discussion</Button>
            </Form>
        </div>
    );
}

