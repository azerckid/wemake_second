import { useState } from "react";

import type { Route } from "./+types/product-reviews-page";

import { Button } from "~/common/components/ui/button";
import { Dialog, DialogTrigger } from "~/common/components/ui/dialog";
import { ReviewCard } from "../components/review-card";
import CreateReviewDialog from "../components/create-review-dialog";

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

export default function ProductReviewsPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-10 max-w-xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">10 Reviews </h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"}>Write a review</Button>
                    </DialogTrigger>
                    <CreateReviewDialog />
                </Dialog>
            </div>
            <div className="space-y-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <ReviewCard
                        key={i}
                        username="John Doe"
                        handle="@username"
                        avatarUrl="https://github.com/google.png"
                        rating={5}
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
                        postedAt="10 days ago"
                    />
                ))}
            </div>
        </div>
    );
}
