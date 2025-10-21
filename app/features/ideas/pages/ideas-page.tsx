import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/ideas-page";
import { IdeaCard } from "../components/idea-card";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "IdeasGPT | wemake" },
        { name: "description", content: "Find ideas for your next project" },
    ];
};

export default function IdeasPage() {
    return (
        <div className="space-y-20">
            <Hero title="IdeasGPT" subtitle="Find ideas for your next project" />
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <IdeaCard
                        key={`gpt-idea-${index}`}
                        gpt_idea_id={index + 1}
                        idea="A startup that creates an AI-powered generated personal trainer, delivering customized fitness recommendations and tracking of progress using a mobile app to track workouts and progress as well as a website to manage the business."
                        views={123}
                        created_at={new Date()}
                        likesCount={12}
                        claimed_at={index % 2 === 0 ? new Date() : null}
                        claimed_by={index % 2 === 0 ? "user-123" : null}
                    />
                ))}
            </div>
        </div>
    );
}