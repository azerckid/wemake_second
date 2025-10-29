import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
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

export async function getSession(request: Request) {
    const { supabase } = createSupabaseServerClient(request);

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return null;
    }

    return session;
}

export async function getUser(request: Request) {
    const { supabase } = createSupabaseServerClient(request);

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        console.error("User error:", error);
        return null;
    }

    return user;
}

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
        console.error("Profile error:", error);
        return null;
    }

    return profile;
}

export async function requireAuth(request: Request) {
    const user = await getUser(request);

    if (!user) {
        throw new Response("Unauthorized", { status: 401 });
    }

    return user;
}

export async function requireProfile(request: Request) {
    const profile = await getUserProfile(request);

    if (!profile) {
        throw new Response("Unauthorized", { status: 401 });
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
