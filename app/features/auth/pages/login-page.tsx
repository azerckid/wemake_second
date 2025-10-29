import { Form, Link, useNavigation, redirect } from "react-router";

import type { Route } from "./+types/login-page";

import { LoaderCircle } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Button } from "~/common/components/ui/button";
import { Alert, AlertDescription } from "~/common/components/ui/alert";
import InputPair from "~/common/components/input-pair";
import AuthButtons from "../components/auth-buttons";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Login | wemake" }];
};

const formSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .max(254, { message: "Email must be at most 254 characters long" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(4, { message: "Password must be at least 4 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const result = formSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            fieldErrors[field] = issue.message;
        });
        return {
            success: false,
            fieldErrors,
        };
    }

    const email = result.data.email;
    const password = result.data.password;

    const { supabase, headers } = createSupabaseServerClient(request);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string,
    });
    if (error) {
        return {
            success: false,
            message: error.message,
        };
    }
    // authData가 존재하면 로그인 성공
    if (authData?.user && authData?.session) {
        return redirect("/", { headers });
    }
    // 예상치 못한 상황
    return {
        success: false,
        message: "Login failed unexpectedly",
    };
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="flex flex-col relative items-center justify-center h-full">
            <Button variant={"ghost"} asChild className="absolute right-8 top-8 ">
                <Link to="/auth/join">Join</Link>
            </Button>
            <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
                <h1 className="text-2xl font-semibold">Log in to your account</h1>
                <Form className="w-full space-y-4" method="post">
                    <div>
                        <InputPair
                            label="Email"
                            description="Enter your email address"
                            name="email"
                            id="email"
                            required
                            type="email"
                            placeholder="i.e wemake@example.com"
                        />
                        {actionData?.fieldErrors?.email && (
                            <Alert variant="destructive" className="mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {actionData.fieldErrors.email}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div>
                        <InputPair
                            id="password"
                            label="Password"
                            description="Enter your password"
                            name="password"
                            required
                            type="password"
                            placeholder="i.e wemake@example.com"
                        />
                        {actionData?.fieldErrors?.password && (
                            <Alert variant="destructive" className="mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {actionData.fieldErrors.password}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Log in"
                        )}
                    </Button>
                    {actionData?.message && actionData.success === false && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {actionData.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </Form>
                <AuthButtons />
            </div>
        </div>
    );
}

