import type { Route } from "./+types/profile-page";

export const meta: Route.MetaFunction = () => {
    return [{ title: "User Profile | wemake" }];
};

export default function ProfilePage() {
    return (
        <div className="container py-8">
            <h1 className="text-2xl font-semibold mb-6">Profile</h1>
            <div className="grid gap-6">
                {/* Public profile content will go here */}
            </div>
        </div>
    );
}

