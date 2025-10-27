import type { Route } from "./+types/profile-posts-page";

import { PostCard } from "~/features/community/components/post-card";
import { getUserPosts } from "../queries";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Posts | wemake" }];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
    const posts = await getUserPosts(params.username);
    return { posts };
};

export default function ProfilePostsPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-5">
            {loaderData.posts.length === 0 ? (
                <p className="text-muted-foreground">No posts yet.</p>
            ) : (
                loaderData.posts.map((post) => (
                    <PostCard
                        key={post.post_id}
                        post_id={post.post_id}
                        title={post.title}
                        author={post.profiles?.username || "Unknown"}
                        authorAvatarUrl={post.profiles?.avatar || null}
                        topic_id={post.topic_id || 0}
                        topic_name={post.topics?.name || "General"}
                        created_at={post.created_at}
                        expanded
                        votesCount={post.upvotes || 0}
                    />
                ))
            )}
        </div>
    );
}