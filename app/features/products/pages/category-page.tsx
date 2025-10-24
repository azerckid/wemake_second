import type { Route } from "./+types/category-page";

import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import { Pagination } from "~/common/components/pagination";
import { useSearchParams } from "react-router";

export const meta = ({ params }: Route.MetaArgs) => {
    return [
        { name: "description", content: `Browse ${params.category} products` },
        { name: "description", content: `Browse Developer Tools products` },
    ];
}
export default function CategoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
    };
    return (
        <div className="space-y-10">
            <Hero
                title={"Developer Tools"}
                subtitle={`Tools for developers to build products faster`}
            />

            <div className="space-y-5 w-full max-w-screen-md mx-auto">
                {Array.from({ length: 11 }).map((_, index) => (
                    <ProductCard
                        key={`productId-${index}`}
                        id={`productId-${index}`}
                        name="Product Name"
                        description="Product Description"
                        reviewsCount={12}
                        viewsCount={12}
                        votesCount={120}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={onPageChange}
                variant="simple"
            />
        </div>
    );
}