import { Form, redirect, useNavigation } from "react-router";

import type { Route } from "./+types/otp-start-page";

import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Start OTP | wemake" }];
};

const formSchema = z.object({
    email: z.string().email(),
});

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const { data, success } = formSchema.safeParse(Object.fromEntries(formData));
    if (!success) {
        return { error: "Invalid email address" };
    }
    const { email } = data;

    const { supabase } = createSupabaseServerClient(request);

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
        },
    });

    if (error) {
        return { error: "Failed to send OTP" };
    }

    return redirect(`/auth/otp/complete?email=${email}`);
};

export default function OtpStartPage({ actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isSubmitting =
        navigation.state === "submitting" || navigation.state === "loading";
    return (
        <div className="flex flex-col relative items-center justify-center h-full">
            <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Log in with OTP</h1>
                    <p className="text-sm text-muted-foreground">
                        We will send you a 4-digit code to log in to your account.
                    </p>
                </div>
                <Form className="w-full space-y-4" method="post">
                    <InputPair
                        label="Email"
                        description="Enter your email address"
                        name="email"
                        id="email"
                        required
                        type="email"
                        placeholder="i.e wemake@example.com"
                    />
                    {actionData && "error" in actionData && (
                        <p className="text-red-500 text-sm">{actionData.error}</p>
                    )}
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Send OTP"
                        )}
                    </Button>
                </Form>
            </div>
        </div>
    );
}