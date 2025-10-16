import type { Route } from "./+types/search-page";

export function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    return {
        query,
        results: [], // Add search logic
    };
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Search Products | ProductHunt Clone" },
        { name: "description", content: "Search for products" },
    ];
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    {loaderData.query}
                </h1>
                <p className="text-xl font-light text-muted-foreground">
                    Search for products
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Search functionality coming soon...</p>
            </div>
        </div>
    );
}
