import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Form, useActionData } from "react-router";

import type { action } from "../pages/product-reviews-page";

import InputPair from "~/common/components/input-pair";
import { Button } from "~/common/components/ui/button";
import { Label } from "~/common/components/ui/label";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "~/common/components/ui/dialog";

export default function CreateReviewDialog() {
    const [rating, setRating] = useState<number>(0);
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const actionData = useActionData<typeof action>();

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-2xl">
                    What do you think of this product?
                </DialogTitle>
                <DialogDescription>
                    Share your thoughts and experiences with this product.
                </DialogDescription>
            </DialogHeader>
            {actionData && "error" in actionData && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
                    {actionData.error}
                </div>
            )}
            <Form method="post" className="space-y-4">
                <div className="mt-4 mb-8">
                    <Label className="flex flex-col gap-1 items-center">
                        Rating
                        <small className="text-muted-foreground">
                            What would you rate this product?
                        </small>
                    </Label>
                    <div className="flex gap-2 mt-3 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <label
                                key={star}
                                className="relative cursor-pointer"
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                            >
                                <StarIcon
                                    className="size-5 text-yellow-400"
                                    fill={
                                        hoveredStar >= star || rating >= star
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                                <input
                                    type="radio"
                                    value={star}
                                    name="rating"
                                    required
                                    className="opacity-0 h-px w-px absolute"
                                    onChange={() => setRating(star)}
                                />
                                {actionData?.fieldErrors?.rating && (
                                    <p className="text-red-500">
                                        {actionData.fieldErrors.rating.join(", ")}
                                    </p>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
                <InputPair
                    textArea
                    required
                    label="Review"
                    description="Maximum 1000 characters"
                    name="review"
                    placeholder="Tell us more about your experience with this product"
                />
                {actionData?.fieldErrors?.review && (
                    <p className="text-red-500">
                        {actionData.fieldErrors.review.join(", ")}
                    </p>
                )}
                <DialogFooter>
                    <Button type="submit">Submit review</Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    );
}