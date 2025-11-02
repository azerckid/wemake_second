import { useState, useEffect } from "react";
import { useOutletContext, redirect, useSearchParams, useNavigation } from "react-router";

import type { Route } from "./+types/product-reviews-page";

import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { getReviews } from "../queries";
import { createProductReview } from "../mutations";
import { getLoggedInUserId } from "~/features/users/queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { ReviewCard } from "../components/review-card";
import CreateReviewDialog from "../components/create-review-dialog";

import { Button } from "~/common/components/ui/button";
import { Dialog, DialogTrigger } from "~/common/components/ui/dialog";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

export function meta() {
    return [
        { title: "Product Reviews | wemake" },
        { name: "description", content: "Read and write product reviews" },
    ];
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const reviews = await getReviews(request, params.productId);
    return { reviews };
};

const reviewSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    review: z.string().min(1).max(1000),
});

export async function action({ request, params }: Route.ActionArgs) {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const productId = params.productId;

    if (!productId) {
        throw new Response("Product ID is required", { status: 400 });
    }

    const formData = await request.formData();
    const { success, error, data } = reviewSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!success) {
        return {
            fieldErrors: error.flatten().fieldErrors,
        };
    }

    await createProductReview(supabase, {
        productId,
        review: data.review,
        rating: data.rating,
        userId,
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    return redirect(`/products/${productId}/reviews?success=true`);
}

export default function ProductReviewsPage({
    loaderData,
    actionData,
}: Route.ComponentProps) {
    const { review_count } = useOutletContext<{
        review_count: string;
    }>();
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";
    const success = searchParams.get("success") === "true";

    // Close dialog when submission is complete
    useEffect(() => {
        if (!isSubmitting && navigation.state === "idle") {
            setOpen(false);
        }
    }, [isSubmitting, navigation.state]);

    // Clear success param after showing
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                searchParams.delete("success");
                setSearchParams(searchParams, { preventScrollReset: true });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, searchParams, setSearchParams]);

    return (
        <div className="space-y-10 max-w-xl">
            {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>리뷰가 성공적으로 제출되었습니다!</AlertDescription>
                </Alert>
            )}
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
