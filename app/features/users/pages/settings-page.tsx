import { Form, useNavigation } from "react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import type { Route } from "./+types/settings-page";


import { Alert, AlertDescription, AlertTitle } from "~/common/components/ui/alert";
import { getLoggedInUserId, getUserById } from "../queries";
import { updateProfile, profileUpdateSchema } from "../mutations";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";


export const meta: Route.MetaFunction = () => {
    return [{ title: "Settings | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const user = await getUserById(supabase, { id: userId });
    return { user, username: user.username };
};

export const action = async ({ request }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();
    
    const { success, error, data } = profileUpdateSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!success) {
        return {
            formErrors: error.flatten().fieldErrors,
        };
    }

    await updateProfile(supabase, userId, data);

    return {
        ok: true,
    };
};

export default function SettingsPage({ loaderData, actionData }: Route.ComponentProps) {
    const [avatar, setAvatar] = useState<string | null>(null);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setAvatar(URL.createObjectURL(file));
        }
    };
    return (
        <div className="space-y-20">
            <div className="grid grid-cols-6 gap-40">
                <div className="col-span-4 flex flex-col gap-10">
                    <h2 className="text-2xl font-semibold">Edit profile</h2>
                    {actionData?.ok ? (
                        <Alert>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>
                                Your profile has been updated.
                            </AlertDescription>
                        </Alert>
                    ) : null}
                    <Form method="post" className="flex flex-col w-1/2 gap-5">
                        <InputPair
                            label="Name"
                            description="Your public name"
                            required
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            defaultValue={loaderData.user.name}
                        />
                        {actionData?.formErrors?.name ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {actionData.formErrors.name.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <SelectPair
                            label="Role"
                            description="What role do you do identify the most with"
                            name="role"
                            placeholder="Select a role"
                            defaultValue={loaderData.user.role}
                            options={[
                                { label: "Developer", value: "developer" },
                                { label: "Designer", value: "designer" },
                                { label: "Marketer", value: "marketer" },
                                { label: "Product Manager", value: "product-manager" },
                                { label: "Founder", value: "founder" },
                            ]}
                        />
                        {actionData?.formErrors?.role ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {actionData.formErrors.role.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <InputPair
                            label="Headline"
                            description="An introduction to your profile."
                            required
                            id="headline"
                            name="headline"
                            placeholder="A brief introduction to your profile."
                            textArea
                            defaultValue={loaderData.user.headline ?? ""}
                        />
                        {actionData?.formErrors?.headline ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {actionData.formErrors.headline.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <InputPair
                            label="Bio"
                            description="Your public bio. It will be displayed on your profile page."
                            required
                            id="bio"
                            name="bio"
                            placeholder="Your public bio"
                            textArea
                            defaultValue={loaderData.user.bio ?? ""}
                        />
                        {actionData?.formErrors?.bio ? (
                            <Alert>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {actionData.formErrors.bio.join(", ")}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <Button className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update profile"
                            )}
                        </Button>
                    </Form>
                </div>
                <aside className="col-span-2 p-6 rounded-lg border shadow-md">
                    <Label className="flex flex-col gap-1">
                        Avatar
                        <small className="text-muted-foreground">
                            This is your public avatar.
                        </small>
                    </Label>
                    <div className="space-y-5">
                        <div className="size-40 rounded-full shadow-xl overflow-hidden ">
                            {avatar ? (
                                <img src={avatar} className="object-cover w-full h-full" />
                            ) : null}
                        </div>
                        <Input
                            type="file"
                            className="w-1/2"
                            onChange={onChange}
                            required
                            name="avatar"
                        />
                        <div className="flex flex-col text-xs">
                            <span className=" text-muted-foreground">
                                Recommended size: 128x128px
                            </span>
                            <span className=" text-muted-foreground">
                                Allowed formats: PNG, JPEG
                            </span>
                            <span className=" text-muted-foreground">Max file size: 1MB</span>
                        </div>
                        <Button className="w-full">Update avatar</Button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
