import { Form, Link, redirect, useNavigation } from "react-router";

import type { Route } from "./+types/job-page";

import { z } from "zod";
import { DateTime } from "luxon";
import { getJobById } from "../queries";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { getLoggedInUserId } from "~/features/users/queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

export const meta: Route.MetaFunction = ({ data }) => {
    return [{ title: `${data?.job?.position} | wemake` }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const url = new URL(request.url);
    const success = url.searchParams.get("success") === "true";

    // 로그인한 사용자인지 확인 (Apply Now 버튼 사용을 위해 필요)
    // 하지만 인증 실패 시에도 페이지는 볼 수 있도록 try-catch 사용
    let isAuthenticated = false;
    try {
        await getLoggedInUserId(supabase);
        isAuthenticated = true;
    } catch {
        // 로그인하지 않은 경우 무시 (페이지는 볼 수 있음)
    }

    const job = await getJobById(request, params.jobId);
    return { job, success, isAuthenticated };
};

const applicationSchema = z.object({
    introduction: z.string().optional(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);
    const jobId = Number(params.jobId);

    if (isNaN(jobId)) {
        throw new Response("Invalid job ID", { status: 400 });
    }

    const formData = await request.formData();
    const { success, error, data } = applicationSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!success) {
        return {
            fieldErrors: error.flatten().fieldErrors,
        };
    }

    // TODO: job_applications 테이블이 생성되면 실제 지원 저장 로직 추가
    // 현재는 더미 처리
    console.log("Job application:", { jobId, userId, introduction: data.introduction });

    // 최소 0.5초 대기
    await new Promise(resolve => setTimeout(resolve, 500));

    return redirect(`/jobs/${jobId}?success=true`);
};

export default function JobPage({ loaderData, actionData }: Route.ComponentProps) {
    const { job, success } = loaderData;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <div>
            <div className="bg-gradient-to-tr from-primary/80 to-primary/10 h-60 w-full rounded-lg"></div>
            <div className="grid grid-cols-6 -mt-20 gap-20 items-start">
                <div className="col-span-4 space-y-10">
                    <div>
                        <div className="size-40 bg-white rounded-full overflow-hidden relative left-10 flex items-center justify-center">
                            {job.company_logo ? (
                                <>
                                    <img
                                        src={job.company_logo || ""}
                                        alt={`${job.company_name} logo`}
                                        className="w-full h-full object-contain p-4"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    <div className="fallback absolute inset-0 bg-muted items-center justify-center text-2xl font-bold hidden">
                                        {job.company_name?.charAt(0).toUpperCase()}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-2xl font-bold">
                                    {job.company_name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold">{job.position}</h1>
                        <h4 className="text-lg text-muted-foreground">{job.company_name}</h4>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant={"secondary"}>{job.job_type}</Badge>
                        <Badge variant={"secondary"}>{job.location}</Badge>
                    </div>
                    <div className="space-y-2.5">
                        <h4 className="text-2xl font-bold">Overview</h4>
                        <p className="text-md text-muted-foreground whitespace-pre-line">
                            {job.overview}
                        </p>
                    </div>
                    <div className="space-y-2.5">
                        <h4 className="text-2xl font-bold">Responsibilities</h4>
                        <p className="text-md text-muted-foreground whitespace-pre-line">
                            {job.responsibilities}
                        </p>
                    </div>
                    <div className="space-y-2.5">
                        <h4 className="text-2xl font-bold">Qualifications</h4>
                        <p className="text-md text-muted-foreground whitespace-pre-line">
                            {job.qualifications}
                        </p>
                    </div>
                    <div className="space-y-2.5">
                        <h4 className="text-2xl font-bold">Benefits</h4>
                        <p className="text-md text-muted-foreground whitespace-pre-line">
                            {job.benefits}
                        </p>
                    </div>
                    <div className="space-y-2.5">
                        <h4 className="text-2xl font-bold">Skills</h4>
                        <p className="text-md text-muted-foreground whitespace-pre-line">
                            {job.skills}
                        </p>
                    </div>
                </div>
                <div className="col-span-2 space-y-5 mt-32 sticky top-20 p-6 border rounded-lg">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Salary Range</span>
                        <span className="text-2xl font-medium">{job.salary_range}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-2xl font-medium">{job.location}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-2xl font-medium">{job.job_type}</span>
                    </div>
                    <div className="flex">
                        <span className="text-sm text-muted-foreground">
                            Posted {DateTime.fromISO(job.created_at, { zone: "utc" }).setZone("Asia/Seoul").toRelative()}
                        </span>
                    </div>
                    <Button className="w-full" asChild>
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                            Company Website
                        </a>
                    </Button>
                    {loaderData.success && (
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>제출완료</AlertDescription>
                        </Alert>
                    )}
                    <Form method="post" className="space-y-5">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Apply Now"
                            )}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}