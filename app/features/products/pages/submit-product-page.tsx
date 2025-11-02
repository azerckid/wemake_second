import { useState } from "react";

import type { Route } from "./+types/submit-product-page";

import { Hero } from "~/common/components/hero";
import { Form, redirect } from "react-router";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getLoggedInUserId } from "~/features/users/queries";
import { getCategories } from "../queries";
import { createProduct, uploadProductIcon } from "../mutations";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    tagline: z.string().min(1, "Tagline is required").max(60, "Tagline must be 60 characters or less"),
    description: z.string().min(1, "Description is required"),
    howItWorks: z.string().min(1, "How it works is required"),
    url: z.string().url("Invalid URL"),
    categoryId: z.string().min(1, "Category is required"),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    await getLoggedInUserId(supabase);
    const categories = await getCategories(request);
    return { categories };
};

export const action = async ({ request }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const formData = await request.formData();

    const formErrors: Record<string, string[]> = {};

    // Handle icon file upload
    const iconFile = formData.get("icon") as File | null;
    let iconUrl = "";

    if (!iconFile || iconFile.size === 0) {
        formErrors.icon = ["Icon is required"];
    } else {
        if (iconFile.size > 2097152) {
            formErrors.icon = ["File size must be 2MB or less"];
        } else if (!iconFile.type.startsWith("image/")) {
            formErrors.icon = ["File must be an image (PNG or JPEG)"];
        } else {
            try {
                iconUrl = await uploadProductIcon(supabase, userId, iconFile);
            } catch (error) {
                formErrors.icon = ["Failed to upload icon"];
            }
        }
    }

    const productData = {
        name: formData.get("name") as string,
        tagline: formData.get("tagline") as string,
        description: formData.get("description") as string,
        howItWorks: formData.get("how_it_works") as string,
        url: formData.get("url") as string,
        categoryId: formData.get("category_id") as string,
    };

    const validationResult = productSchema.safeParse(productData);

    if (!validationResult.success) {
        validationResult.error.issues.forEach((err) => {
            if (err.path[0]) {
                formErrors[err.path[0] as string] = [err.message];
            }
        });
    }

    if (Object.keys(formErrors).length > 0) {
        return { formErrors };
    }

    const product_id = await createProduct(supabase, {
        name: productData.name,
        tagline: productData.tagline,
        description: productData.description,
        howItWorks: productData.howItWorks,
        url: productData.url,
        iconUrl,
        categoryId: parseInt(productData.categoryId),
        userId,
    });

    return redirect(`/products/${product_id}`);
};

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Submit Product | wemake" },
        { name: "description", content: "Submit your product to our community" },
    ];
}

export default function SubmitProductPage({ loaderData, actionData }: Route.ComponentProps) {
    const [icon, setIcon] = useState<string | null>(null);
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setIcon(URL.createObjectURL(file));
        }
    };
    return (
        <div>
            <Hero title="Submit Product" subtitle="Submit your product to our community" />
            <Form method="post" className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto" encType="multipart/form-data">
                <div className="space-y-5">
                    <InputPair
                        label="Name"
                        description="This is the name of your product"
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Name of your product"
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.name && (
                        <p className="text-red-500">{actionData.formErrors.name}</p>
                    )}
                    <InputPair
                        label="Tagline"
                        description="60 characters or less"
                        id="tagline"
                        name="tagline"
                        required
                        type="text"
                        placeholder="A concise description of your product"
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.tagline && (
                        <p className="text-red-500">{actionData.formErrors.tagline}</p>
                    )}
                    <InputPair
                        label="URL"
                        description="The URL of your product"
                        id="url"
                        name="url"
                        required
                        type="url"
                        placeholder="https://example.com"
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.url && (
                        <p className="text-red-500">{actionData.formErrors.url}</p>
                    )}
                    <InputPair
                        textArea
                        label="Description"
                        description="A detailed description of your product"
                        id="description"
                        name="description"
                        required
                        type="text"
                        placeholder="A detailed description of your product"
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.description && (
                        <p className="text-red-500">{actionData.formErrors.description}</p>
                    )}
                    <InputPair
                        textArea
                        label="How it works"
                        description="A detailed description of how your product works"
                        id="how_it_works"
                        name="how_it_works"
                        required
                        type="text"
                        placeholder="A detailed description of how your product works"
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.howItWorks && (
                        <p className="text-red-500">{actionData.formErrors.howItWorks}</p>
                    )}
                    <SelectPair
                        label="Category"
                        description="The category of your product"
                        name="category_id"
                        required
                        placeholder="Select a category"
                        options={loaderData.categories.map((category) => ({
                            label: category.name,
                            value: category.category_id.toString(),
                        }))}
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.categoryId && (
                        <p className="text-red-500">{actionData.formErrors.categoryId}</p>
                    )}
                    <Button type="submit" className="w-full" size="lg">
                        Submit
                    </Button>
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="size-40 rounded-xl shadow-xl overflow-hidden">
                        {icon ? (
                            <img src={icon} className="object-cover w-full h-full" />
                        ) : null}
                    </div>
                    <Label className="flex flex-col gap-1 items-start">
                        <span className="text-sm font-medium">Icon</span>
                        <small className="text-muted-foreground">
                            This is the icon of your product.
                        </small>
                    </Label>
                    <Input
                        type="file"
                        className="w-1/2 h-9 px-3 py-1 text-sm rounded-md border border-input bg-transparent cursor-pointer"
                        onChange={onChange}
                        required
                        name="icon"
                        accept="image/png,image/jpeg"
                    />
                    {actionData && "formErrors" in actionData && actionData?.formErrors?.icon && (
                        <p className="text-red-500">{actionData.formErrors.icon}</p>
                    )}
                    <div className="flex flex-col text-xs">
                        <span className=" text-muted-foreground">
                            Recommended size: 128x128px
                        </span>
                        <span className=" text-muted-foreground">
                            Allowed formats: PNG, JPEG
                        </span>
                        <span className=" text-muted-foreground">Max file size: 2MB</span>
                    </div>
                </div>
            </Form>
        </div>
    );
}
