import type { Route } from "./+types/profile-posts-page";

import { PostCard } from "~/features/community/components/post-card";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Posts | wemake" }];
};

export default function ProfilePostsPage({ params }: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
                <PostCard
                    key={`postId-${index}`}
                    id={`postId-${index}`}
                    title="What is the best productivity tool?"
                    author="Azer.C"
                    authorAvatarUrl="https://github.com/apple.png"
                    category="Productivity"
                    postedAt="12 hours ago"
                    expanded
                />
            ))}
        </div>
    );
}