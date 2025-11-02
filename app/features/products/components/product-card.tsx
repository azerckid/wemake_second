import { Link, Form } from "react-router";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { ChevronUpIcon, EyeIcon, MessageCircleIcon } from "lucide-react";

interface ProductCardProps {
    id: number;
    name: string | string;
    description: string;
    reviewsCount: number;
    viewsCount: number;
    votesCount: number;
    showUpvoteButton?: boolean;
}

export function ProductCard({
    id,
    name,
    description,
    reviewsCount,
    viewsCount,
    votesCount,
    showUpvoteButton = false,
}: ProductCardProps) {
    // Ensure id is a valid number
    const numericId = typeof id === 'number' ? id : Number(id);
    if (isNaN(numericId)) {
        console.error('ProductCard received invalid id:', id, 'for product:', name);
    }
    const productUrl = `/products/${numericId}`;
    return (
        <Card className="w-full flex flex-row items-center justify-between p-6 bg-transparent hover:bg-primary/10">
            <Link to={productUrl} className="flex-1">
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                        {name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-px text-xs text-muted-foreground">
                            <MessageCircleIcon className="w-4 h-4" />
                            <span>{reviewsCount}</span>
                        </div>
                        <div className="flex items-center gap-px text-xs text-muted-foreground">
                            <EyeIcon className="w-4 h-4" />
                            <span>{viewsCount}</span>
                        </div>
                    </div>
                </CardHeader>
            </Link>
            <CardFooter className="py-0">
                {showUpvoteButton ? (
                    <Form method="post">
                        <input type="hidden" name="intent" value="upvote" />
                        <input type="hidden" name="product_id" value={numericId} />
                        <Button
                            type="submit"
                            variant="outline"
                            className="flex flex-col h-14"
                        >
                            <ChevronUpIcon className="size-4 shrink-0" />
                            <span>{votesCount}</span>
                        </Button>
                    </Form>
                ) : (
                    <Button variant="outline" className="flex flex-col h-14">
                        <ChevronUpIcon className="size-4 shrink-0" />
                        <span>{votesCount}</span>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}