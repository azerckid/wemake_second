import type { Route } from "./+types/promote-page";

export function loader({ request }: Route.LoaderArgs) {
    return {
        promotionOptions: []
    };
}

export function action({ request }: Route.ActionArgs) {
    // Handle form submission here
    return {};
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Promote Product | ProductHunt Clone" },
        { name: "description", content: "Promote a product" }
    ];
}

export default function PromotePage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    {loaderData.promotionOptions.length} promotion options
                </h1>
                <p className="text-xl font-light text-muted-foreground">
                    Promote a product to your community
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Product promotion form coming soon...</p>
            </div>
        </div>
    );
}
