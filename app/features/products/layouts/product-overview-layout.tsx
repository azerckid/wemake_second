import { Link, NavLink, Outlet } from "react-router";

import type { Route } from "./+types/product-overview-layout";

import { ArrowUpRightIcon, StarIcon } from "lucide-react";
import { ChevronUpIcon } from "lucide-react";
import { PackageIcon } from "lucide-react";
import { Button, buttonVariants } from "~/common/components/ui/button";
import { cn } from "~/lib/utils";
import { getProductById } from "../queries";

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: `${data.product.name} Overview | wemake` },
        { name: "description", content: "View product details and information" },
    ];
}

export const loader = async ({
    params,
}: Route.LoaderArgs & { params: { productId: string } }) => {
    const product = await getProductById(params.productId);
    return { product };
};

export default function ProductOverviewLayout({
    loaderData,
}: Route.ComponentProps) {
    return (
        <div className="space-y-10">
            <div className="flex justify-between">
                <div className="flex gap-10">
                    <div className="size-40 rounded-xl shadow-xl bg-primary/50 flex items-center justify-center">
                        {loaderData.product.icon && loaderData.product.icon.trim() !== "" ? (
                            <img
                                src={loaderData.product.icon}
                                alt={loaderData.product.name ?? ""}
                                className="size-full object-cover rounded-xl"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <PackageIcon className={`size-16 text-muted-foreground ${loaderData.product.icon && loaderData.product.icon.trim() !== "" ? 'hidden' : ''}`} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-bold">{loaderData.product.name ?? ""}</h1>
                        <p className=" text-2xl font-light text-muted-foreground">{loaderData.product.tagline ?? ""}</p>
                        <div className="mt-5 flex items-center gap-4">
                            <div className="flex text-yellow-400 gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className="size-4"
                                        fill={
                                            i < Math.floor(loaderData.product.average_rating ?? 0)
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                ))}
                            </div>
                            <span className="text-muted-foreground ">{loaderData.product.reviews ?? 0} reviews</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-5">
                    <Button
                        variant={"secondary"}
                        size="lg"
                        className="text-sm"
                    >
                        <Link to={`/products/${loaderData.product.product_id}/visit`} className="flex items-center gap-2 hover:underline">
                            <ArrowUpRightIcon className="size-4" />
                            Visit Website
                        </Link>
                    </Button>
                    <Button size="lg" className="text-sm">
                        <ChevronUpIcon className="size-4" />
                        Upvote ({loaderData.product.upvotes ?? 0})
                    </Button>
                </div>
            </div>
            <div className="flex gap-2.5">
                <NavLink
                    end
                    className={({ isActive }) =>
                        cn(
                            buttonVariants({ variant: "outline" }),
                            isActive && "bg-accent text-foreground "
                        )
                    }
                    to={`/products/${loaderData.product.product_id}/overview`}
                >
                    Overview
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        cn(
                            buttonVariants({ variant: "outline" }),
                            isActive && "bg-accent text-foreground "
                        )
                    }
                    to={`/products/${loaderData.product.product_id}/reviews`}
                >
                    Reviews
                </NavLink>
            </div>
            <div>
                <Outlet
                    context={{
                        product_id: loaderData.product.product_id,
                        description: loaderData.product.description,
                        how_it_works: loaderData.product.how_it_works,
                        review_count: loaderData.product.reviews,
                    }}
                />
            </div>
        </div>
    );
}