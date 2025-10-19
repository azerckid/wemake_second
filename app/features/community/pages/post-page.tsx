import type { Route } from "../../community/pages/+types/post-page";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Post | wemake" },
        { name: "description", content: "View community post" },
    ];
}

export default function PostPage() {
    return (
        <div>
            <h1>Post</h1>
        </div>
    );
}

