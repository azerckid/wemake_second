import { Form, Link, NavLink, Outlet } from "react-router";

import type { Route } from "./+types/profile-layout";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button, buttonVariants } from "~/common/components/ui/button";
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "~/common/components/ui/dialog";
import { Textarea } from "~/common/components/ui/textarea";
import { cn } from "~/lib/utils";
import { getUserProfile } from "../queries";
import { getUser } from "~/lib/supabase.server";


export const loader = async ({
    request,
    params,
}: Route.LoaderArgs & { params: { username: string } }) => {
    const user = await getUserProfile(request, params.username);
    const authUser = await getUser(request);
    const isOwner = !!authUser && authUser.id === user.profile_id;
    const email = isOwner ? authUser?.email ?? null : null;
    return { user, email, isOwner };
};

export default function ProfileLayout({ loaderData }: Route.ComponentProps) {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4">
                <Avatar className="size-40">
                    {loaderData.user.avatar ? (
                        <AvatarImage src={loaderData.user.avatar} />
                    ) : (
                        <AvatarFallback className="text-2xl">
                            {loaderData.user.name[0]}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="space-y-2">
                    <div>

                    </div>
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-semibold">{loaderData.user.name}</h1>
                        <Button variant="outline" asChild>
                            <Link to="/my/settings">Edit profile</Link>
                        </Button>
                        <Button variant="secondary">Follow</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary">Message</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Message</DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="space-y-4">
                                    <span className="text-sm text-muted-foreground">
                                        Send a message to {loaderData.user.name}
                                    </span>
                                    <Form className="space-y-4">
                                        <Textarea
                                            placeholder="Message"
                                            className="resize-none"
                                            rows={4}
                                        />
                                        <Button type="submit">Send</Button>
                                    </Form>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="text-sm text-muted-foreground">@{loaderData.user.username}</span>
                        {loaderData.email ? (
                            <span className="text-sm text-muted-foreground">| {loaderData.email}</span>
                        ) : null}
                        <Badge variant={"secondary"}>{loaderData.user.role}</Badge>
                        <Badge variant={"secondary"}>{loaderData.user.stats?.followers ?? 0} followers</Badge>
                        <Badge variant={"secondary"}>{loaderData.user.stats?.following ?? 0} following</Badge>

                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                {[
                    { label: "About", to: `/users/${loaderData.user.username}` },
                    {
                        label: "Products",
                        to: `/users/${loaderData.user.username}/products`,
                    },
                    { label: "Posts", to: `/users/${loaderData.user.username}/posts` },
                ].map((item) => (
                    <NavLink
                        end
                        key={item.label}
                        className={({ isActive }) =>
                            cn(
                                buttonVariants({ variant: "outline" }),
                                isActive && "bg-accent text-foreground "
                            )
                        }
                        to={item.to}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
            <div className="max-w-screen-md">
                <Outlet
                    context={{
                        headline: loaderData.user.headline ?? "",
                        bio: loaderData.user.bio ?? "",
                    }}
                />
            </div>
        </div>
    );
}