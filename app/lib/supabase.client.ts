import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createSupabaseBrowserClient() {
    // 이미 생성된 클라이언트가 있으면 재사용
    if (client) {
        return client;
    }

    // 브라우저 환경 체크
    if (typeof window === "undefined") {
        throw new Error("createSupabaseBrowserClient can only be called in the browser");
    }

    // ENV 변수 체크
    if (!window.ENV?.SUPABASE_URL || !window.ENV?.SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
    }

    client = createBrowserClient<Database>(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
    );

    return client;
}

// 전역 타입 선언
declare global {
    interface Window {
        ENV: {
            SUPABASE_URL: string;
            SUPABASE_ANON_KEY: string;
        };
    }
}

