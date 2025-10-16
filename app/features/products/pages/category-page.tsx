import type { Route } from "./+types/category-page";

export function loader({ request, params }: Route.LoaderArgs) {
    return {
        category: params.category,
        products: []
    };
}

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Category - ${params.category} | ProductHunt Clone` }
    ];
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    {loaderData.category}
                </h1>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Products in category: {loaderData.category}</p>
            </div>
        </div>
    );
}
