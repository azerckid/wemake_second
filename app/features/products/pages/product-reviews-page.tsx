import type { Route } from "./+types/product-reviews-page";

interface LoaderData {
    productId: string;
    reviews: Array<{
        id: string;
        content: string;
        rating: number;
    }>;
}

export function loader({ params }: Route.LoaderArgs) {
    // In a real app, you would fetch reviews from your database
    return {
        productId: params.productId,
        reviews: [],
    };
}

export function meta() {
    return [
        { title: "Product Reviews" },
        { name: "description", content: "Read and write product reviews" },
    ];
}

export default function ProductReviewsPage({
    loaderData,
}: Route.ComponentProps) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Product Reviews</h1>
            <div className="space-y-4">
                {loaderData.reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    loaderData.reviews.map((review: { id: string; rating: number; content: string }) => (
                        <div key={review.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-2">
                                <span className="text-yellow-400">
                                    {"★".repeat(review.rating)}
                                </span>
                                <span className="text-gray-300">
                                    {"★".repeat(5 - review.rating)}
                                </span>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
