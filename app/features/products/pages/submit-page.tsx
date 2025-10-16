import type { Route } from "./+types/submit-page";

export function loader({ request }: Route.LoaderArgs) {
    return {};
}

export function action({ request }: Route.ActionArgs) {
    // Handle form submission here
    return {};
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Submit Product | ProductHunt Clone" },
        { name: "description", content: "Submit your product" },
    ];
}

export default function SubmitPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-20 py-16">
            <div className="mb-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Submit a Product
                </h1>
                <p className="text-xl font-light text-muted-foreground">
                    Submit your product to our community
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">Product submission form coming soon...</p>
            </div>
        </div>
    );
}
