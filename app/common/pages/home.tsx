import { Link } from "react-router";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/home";
import { ProductCard } from "~/features/products/components/product-card";
import { PostCard } from "~/features/ community/components/post-card";

export function loader({ request }: Route.LoaderArgs) {
    return {
        title: "Welcome to WeMake",
        description: "Your creative workspace for building amazing things"
    };
}

export function action({ request }: Route.ActionArgs) {
    // Handle form submissions or other actions here
    return {};
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: data?.title || "WeMake" },
        { name: "description", content: data?.description || "Your creative workspace" }
    ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 space-y-40">
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
                {Array.from({ length: 10 }).map((_, index) => (
                    <ProductCard
                        id={`productId-${index}`}
                        name="Product Name"
                        description="Product Description"
                        commentsCount={12}
                        viewsCount={12}
                        votesCount={120}
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
                {Array.from({ length: 11 }).map((_, index) => (
                    <PostCard
                        id={`postId-${index}`}
                        title="What is the best productivity tool?"
                        author="Azer.C"
                        authorAvatarUrl="https://github.com/apple.png"
                        category="Productivity"
                        postedAt="12 hours ago"
                    />
                ))}
            </div>
        </div>
    );
}
