import { Await, data, Form, isRouteErrorResponse, Link, useSearchParams } from "react-router";
import { Suspense } from "react";

import type { Route } from "./+types/community-page";

import { PERIOD_OPTIONS, POSTS_PER_PAGE, SORT_OPTIONS } from "../constants";
import { ChevronDownIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { Button } from "~/common/components/ui/button";
import { Hero } from "~/common/components/hero";
import { Input } from "~/common/components/ui/input";
import { PostCard } from "../components/post-card";

import { getPosts, getPostsCount, getTopics } from "../queries";
import { Pagination } from "~/common/components/pagination";
import { z } from "zod";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Community | wemake" }];
};

const searchParamsSchema = z.object({
    sorting: z.enum(["newest", "popular"]).optional().default("newest"),
    period: z
        .enum(["all", "today", "week", "month", "year"])
        .optional()
        .default("all"),
    keyword: z.string().optional(),
    topic: z.string().optional(),
    page: z.string().optional().default("1"),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
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

    const page = Number(parsedData.page);
    const limit = POSTS_PER_PAGE;

    const [topics, posts, totalCount] = await Promise.all([
        getTopics(request),
        getPosts(request, {
            limit,
            sorting: parsedData.sorting,
            period: parsedData.period,
            keyword: parsedData.keyword,
            topic: parsedData.topic,
            page,
        }),
        getPostsCount(request, {
            sorting: parsedData.sorting,
            period: parsedData.period,
            keyword: parsedData.keyword,
            topic: parsedData.topic,
        }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { topics, posts, totalPages, currentPage: page };
};

export default function CommunityPage({ loaderData }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
    };

    const sorting = searchParams.get("sorting") || "newest";
    const period = searchParams.get("period") || "all";
    const { topics, posts, totalPages } = loaderData;
    return (
        <div className="space-y-20">
            <Hero
                title="Community"
                subtitle="Ask questions, share ideas, and connect with other developers"
            />
            <div className="grid grid-cols-6 items-start gap-40">
                <div className="col-span-4 space-y-10">
                    <div className="flex justify-between">
                        <div className="space-y-5 w-full">
                            <div className="flex items-center gap-5">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <span className="text-sm capitalize">{sorting}</span>
                                        <ChevronDownIcon className="size-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <DropdownMenuCheckboxItem
                                                className="capitalize cursor-pointer"
                                                key={option}
                                                onCheckedChange={(checked: boolean) => {
                                                    if (checked) {
                                                        searchParams.set("sorting", option);
                                                        setSearchParams(searchParams);
                                                    }
                                                }}
                                            >
                                                {option}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {sorting === "popular" && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-1">
                                            <span className="text-sm capitalize">{period}</span>
                                            <ChevronDownIcon className="size-5" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {PERIOD_OPTIONS.map((option) => (
                                                <DropdownMenuCheckboxItem
                                                    className="capitalize cursor-pointer"
                                                    key={option}
                                                    onCheckedChange={(checked: boolean) => {
                                                        if (checked) {
                                                            searchParams.set("period", option);
                                                            setSearchParams(searchParams);
                                                        }
                                                    }}
                                                >
                                                    {option}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <Form className="w-2/3">
                                <Input
                                    type="text"
                                    name="keyword"
                                    placeholder="Search for discussions..."
                                />
                            </Form>
                        </div>
                        <Button asChild>
                            <Link to={`/community/submit`}>Create Discussion</Link>
                        </Button>
                    </div>
                    <Suspense fallback={
                        <div>Loading posts...</div>
                    }>
                        <Await resolve={posts}>
                            {(data) => (
                                <div className="space-y-5">
                                    {data.map((post: any) => (
                                        <PostCard
                                            key={post.post_id}
                                            post_id={post.post_id}
                                            title={post.title}
                                            author={post.author}
                                            authorAvatarUrl={post.author_avatar}
                                            topic_id={0} // 뷰에는 topic_id가 없으므로 기본값 사용
                                            topic_name={post.topic}
                                            created_at={post.created_at}
                                            expanded
                                            votesCount={post.upvotes}
                                            isUpvoted={post.is_upvoted}
                                        />
                                    ))}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-10">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={onPageChange}
                                                variant="simple"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Await>
                    </Suspense>
                </div>
                <aside className="col-span-2 space-y-5 sticky top-20">
                    <div className="mb-5 text-sm font-bold text-muted-foreground uppercase">
                        Topics
                    </div>
                    <div className="flex flex-col items-start">
                        <Suspense fallback={<div>Loading topics...</div>}>
                            <Await resolve={topics}>
                                {(data) => (
                                    <div className="flex flex-col items-start">
                                        {data.map((topic: any) => (
                                            <Button
                                                asChild
                                                variant={"link"}
                                                key={topic.topic_id}
                                                className="pl-0"
                                            >
                                                <Link to={`/community?topic=${topic.slug}`}>{topic.name}</Link>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </Await>
                        </Suspense>
                    </div>
                </aside>
            </div>
        </div >
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                {error.data?.message} / {error.data?.error_code}
            </div>
        );
    }
    if (error instanceof Error) {
        return <div>{error.message}</div>;
    }
    return <div>Unknown error</div>;
};