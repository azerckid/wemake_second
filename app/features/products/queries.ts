import { DateTime } from "luxon";
import client from "~/supa-client";
import { PAGE_SIZE } from "./constants";

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
    page = 1,
}: {
    startDate: DateTime;
    endDate: DateTime;
    limit: number;
    ascending?: boolean;
    page?: number;
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
        .range((page - 1) * limit, page * limit - 1);

    if (error) {
        console.error('Products query error:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data || [];
};

export const getProductPagesByDateRange = async ({
    startDate,
    endDate,
}: {
    startDate: DateTime;
    endDate: DateTime;
}) => {
    const { count, error } = await client
        .from("products")
        .select(`product_id`, { count: "exact", head: true })
        .gte("created_at", startDate.toISO())
        .lte("created_at", endDate.toISO());
    if (error) throw error;
    if (!count) return 1;
    return Math.ceil(count / PAGE_SIZE);
};