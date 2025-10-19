import type { Route } from "./+types/social-complete-page";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Social Login Complete | wemake" },
        { name: "description", content: "Complete social authentication" },
    ];
}

export default function SocialCompletePage() {
    return (
        <div>
            <h1>Social Complete</h1>
        </div>
    );
}

