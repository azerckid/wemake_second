import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";
import type { Database } from "database.types";
import { formSchema } from "./pages/submit-team-page";

export const createTeam = async (
    client: SupabaseClient<Database>,
    userId: string,
    team: z.infer<typeof formSchema>
) => {
    const { data, error } = await client
        .from("teams")
        .insert({
            team_leader_id: userId,
            team_size: team.size,
            product_name: team.name,
            product_stage: team.stage as "idea" | "prototype" | "mvp" | "product",
            product_description: team.description,
            roles: team.roles,
            equity_split: team.equity,
        })
        .select("team_id")
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const applyToTeam = async (
    client: SupabaseClient<Database>,
    {
        team_id,
        user_id,
        role,
        introduction,
    }: {
        team_id: number;
        user_id: string;
        role: string;
        introduction: string;
    }
) => {
    // Check if user is already a member
    const { data: existingMember } = await client
        .from("team_members")
        .select("team_member_id")
        .eq("team_id", team_id)
        .eq("user_id", user_id)
        .maybeSingle();

    if (existingMember) {
        // Update existing application
        const { error } = await client
            .from("team_members")
            .update({
                role,
                status: "pending", // Set to pending when re-applying
            })
            .eq("team_member_id", existingMember.team_member_id);

        if (error) {
            throw error;
        }
    } else {
        // Create new application (storing introduction in role field for now, or we could add a separate field)
        // For now, we'll use role field to store the role they're applying for
        const { error } = await client
            .from("team_members")
            .insert({
                team_id,
                user_id,
                role,
                status: "pending",
            });

        if (error) {
            throw error;
        }
    }
};