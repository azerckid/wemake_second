import type { Route } from "./+types/notifications-page";

import { DateTime } from "luxon";
import { getLoggedInUserId, getNotifications } from "../queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { NotificationCard } from "~/features/users/components/notification-card";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Notifications | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    await getLoggedInUserId(supabase); // 로그인 여부 확인
    const notifications = await getNotifications(request);
    return { notifications };
};

export default function NotificationsPage({ loaderData }: Route.ComponentProps) {
    const { notifications } = loaderData;

    return (
        <div className="space-y-20 ">
            <h1 className="text-4xl font-bold">Notifications</h1>
            {notifications.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No notifications yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-5">
                    {notifications.map((notification) => {
                        const sourceProfile = notification.source_profile;
                        const userName = sourceProfile?.name || "Someone";
                        const avatarUrl = sourceProfile?.avatar || "";
                        const avatarFallback = userName.charAt(0).toUpperCase();
                        const relativeTime = DateTime.fromISO(notification.created_at, {
                            zone: "utc",
                        })
                            .setZone("Asia/Seoul")
                            .toRelative();

                        return (
                            <NotificationCard
                                key={notification.notification_id}
                                id={notification.notification_id}
                                avatarUrl={avatarUrl}
                                avatarFallback={avatarFallback}
                                userName={userName}
                                type={notification.type}
                                timestamp={relativeTime || ""}
                                seen={notification.seen}
                                productName={notification.product_name || undefined}
                                postTitle={notification.post_title || undefined}
                                payloadId={
                                    notification.product_id || notification.post_id || undefined
                                }
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
