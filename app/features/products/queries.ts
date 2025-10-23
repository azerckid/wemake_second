import { DateTime } from "luxon";
import client from "~/supa-client";

// Product 타입 정의
export interface Product {
    product_id: number;
    name: string;
    tagline: string;
    description: string;
    how_it_works: string;
    icon: string;
    url: string;
    upvotes: number;
    views: number;
    reviews: number;
    profile_id: string;
    category_id: number | null;
    created_at: string;
}

export const getProductsByDateRange = async ({
    startDate,
    endDate,
    limit,
    ascending = false,
}: {
    startDate: DateTime;
    endDate: DateTime;
    limit: number;
    ascending?: boolean;
}): Promise<Product[]> => {
    const { data, error } = await client
        .from("products")
        .select(
            `
        product_id,
        name,
        tagline,
        description,
        how_it_works,
        icon,
        url,
        upvotes:stats->>upvotes,
        views:stats->>views,
        reviews:stats->>reviews,
        profile_id,
        category_id,
        created_at
    `
        )
        .order("stats->>upvotes", { ascending })
        .gte("created_at", startDate.toISO())
        .lte("created_at", endDate.toISO())
        .limit(limit);

    if (error) {
        console.error('Products query error:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data || [];
};