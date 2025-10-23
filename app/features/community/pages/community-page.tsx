import { Form, Link, useSearchParams } from "react-router";

import type { Route } from "./+types/community-page";

import { PERIOD_OPTIONS, SORT_OPTIONS } from "../constants";
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

import { getPosts, getTopics } from "../queries";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Community | wemake" }];
};

export async function loader({ request }: Route.LoaderArgs) {
    const topics = await getTopics();
    const posts = await getPosts();
    return { topics, posts };
}

export default function CommunityPage({ loaderData }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sorting = searchParams.get("sorting") || "newest";
    const period = searchParams.get("period") || "all";
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
                                    name="search"
                                    placeholder="Search for discussions"
                                />
                            </Form>
                        </div>
                        <Button asChild>
                            <Link to={`/community/submit`}>Create Discussion</Link>
                        </Button>
                    </div>
                    <div className="space-y-5">
                        {loaderData.posts.map((post: any) => (
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
                            />
                        ))}
                    </div>
                </div>
                <aside className="col-span-2 space-y-5 sticky top-20">
                    <div className="mb-5 text-sm font-bold text-muted-foreground uppercase">
                        Topics
                    </div>
                    <div className="flex flex-col items-start">
                        {loaderData.topics.map((topic: any) => (
                            <Button
                                asChild
                                variant={"link"}
                                key={topic.topic_id}
                                className="pl-0"
                            >
                                <Link to={`/community?topic=${topic.topic_id}`}>{topic.name}</Link>
                            </Button>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}