import { Link } from "react-router";

import type { Route } from "./+types/home-page";

import { DateTime } from "luxon";
import { Button } from "../components/ui/button";
import { getProductsByDateRange } from "~/features/products/queries";
import { ProductCard } from "~/features/products/components/product-card";
import { PostCard } from "~/features/community/components/post-card";
import { IdeaCard } from "~/features/ideas/components/idea-card";
import { TeamCard } from "~/features/teams/components/team-card";
import { JobCard } from "~/features/jobs/components/job-card";
import { getPosts } from "~/features/community/queries";
import { getGptIdeas } from "~/features/ideas/queries";
import { getTeams } from "~/features/teams/queries";
import { getJobs } from "~/features/jobs/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const products = await getProductsByDateRange(request, {
        startDate: DateTime.now().startOf("day"),
        endDate: DateTime.now().endOf("day"),
        limit: 7,
    });
    const posts = await getPosts(request, {
        limit: 7,
        sorting: "newest",
        period: "all",
    });
    const gptIdeas = await getGptIdeas(request, { limit: 5, page: 1 });
    const jobs = await getJobs(request, { limit: 5, page: 1, sorting: "newest" });
    const teamsResult = await getTeams(request, { limit: 7, page: 1 });
    const teams = teamsResult.teams;
    return { products, posts, gptIdeas, jobs, teams };
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
                        id={product.product_id}
                        name={product.name}
                        description={product.tagline}
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
                        <Link to="/ideas">
                            Explore All ideas &rarr;
                        </Link>
                    </Button>
                </div>
                {loaderData.gptIdeas.map((gptIdea) => (
                    <IdeaCard
                        key={gptIdea.gpt_idea_id}
                        gpt_idea_id={gptIdea.gpt_idea_id ?? 0}
                        idea={gptIdea.idea ?? ""}
                        views={gptIdea.views ?? 0}
                        created_at={gptIdea.created_at ? new Date(gptIdea.created_at) : new Date()}
                        likesCount={gptIdea.likes ?? 0}
                        claimed_at={gptIdea.is_claimed ? new Date(gptIdea.created_at ?? "") : null}
                        claimed_by={gptIdea.is_claimed ? "user-123" : null}
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
                {loaderData.jobs.map((job) => (
                    <JobCard
                        key={job.job_id}
                        id={job.job_id.toString()}
                        company={job.company_name}
                        companyLogoUrl={job.company_logo || null}
                        companyHq={job.company_location}
                        title={job.position}
                        postedAt={DateTime.fromISO(job.created_at).toRelative() ?? "Unknown"}
                        type={job.job_type}
                        positionLocation={job.location}
                        salary={job.salary_range}
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
                {loaderData.teams.map((team) => (
                    <TeamCard
                        key={team.team_id}
                        team_id={team.team_id}
                        product_name={team.product_name ?? ""}
                        team_size={team.team_size ?? 0}
                        equity_split={team.equity_split ?? 0}
                        product_stage={team.product_stage ?? ""}
                        roles={team.roles ?? ""}
                        product_description={team.product_description ?? ""}
                        created_at={team.created_at ? new Date(team.created_at) : new Date()}
                        leaderUsername={team.team_leader.username ?? ""}
                        leaderAvatarUrl={team.team_leader.avatar ?? ""}
                    />
                ))}
            </div>
        </div>
    );
}
