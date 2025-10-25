import client from "~/supa-client";

export const getTeams = async ({
    limit,
    page = 1
}: {
    limit: number;
    page?: number;
}) => {
    const offset = (page - 1) * limit;

    const { data, error, count } = await client
        .from("teams")
        .select(
            `
    team_id,
    product_name,
    team_size,
    equity_split,
    product_stage,
    roles,
    product_description,
    created_at,
    team_leader:profiles!inner(
      username,
      avatar
    )
    `,
            { count: 'exact' }
        )
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return {
        teams: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page
    };
};