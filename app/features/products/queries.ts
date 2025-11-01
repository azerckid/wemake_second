import { DateTime } from "luxon";
import { createSupabaseServerClient } from "~/lib/supabase.server";
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

export const getProductsByDateRange = async (
    request: Request,
    {
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
    }
): Promise<Product[]> => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
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

export const getProductPagesByDateRange = async (
    request: Request,
    {
        startDate,
        endDate,
    }: {
        startDate: DateTime;
        endDate: DateTime;
    }
) => {
    const { supabase } = createSupabaseServerClient(request);
    const { count, error } = await supabase
        .from("products")
        .select(`product_id`, { count: "exact", head: true })
        .gte("created_at", startDate.toISO())
        .lte("created_at", endDate.toISO());
    if (error) throw error;
    if (!count) return 1;
    return Math.ceil(count / PAGE_SIZE);
};

export const getCategories = async (request: Request) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("categories")
        .select("category_id, name, description");
    if (error) {
        console.error('Categories query error:', error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    return data;
};

export const getCategory = async (request: Request, categoryId: number) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
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

export const getProductsByCategory = async (
    request: Request,
    {
        categoryId,
        page,
    }: {
        categoryId: number;
        page: number;
    }
): Promise<Product[]> => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
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

export const getCategoryPages = async (request: Request, categoryId: number): Promise<number> => {
    const { supabase } = createSupabaseServerClient(request);
    const { count, error } = await supabase
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

export const getProductsBySearch = async (
    request: Request,
    {
        query,
        page,
    }: {
        query: string;
        page: number;
    }
): Promise<Product[]> => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("products")
        .select(productListSelect)
        .or(`name.ilike.%${query}%, tagline.ilike.%${query}%`)
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (error) {
        console.error('Products search query error:', error);
        throw new Error(`Failed to search products: ${error.message}`);
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

export const getPagesBySearch = async (request: Request, { query }: { query: string }) => {
    const { supabase } = createSupabaseServerClient(request);
    const { count, error } = await supabase
        .from("products")
        .select(`product_id`, { count: "exact", head: true })
        .or(`name.ilike.%${query}%, tagline.ilike.%${query}%`);
    if (error) throw error;
    if (!count) return 1;
    return Math.ceil(count / PAGE_SIZE);
};

export const getProductById = async (request: Request, productId: string) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("product_overview_view")
        .select("*")
        .eq("product_id", parseInt(productId))
        .single();
    if (error) throw error;
    return data;
};

export const getReviews = async (request: Request, productId: string) => {
    const { supabase } = createSupabaseServerClient(request);
    const { data, error } = await supabase
        .from("reviews")
        .select(
            `
          review_id,
          rating,
          review,
          created_at,
          user:profiles!inner(
            name,username,avatar
          )
        `
        )
        .eq("product_id", parseInt(productId))
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
};
