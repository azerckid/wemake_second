import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import type { Database } from "database.types";

export function createSupabaseServerClient(request: Request) {
    if (!request || !request.headers) {
        throw new Error("Invalid request object: request.headers is undefined");
    }

    const headers = new Headers();

    const supabase = createServerClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    // supabase에게 user의 쿠키를 전달하기 위해서는 쿠키를 파싱해야 함
                    const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
                    return cookies.filter((cookie): cookie is { name: string; value: string } =>
                        cookie.value !== undefined
                    );
                },
                setAll(cookiesToSet) {
                    // cookiesToSet is an array of objects with name, value, and options
                    // supabase가 쿠키를 설정할 수 있도록 해줘야 함
                    // supabase에게 쿠키를 전달하기 위해서는 쿠키를 직렬화해야 함
                    // serializeCookieHeader는 쿠키를 직렬화하는 함수
                    cookiesToSet.forEach(({ name, value, options }) => {
                        headers.append(
                            "Set-Cookie",
                            serializeCookieHeader(name, value, options)
                        );
                    });
                },
            },
        }
    );

    return { supabase, headers };
}

/**
 * 세션을 가져옵니다.
 * Refresh Token이 없는 경우(만료된 세션)는 정상적인 상황으로 처리합니다.
 */
export async function getSession(request: Request) {
    const { supabase } = createSupabaseServerClient(request);

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) {
        // Refresh Token이 없는 경우는 정상적인 만료 상황으로 처리
        const isRefreshTokenNotFound =
            error.code === 'refresh_token_not_found' ||
            error.message?.includes('Refresh Token Not Found');

        // 개발 환경에서만 상세 로그 출력
        if (process.env.NODE_ENV === 'development' && !isRefreshTokenNotFound) {
            console.error("Session error:", error);
        }

        return null;
    }

    return session;
}

/**
 * 현재 로그인한 사용자를 가져옵니다.
 * Refresh Token이 없는 경우(만료된 세션)는 정상적인 상황으로 처리합니다.
 */
export async function getUser(request: Request) {
    const { supabase } = createSupabaseServerClient(request);

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        // Refresh Token이 없는 경우는 정상적인 만료 상황으로 처리
        const isRefreshTokenNotFound =
            error.code === 'refresh_token_not_found' ||
            error.message?.includes('Refresh Token Not Found');

        // 개발 환경에서만 상세 로그 출력
        if (process.env.NODE_ENV === 'development' && !isRefreshTokenNotFound) {
            console.error("User error:", error);
        }

        return null;
    }

    return user;
}

/**
 * 현재 로그인한 사용자의 프로필을 가져옵니다.
 */
export async function getUserProfile(request: Request) {
    const user = await getUser(request);

    if (!user) {
        return null;
    }

    const { supabase } = createSupabaseServerClient(request);

    // profile_id is the same as auth.users.id
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("profile_id" as any, user.id)
        .single();

    if (error) {
        // 개발 환경에서만 상세 로그 출력
        if (process.env.NODE_ENV === 'development') {
            console.error("Profile error:", error);
        }
        return null;
    }

    return profile;
}

/**
 * 인증이 필요한 페이지에서 사용합니다.
 * 사용자가 로그인하지 않았거나 세션이 만료된 경우 로그인 페이지로 리다이렉트합니다.
 */
export async function requireAuth(request: Request) {
    const user = await getUser(request);

    if (!user) {
        const url = new URL(request.url);
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(url.pathname + url.search)}`;
        throw redirect(loginUrl);
    }

    return user;
}

/**
 * 프로필이 필요한 페이지에서 사용합니다.
 * 사용자가 로그인하지 않았거나 세션이 만료된 경우 로그인 페이지로 리다이렉트합니다.
 */
export async function requireProfile(request: Request) {
    const profile = await getUserProfile(request);

    if (!profile) {
        const url = new URL(request.url);
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(url.pathname + url.search)}`;
        throw redirect(loginUrl);
    }

    return profile;
}

// export async function getUserByID(request: Request, id: string) {
//     const { supabase } = createSupabaseServerClient(request);
//     const { data: user, error } = await supabase.auth.getUser(id);
//     if (error) {
//         console.error("User error:", error);
//         return null;
//     }
//     return user;
// }

/**
 * 서버 사이드에서만 사용 가능한 관리자 클라이언트입니다.
 * RLS(Row Level Security)를 우회하여 데이터베이스에 접근할 수 있습니다.
 * 
 * ⚠️ 주의사항:
 * - 절대 브라우저에 노출되지 않도록 주의하세요
 * - 신뢰할 수 있는 서버 사이드 코드에서만 사용하세요
 * - SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다
 */
export function createAdminClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 디버깅을 위한 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Environment variables check:');
        console.log('SUPABASE_URL:', supabaseUrl ? `✅ Set (length: ${supabaseUrl.length})` : '❌ Missing');
        console.log('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? `✅ Set (length: ${serviceRoleKey.length})` : '❌ Missing');
        if (serviceRoleKey) {
            console.log('Service Role Key prefix:', serviceRoleKey.substring(0, 30) + '...');
        }
    }

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
        );
    }

    // 키에서 앞뒤 공백과 줄바꿈 제거
    const cleanedKey = serviceRoleKey.trim();

    return createClient<Database>(supabaseUrl, cleanedKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
