import { Link } from "react-router";

import type { Route } from "./+types/home-page";

import { ProductCard } from "~/features/products/components/product-card";
import { PostCard } from "~/features/community/components/post-card";
import { IdeaCard } from "~/features/ideas/components/idea-card";
import { JobCard } from "~/features/jobs/components/job-card";
import { TeamCard } from "~/features/teams/components/team-card";
import { Button } from "../components/ui/button";
import { getProductsByDateRange } from "~/features/products/queries";
import { DateTime } from "luxon";
import { getPosts } from "~/features/community/queries";

export const loader = async () => {
    const products = await getProductsByDateRange({
        startDate: DateTime.now().startOf("day"),
        endDate: DateTime.now().endOf("day"),
        limit: 7,
    });
    const posts = await getPosts({
        limit: 7,
        sorting: "newest",
        period: "all",
    });
    return { products, posts };
};


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Home | WeMake Clone" },
        { name: "description", content: "Welcome to WeMake" }
    ];
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="space-y-40">
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-4xl font-bold leading-tight tracking-tight">
                        Today's Products
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        The best products made by our community today.
                    </p>
                    <Button variant="link" className="text-lg p-0" asChild>
                        <Link to="/products/leaderboards">
                            Explore All Products &rarr;
                        </Link>
                    </Button>
                </div>
                {loaderData.products.map((product) => (
                    <ProductCard
                        key={product.product_id.toString()}
                        id={product.product_id.toString()}
                        name={product.name}
                        description={product.description}
                        reviewsCount={product.reviews ?? 0}
                        viewsCount={product.views ?? 0}
                        votesCount={product.upvotes ?? 0}
                    />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-4xl font-bold leading-tight tracking-tight">
                        Latest Discussions
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        The latest discussions from our community.
                    </p>
                    <Button variant="link" className="text-lg p-0" asChild>
                        <Link to="/community">
                            Explore All Discussions &rarr;
                        </Link>
                    </Button>
                </div>
                {loaderData.posts.map((post) => (
                    <PostCard
                        key={post.post_id}
                        post_id={post.post_id}
                        title={post.title}
                        author={post.author}
                        authorAvatarUrl={post.author_avatar ?? null}
                        topic_id={0}
                        topic_name={post.topic}
                        created_at={post.created_at}
                        votesCount={post.upvotes}
                    />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h2 className="text-4xl font-bold leading-tight tracking-tight">
                        IdeasGPT
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        Find ideas for your next project.
                    </p>
                    <Button variant="link" className="text-lg p-0" asChild>
                        <Link to="/community">
                            Explore All ideas &rarr;
                        </Link>
                    </Button>
                </div>
                {Array.from({ length: 5 }).map((_, index) => (
                    <IdeaCard
                        key={`ideaId-${index}`}
                        gpt_idea_id={index + 1}
                        idea="A startup that creates an AI-powered generated personal trainer, delivering customized fitness recommendations and tracking of progress using a mobile app to track workouts and progress as well as a website to manage the business."
                        views={123}
                        created_at={new Date()}
                        likesCount={12}
                        claimed_at={index % 2 === 0 ? new Date() : null}
                        claimed_by={index % 2 === 0 ? "user123" : null}
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tight">
                        Latest Jobs
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        Find your dream job.
                    </p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/jobs">Explore all jobs &rarr;</Link>
                    </Button>
                </div>
                {Array.from({ length: 11 }).map((_, index) => (
                    <JobCard
                        key={`jobId-${index}`}
                        id={`jobId-${index}`}
                        company="OpenAI"
                        companyLogoUrl="https://github.com/openai.png"
                        companyHq="San Francisco, CA"
                        title="Senior Software Engineer"
                        postedAt="12 hours ago"
                        type="Full-time"
                        positionLocation="Remote"
                        salary="$100,000 - $120,000"
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tight">
                        Find a team mate
                    </h2>
                    <p className="text-xl font-light text-foreground">
                        Join a team looking for a new member.
                    </p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/teams">Explore all teams &rarr;</Link>
                    </Button>
                </div>
                {Array.from({ length: 7 }).map((_, index) => (
                    <TeamCard
                        key={`teamId-${index}`}
                        team_id={index + 1}
                        product_name={`Product ${index + 1}`}
                        team_size={3 + index}
                        equity_split={20 + index * 5}
                        product_stage="mvp"
                        roles="React Developer, Backend Developer, Product Manager"
                        product_description="a new social media platform"
                        created_at={new Date()}
                        leaderUsername="Azer.C"
                        leaderAvatarUrl="https://github.com/azerckid.png"
                    />
                ))}
            </div>
        </div>
    );
}
