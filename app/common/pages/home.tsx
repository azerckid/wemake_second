import type { Route } from "./+types/home";

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
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center space-y-8">
                    <h1 className="text-4xl font-bold text-foreground">
                        {loaderData.title}
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {loaderData.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/docs"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </a>

                        <a
                            href="/learn"
                            className="inline-flex items-center justify-center px-6 py-3 border border-border text-base font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
