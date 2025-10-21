import { useState } from "react";

import type { Route } from "./+types/submit-product-page";

import { Hero } from "~/common/components/hero";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";

export function loader({ request }: Route.LoaderArgs) {
    return {};
}

export function action({ request }: Route.ActionArgs) {
    // Handle form submission here
    return {};
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: "Submit Product | wemake" },
        { name: "description", content: "Submit your product to our community" },
    ];
}

export default function SubmitProductPage({ loaderData }: Route.ComponentProps) {
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
            <Form className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto">
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
                    <InputPair
                        label="Tagline"
                        description="60 characters or less"
                        id="tagline"
                        name="tagline"
                        required
                        type="text"
                        placeholder="A concise description of your product"
                    />
                    <InputPair
                        label="URL"
                        description="The URL of your product"
                        id="url"
                        name="url"
                        required
                        type="url"
                        placeholder="https://example.com"
                    />
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
                    <InputPair
                        textArea
                        label="How it works"
                        description="Explain how your product works"
                        id="how_it_works"
                        name="how_it_works"
                        required
                        type="text"
                        placeholder="Explain how your product works"
                    />
                    <SelectPair
                        label="Category"
                        description="The category of your product"
                        name="category_id"
                        required
                        placeholder="Select a category"
                        options={[
                            { label: "AI", value: "1" },
                            { label: "Design", value: "2" },
                            { label: "Marketing", value: "3" },
                            { label: "Development", value: "4" },
                        ]}
                    />
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
                    <div className="flex flex-col text-xs">
                        <span className=" text-muted-foreground">
                            Recommended size: 128x128px
                        </span>
                        <span className=" text-muted-foreground">
                            Allowed formats: PNG, JPEG
                        </span>
                        <span className=" text-muted-foreground">Max file size: 1MB</span>
                    </div>
                </div>
            </Form>
        </div>
    );
}
