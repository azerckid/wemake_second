import type { Route } from "./+types/see-notification-page";
import { redirect } from "react-router";

import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "../queries";
import { seeNotification } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        throw new Response("Method not allowed", { status: 405 });
    }

    const { notificationId } = params;
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    await seeNotification(supabase, { userId, notificationId: Number(notificationId) });
    
    // fetcher를 사용하는 경우 리다이렉트가 필요 없지만, 
    // 직접 방문하는 경우를 대비해 리다이렉트 추가
    return redirect("/my/notifications");
};

