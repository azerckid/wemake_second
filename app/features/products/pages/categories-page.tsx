import type { Route } from "./+types/categories-page";

export function loader({ request }: Route.LoaderArgs) {
    return {
        categories: [],
    };
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Categories | ProductHunt Clone" },
        { name: "description", content: "Browse by category" }
    ];
}

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Categories
                </h1>
                <p className="text-xl font-light text-muted-foreground">
                    Browse by category
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Categories content coming soon...</p>
            </div>
        </div>
    );
}
