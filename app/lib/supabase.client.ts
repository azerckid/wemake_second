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

    // 환경 변수 가져오기 (Vite의 import.meta.env 사용)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
    }

    client = createBrowserClient<Database>(
        supabaseUrl,
        supabaseAnonKey
    );

    return client;
}

