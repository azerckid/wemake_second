import type { Database } from "database.types";

interface SupabaseClientLike {
    from: (table: string) => any;
    auth: {
        getUser: () => Promise<{ data: { user: any | null }; error: any | null }>;
    };
}

function toSlug(input: string) {
    const base = (input || "user").toLowerCase();
    return base
        .replace(/[^a-z0-9-_\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 30) || "user";
}

function extractProviderFields(user: any) {
    const primaryIdentity = (user?.identities ?? []).find(Boolean) as
        | { provider?: string; identity_data?: Record<string, unknown> }
        | undefined;
    const identityData = (primaryIdentity?.identity_data ?? {}) as Record<string, unknown>;
    const genericMeta = (user?.user_metadata as Record<string, unknown> | null) ?? {};

    const kakaoAvatar =
        (identityData?.["properties"] as any)?.["profile_image"] ||
        (identityData?.["profile"] as any)?.["profile_image_url"] ||
        (identityData?.["kakao_account"] as any)?.["profile"]?.["profile_image_url"];
    const kakaoNickname =
        (identityData?.["properties"] as any)?.["nickname"] ||
        (identityData?.["kakao_account"] as any)?.["profile"]?.["nickname"];

    const avatar =
        (identityData?.["avatar_url"] as string | undefined) ||
        (identityData?.["picture"] as string | undefined) ||
        (kakaoAvatar as string | undefined) ||
        (genericMeta?.["avatar_url"] as string | undefined) ||
        (genericMeta?.["picture"] as string | undefined) ||
        undefined;

    const nameFromProvider =
        (identityData?.["name"] as string | undefined) ||
        (kakaoNickname as string | undefined) ||
        (typeof identityData?.["given_name"] === "string" || typeof identityData?.["family_name"] === "string"
            ? `${identityData?.["given_name"] ?? ""} ${identityData?.["family_name"] ?? ""}`.trim() || undefined
            : undefined);

    const name =
        nameFromProvider ||
        (genericMeta?.["name"] as string | undefined) ||
        (genericMeta?.["full_name"] as string | undefined) ||
        (genericMeta?.["nickname"] as string | undefined) ||
        (user?.email ? user.email.split("@")[0] : "user");

    const usernameFromProvider =
        (identityData?.["login"] as string | undefined) ||
        (identityData?.["user_name"] as string | undefined) ||
        (identityData?.["preferred_username"] as string | undefined) ||
        (kakaoNickname as string | undefined);

    const username =
        usernameFromProvider ||
        (genericMeta?.["user_name"] as string | undefined) ||
        (genericMeta?.["preferred_username"] as string | undefined) ||
        name;

    return { avatar, name, username };
}

export async function ensureProfileForUser(
    supabase: SupabaseClientLike,
    user: any,
    overrides?: { name?: string; username?: string; avatar?: string; role?: string }
) {
    if (!user) return;

    const { data: existingProfile, error: profileSelectError } = await supabase
        .from("profiles")
        .select("profile_id, avatar, name, username")
        .eq("profile_id" as any, user.id)
        .maybeSingle();

    const { avatar: providerAvatar, name: rawName, username: rawUsername } = extractProviderFields(user);
    const desiredName = overrides?.name ?? rawName;
    const desiredUsername = overrides?.username ?? rawUsername;
    const desiredAvatar = overrides?.avatar ?? providerAvatar;
    const desiredRole = overrides?.role ?? "developer";

    if (!existingProfile || profileSelectError) {
        // Create if not exists
        let username = toSlug(desiredUsername);
        const { data: sameUsername, error: sameUsernameError } = await supabase
            .from("profiles")
            .select("profile_id")
            .eq("username", username)
            .single();
        if (!sameUsernameError && sameUsername) {
            const suffix = Math.random().toString(36).slice(2, 6);
            username = `${username}-${suffix}`;
        }
        const now = new Date().toISOString();
        const { error: insertError } = await supabase.from("profiles").insert({
            profile_id: user.id,
            name: desiredName,
            username,
            avatar: desiredAvatar,
            role: desiredRole,
            created_at: now,
            updated_at: now,
        });
        if (insertError) {
            console.error("Profile creation failed after social login:", insertError.message);
        }
        return;
    }

    // Update missing fields, non-destructively
    const fieldsToUpdate: Record<string, unknown> = {};
    if (!existingProfile.name && desiredName) fieldsToUpdate.name = desiredName;
    if (!existingProfile.avatar && desiredAvatar) fieldsToUpdate.avatar = desiredAvatar;
    if (!existingProfile.username) {
        let username = toSlug(desiredUsername);
        const { data: sameUsername } = await supabase
            .from("profiles")
            .select("profile_id")
            .eq("username", username)
            .maybeSingle();
        if (sameUsername && sameUsername.profile_id !== user.id) {
            const suffix = Math.random().toString(36).slice(2, 6);
            username = `${username}-${suffix}`;
        }
        fieldsToUpdate.username = username;
    }
    if (Object.keys(fieldsToUpdate).length > 0) {
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ ...fieldsToUpdate, updated_at: new Date().toISOString() })
            .eq("profile_id" as any, user.id);
        if (updateError) {
            console.error("Profile update after social login failed:", updateError.message);
        }
    }
}


