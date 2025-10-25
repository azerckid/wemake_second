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

export const productListSelect = `
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
`;

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
        .select(productListSelect)
        .order("stats->>upvotes", { ascending })
        .gte("created_at", startDate.toISO())
        .lte("created_at", endDate.toISO())
        .range((page - 1) * limit, page * limit - 1);

    if (error) {
        console.error('Products query error:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    // Convert string values from JSON to numbers
    const products: Product[] = (data || []).map(item => ({
        ...item,
        upvotes: parseInt(item.upvotes) || 0,
        views: parseInt(item.views) || 0,
        reviews: parseInt(item.reviews) || 0,
    }));

    return products;
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

export const getCategories = async () => {
    const { data, error } = await client
        .from("categories")
        .select("category_id, name, description");
    if (error) {
        console.error('Categories query error:', error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    return data;
};

export const getCategory = async (categoryId: number) => {
    const { data, error } = await client
        .from("categories")
        .select("category_id, name, description")
        .eq("category_id", categoryId)
        .single();
    if (error) {
        console.error('Category query error:', error);
        throw new Error(`Failed to fetch category: ${error.message}`);
    }
    return data;
};

export const getProductsByCategory = async ({
    categoryId,
    page,
}: {
    categoryId: number;
    page: number;
}): Promise<Product[]> => {
    const { data, error } = await client
        .from("products")
        .select(productListSelect)
        .eq("category_id", categoryId)
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (error) {
        console.error('Products by category query error:', error);
        throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    // Convert string values from JSON to numbers
    const products: Product[] = (data || []).map(item => ({
        ...item,
        upvotes: parseInt(item.upvotes) || 0,
        views: parseInt(item.views) || 0,
        reviews: parseInt(item.reviews) || 0,
    }));

    return products;
};

export const getCategoryPages = async (categoryId: number): Promise<number> => {
    const { count, error } = await client
        .from("products")
        .select(`product_id`, { count: "exact", head: true })
        .eq("category_id", categoryId);
    if (error) {
        console.error('Category pages query error:', error);
        throw new Error(`Failed to fetch category pages: ${error.message}`);
    }
    if (!count) return 1;
    return Math.ceil(count / PAGE_SIZE);
};