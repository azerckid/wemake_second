import { Form, Link, redirect, useNavigation } from "react-router";

import type { Route } from "./+types/join-page";

import { z } from "zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Button } from "~/common/components/ui/button";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import AuthButtons from "../components/auth-buttons";
import { Alert, AlertDescription } from "~/common/components/ui/alert";
import { checkUsernameExists } from "../queries";

const formSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" }),
    username: z.string()
        .min(1, { message: "Username is required" })
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .max(254, { message: "Email must be at most 254 characters long" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" }),
    role: z.enum(['developer', 'designer', 'marketer', 'founder', 'product-manager'], {
        message: "Please select a role",
    }),
});

export const meta: Route.MetaFunction = () => {
    return [{ title: "Join | wemake" }];
};

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const result = formSchema.safeParse({
        name: formData.get("name"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
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
    const usernameExists = await checkUsernameExists(request, { username: result.data.username });
    if (usernameExists) {
        return {
            success: false,
            fieldErrors: { username: "Username already exists" },
            message: "Username already exists",
        };
    }

    const name = result.data.name;
    const username = result.data.username;
    const email = result.data.email;
    const password = result.data.password;
    const role = result.data.role;

    const { supabase, headers } = createSupabaseServerClient(request);

    // 기존 세션 완전 정리
    await supabase.auth.signOut();

    // 잠시 대기 (세션 정리 완료 대기)
    await new Promise(resolve => setTimeout(resolve, 100));

    // 새로운 Supabase 클라이언트 생성 (세션 정리 후)
    const { supabase: freshSupabase, headers: freshHeaders } = createSupabaseServerClient(request);

    const { data: authData, error } = await freshSupabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                username: username,
                role: role,
            },
        },
    });

    if (error) {
        return {
            success: false,
            message: `Registration failed: ${error.message}`,
        };
    }

    // 사용자 생성 성공 시 프로필 생성
    if (authData?.user) {
        // 프로필 생성
        const { error: profileError } = await freshSupabase
            .from('profiles')
            .insert({
                profile_id: authData.user.id,
                name: name,
                username: username,
                role: role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        if (profileError) {
            return {
                success: false,
                message: `Profile creation failed: ${profileError.message}`,
            };
        }

        // 이메일 확인이 필요한 경우 자동으로 로그인 시도
        if (!authData.user.email_confirmed_at) {
            const { data: signInData, error: signInError } = await freshSupabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (signInError) {
                return {
                    success: false,
                    message: `Registration successful but login failed: ${signInError.message}`,
                };
            }
        }

        // 로그인 성공 후 홈페이지로 리다이렉트
        // 세션 동기화를 위해 강제 새로고침
        return redirect("/?refresh=" + Date.now(), {
            headers: freshHeaders
        });
    }

    return {
        success: false,
        message: "Registration failed unexpectedly",
    };
}

export default function JoinPage({ actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="flex flex-col relative items-center justify-center h-full">
            <Button variant={"ghost"} asChild className="absolute right-8 top-8 ">
                <Link to="/auth/login">Login</Link>
            </Button>
            <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
                <h1 className="text-2xl font-semibold">Create an account</h1>
                <Form className="w-full space-y-4" method="post">
                    <InputPair
                        label="Name"
                        description="Enter your name"
                        name="name"
                        id="name"
                        required
                        type="text"
                        placeholder="Enter your name"
                    />
                    {actionData?.fieldErrors && 'name' in actionData.fieldErrors && actionData.fieldErrors.name && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {actionData.fieldErrors.name}
                            </AlertDescription>
                        </Alert>
                    )}
                    <InputPair
                        id="username"
                        label="Username"
                        description="Enter your username"
                        name="username"
                        required
                        type="text"
                        placeholder="i.e wemake"
                    />
                    {actionData?.fieldErrors && 'username' in actionData.fieldErrors && actionData.fieldErrors.username && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {actionData.fieldErrors.username}
                            </AlertDescription>
                        </Alert>
                    )}
                    <InputPair
                        id="email"
                        label="Email"
                        description="Enter your email address"
                        name="email"
                        required
                        type="email"
                        placeholder="i.e wemake@example.com"
                    />
                    {actionData?.fieldErrors && 'email' in actionData.fieldErrors && actionData.fieldErrors.email && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {actionData.fieldErrors.email}
                            </AlertDescription>
                        </Alert>
                    )}
                    <InputPair
                        id="password"
                        label="Password"
                        description="Enter your password"
                        name="password"
                        required
                        type="password"
                        placeholder="Enter your password"
                    />
                    {actionData?.fieldErrors && 'password' in actionData.fieldErrors && actionData.fieldErrors.password && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {actionData.fieldErrors.password}
                            </AlertDescription>
                        </Alert>
                    )}
                    <SelectPair
                        label="Role"
                        description="Select your role"
                        name="role"
                        required
                        options={[
                            { value: 'developer', label: 'Developer' },
                            { value: 'designer', label: 'Designer' },
                            { value: 'marketer', label: 'Marketer' },
                            { value: 'founder', label: 'Founder' },
                            { value: 'product-manager', label: 'Product Manager' },
                        ]}
                        placeholder="Select your role"
                    />
                    {actionData?.fieldErrors && 'role' in actionData.fieldErrors && actionData.fieldErrors.role && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {actionData.fieldErrors.role}
                            </AlertDescription>
                        </Alert>
                    )}
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Create account"
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
