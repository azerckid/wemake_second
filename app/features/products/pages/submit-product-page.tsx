import { useState } from "react";
import { Form, redirect, useNavigation } from "react-router";

import type { Route } from "./+types/submit-product-page";

import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { getCategories } from "../queries";
import { getLoggedInUserId } from "~/features/users/queries";
import { createProduct, uploadProductIcon } from "../mutations";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Submit Product | wemake" },
        { name: "description", content: "Submit your product to our community" },
    ];
}

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    tagline: z.string().min(1, "Tagline is required").max(60, "Tagline must be 60 characters or less"),
    description: z.string().min(1, "Description is required"),
    howItWorks: z.string().min(1, "How it works is required"),
    url: z.string().url("Invalid URL"),
    categoryId: z.string().min(1, "Category is required"),
    icon: z.instanceof(File).refine(
        (file) => file.size <= 2097152,
        "File size must be 2MB or less"
    ).refine(
        (file) => file.type.startsWith("image/"),
        "File must be an image (PNG or JPEG)"
    ),
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

    const productData = {
        name: formData.get("name") as string,
        tagline: formData.get("tagline") as string,
        description: formData.get("description") as string,
        howItWorks: formData.get("how_it_works") as string,
        url: formData.get("url") as string,
        categoryId: formData.get("category_id") as string,
        icon: formData.get("icon") as File | null,
    };

    const validationResult = productSchema.safeParse(productData);

    if (!validationResult.success) {
        const formErrors: Record<string, string[]> = {};
        validationResult.error.issues.forEach((err) => {
            if (err.path[0]) {
                formErrors[err.path[0] as string] = [err.message];
            }
        });
        return { formErrors };
    }

    // Handle icon file upload
    let iconUrl = "";
    try {
        iconUrl = await uploadProductIcon(supabase, userId, validationResult.data.icon);
    } catch (error) {
        const formErrors: Record<string, string[]> = {
            icon: ["Failed to upload icon"],
        };
        return { formErrors };
    }

    const product_id = await createProduct(supabase, {
        name: validationResult.data.name,
        tagline: validationResult.data.tagline,
        description: validationResult.data.description,
        howItWorks: validationResult.data.howItWorks,
        url: validationResult.data.url,
        iconUrl,
        categoryId: parseInt(validationResult.data.categoryId),
        userId,
    });

    return redirect(`/products/${product_id}`);
};

export default function SubmitProductPage({ loaderData, actionData }: Route.ComponentProps) {
    const [icon, setIcon] = useState<string | null>(null);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

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
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="animate-spin mr-2" />
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
