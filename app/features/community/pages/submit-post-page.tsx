import { Form } from "react-router";

import type { Route } from "../../community/pages/+types/submit-post-page";

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

export default function SubmitPostPage() {
    return (
        <div className="space-y-20">
            <Hero
                title="Create Discussion"
                subtitle="Ask questions, share ideas, and connect with other developers"
            />
            <Form className="flex flex-col gap-10 max-w-screen-md mx-auto">
                <InputPair
                    label="Title"
                    name="title"
                    id="title"
                    description="(40 characters or less)"
                    required
                    placeholder="i.e What is the best productivity tool?"
                />
                <SelectPair
                    required
                    name="topic_id"
                    label="Topic"
                    description="Select the topic that best fits your discussion"
                    placeholder="i.e Productivity"
                    options={[
                        { label: "Productivity", value: "1" },
                        { label: "Programming", value: "2" },
                        { label: "Design", value: "3" },
                    ]}
                />
                <InputPair
                    label="Content"
                    name="content"
                    id="content"
                    description="(1000 characters or less)"
                    required
                    placeholder="i.e I'm looking for a tool that can help me manage my time and tasks. What are the best tools out there?"
                    textArea
                />
                <Button className="mx-auto">Create Discussion</Button>
            </Form>
        </div>
    );
}

