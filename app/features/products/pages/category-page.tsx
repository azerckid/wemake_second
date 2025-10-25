import { data, useSearchParams, useNavigate } from "react-router";

import type { Route } from "./+types/category-page";

import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { Pagination } from "~/common/components/pagination";
import { getCategory, getCategoryPages, getProductsByCategory } from "../queries";
import { z } from "zod";

export const meta = ({ params }: Route.MetaArgs) => {
    return [
        { name: "description", content: `Browse ${params.category} products` },
        { name: "description", content: `Browse Developer Tools products` },
    ];
}

const paramsSchema = z.object({
    category: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;
    const { data, success } = paramsSchema.safeParse(params);
    if (!success) {
        throw new Response("Invalid category", { status: 400 });
    }
    const category = await getCategory(data.category);
    const products = await getProductsByCategory({
        categoryId: data.category,
        page: Number(page),
    });
    const totalPages = await getCategoryPages(data.category);
    return { category, products, totalPages, currentPage: Number(page) };
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    return (
        <div className="space-y-10">
            <Hero
                title={loaderData.category.name}
                subtitle={loaderData.category.description}
            />

            <div className="space-y-5 w-full max-w-screen-md mx-auto">
                {loaderData.products.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        id={product.product_id}
                        name={product.name}
                        description={product.description}
                        reviewsCount={product.reviews}
                        viewsCount={product.views}
                        votesCount={product.upvotes}
                    />
                ))}
            </div>
            <Pagination
                currentPage={loaderData.currentPage}
                totalPages={loaderData.totalPages}
                onPageChange={(page) => {
                    navigate(`/products/categories/${loaderData.category.category_id}?page=${page}`);
                }}
                variant="simple"
            />
        </div>
    );
}