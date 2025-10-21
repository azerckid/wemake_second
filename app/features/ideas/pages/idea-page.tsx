import { DotIcon, HeartIcon } from "lucide-react";
import { EyeIcon } from "lucide-react";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";

export const meta = () => {
    return [
        { title: `IdeasGPT | wemake` },
        { name: "description", content: "Find ideas for your next project" },
    ];
};

export default function IdeaPage() {
    // 실제로는 loader에서 데이터를 가져와야 함
    const ideaData = {
        gpt_idea_id: 1212122,
        idea: "A startup that creates an AI-powered generated personal trainer, delivering customized fitness recommendations and tracking of progress using a mobile app to track workouts and progress as well as a website to manage the business.",
        views: 123,
        created_at: new Date(),
        claimed_at: null,
        claimed_by: null,
    };

    const claimed = ideaData.claimed_at !== null && ideaData.claimed_by !== null;
    const postedAt = new Date(ideaData.created_at).toLocaleDateString();

    return (
        <div className="">
            <Hero title={`Idea #${ideaData.gpt_idea_id}`} />
            <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-10">
                <p className="italic text-center">
                    "{ideaData.idea}"
                </p>
                <div className="flex items-center text-sm">
                    <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{ideaData.views}</span>
                    </div>
                    <DotIcon className="w-4 h-4" />
                    <span>{postedAt}</span>
                    <DotIcon className="w-4 h-4" />
                    <Button variant="outline">
                        <HeartIcon className="w-4 h-4" />
                        <span>12</span>
                    </Button>
                </div>
                {!claimed ? (
                    <Button size="lg">Claim idea now &rarr;</Button>
                ) : (
                    <Button size="lg" variant="outline" disabled className="cursor-not-allowed">
                        Already Claimed
                    </Button>
                )}
            </div>
        </div>
    );
}