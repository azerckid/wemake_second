import { useState } from "react";

import type { Route } from "./+types/product-reviews-page";

import { Button } from "~/common/components/ui/button";
import { Dialog, DialogTrigger } from "~/common/components/ui/dialog";
import { ReviewCard } from "../components/review-card";
import CreateReviewDialog from "../components/create-review-dialog";
import { useOutletContext } from "react-router";
import { getReviews } from "../queries";

export function meta() {
    return [
        { title: "Product Reviews | wemake" },
        { name: "description", content: "Read and write product reviews" },
    ];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const rating = formData.get("rating");
    const review = formData.get("review");

    // 여기서 데이터베이스에 저장
    console.log("Review submitted:", { rating, review });

    return { success: true };
}

export const loader = async ({ params }: Route.LoaderArgs) => {
    const reviews = await getReviews(params.productId);
    return { reviews };
};

export default function ProductReviewsPage({
    loaderData,
}: Route.ComponentProps) {
    const { review_count } = useOutletContext<{
        review_count: string;
    }>();
    const [open, setOpen] = useState(false);
    return (
        <div className="space-y-10 max-w-xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    {review_count} {parseInt(review_count) === 1 ? "Review" : "Reviews"}
                </h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"}>Write a review</Button>
                    </DialogTrigger>
                    <CreateReviewDialog />
                </Dialog>
            </div>
            <div className="space-y-6">
                {loaderData.reviews.map((review) => (
                    <ReviewCard
                        key={review.review_id}
                        username={review.user.name}
                        handle={review.user.username}
                        avatarUrl={review.user.avatar}
                        rating={review.rating}
                        content={review.review}
                        postedAt={review.created_at}
                    />
                ))}
            </div>
        </div>
    );
}
