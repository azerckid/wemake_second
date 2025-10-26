import { z } from "zod";
import { data, Form, useNavigate } from "react-router";

import type { Route } from "./+types/search-page";

import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { ProductCard } from "../components/product-card";
import { Pagination } from "~/common/components/pagination";
import { useSearchParams } from "react-router";
import { getProductsBySearch, getPagesBySearch } from "../queries";

const searchParamsSchema = z.object({
    query: z.string().optional().default(""),
    page: z.coerce.number().optional().default(1),
});

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Search Products | wemake" },
        { name: "description", content: "Search for products" },
    ];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const query = formData.get("query");

    if (!query || typeof query !== "string") {
        return data(
            {
                error_code: "invalid_query",
                message: "Invalid search query",
            },
            { status: 400 }
        );
    }

    // URL의 search 파라미터를 설정하여 리다이렉트
    const url = new URL(request.url);
    url.searchParams.set("query", query);
    url.searchParams.delete("page"); // 검색 시 페이지를 1로 리셋

    // 302 리다이렉트 → 브라우저가 GET 요청을 다시 보냄 → loader가 실행됨
    return data({}, { status: 302, headers: { Location: url.pathname + url.search } });
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const { success, data: parsedData } = searchParamsSchema.safeParse(
        Object.fromEntries(url.searchParams)
    );
    if (!success) {
        throw data(
            {
                error_code: "invalid_search_params",
                message: "Invalid search params",
            },
            { status: 400 }
        );
    }
    if (parsedData.query === "") {
        return { products: [], totalPages: 1, currentPage: 1, query: "" };
    }
    const products = await getProductsBySearch({
        query: parsedData.query,
        page: parsedData.page,
    });
    const totalPages = await getPagesBySearch({ query: parsedData.query });
    return { products, totalPages, currentPage: parsedData.page, query: parsedData.query };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
    };
    return (
        <div className="space-y-10">
            <Hero
                title="Search"
                subtitle="Search for products by title or description"
            />
            <Form className="flex justify-center h-14 max-w-screen-sm items-center gap-2 mx-auto">
                <Input
                    name="query"
                    placeholder="Search for products"
                    className="text-lg"
                />
                <Button type="submit">Search</Button>
            </Form>
            <div className="space-y-5 w-full max-w-screen-md mx-auto">
                {loaderData.products.length === 0 && loaderData.query ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground mb-2">
                            No products found for "{loaderData.query}"
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Try searching with different keywords
                        </p>
                    </div>
                ) : (
                    loaderData.products.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            id={product.product_id}
                            name={product.name}
                            description={product.tagline}
                            reviewsCount={product.reviews}
                            viewsCount={product.views}
                            votesCount={product.upvotes}
                        />
                    ))
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={loaderData.totalPages}
                onPageChange={(page) => {
                    navigate(`/products/search?query=${searchParams.get("query")}&page=${page}`);
                }}
                variant="simple"
            />
        </div>
    );
}