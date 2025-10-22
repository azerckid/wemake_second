import type { Route } from "./+types/notifications-page";

import { NotificationCard } from "~/features/users/components/notification-card";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Notifications | wemake" }];
};

export default function NotificationsPage() {
    return (
        <div className="space-y-20">
            <h1 className="text-4xl font-bold">Notifications</h1>
            <div className="flex flex-col items-start gap-5">
                <NotificationCard
                    avatarUrl="https://github.com/bluesky.png"
                    avatarFallback="B"
                    userName="Bluesky"
                    message=" liked your post."
                    created_at="1 day ago"
                    seen={false}
                />
            </div>
        </div>
    );
}
