import { z } from "zod";
import { Form } from "react-router";

import type { Route } from "./+types/search-page";

import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { ProductCard } from "../components/product-card";
import { Pagination } from "~/common/components/pagination";
import { useSearchParams } from "react-router";

const paramsSchema = z.object({
    query: z.string().optional().default(""),
    page: z.coerce.number().optional().default(1),
});

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Search Products | wemake" },
        { name: "description", content: "Search for products" },
    ];
}

export function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const { success, data: parsedData } = paramsSchema.safeParse(
        Object.fromEntries(url.searchParams)
    );
    if (!success) {
        throw new Error("Invalid params");
    }
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
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