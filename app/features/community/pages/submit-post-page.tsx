import type { Route } from "../../community/pages/+types/submit-post-page";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Submit Post | wemake" },
        { name: "description", content: "Submit a new community post" },
    ];
}

export default function SubmitPostPage() {
    return (
        <div>
            <h1>Submit Post</h1>
        </div>
    );
}

