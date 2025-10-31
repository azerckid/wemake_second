import { Link } from "react-router";
import type { Route } from "./+types/dashboard-jobs-page";
import { JobCard } from "~/features/jobs/components/job-card";
import { getLoggedInUserId, getUserJobs } from "../queries";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export const meta: Route.MetaFunction = () => {
    return [{ title: "My Jobs | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { supabase } = createSupabaseServerClient(request);
    const userId = await getLoggedInUserId(supabase);

    try {
        const jobs = await getUserJobs(request, userId);
        return { jobs };
    } catch (error) {
        console.error("Failed to load jobs:", error);
        return { jobs: [] };
    }
};

export default function DashboardJobsPage({ loaderData }: Route.ComponentProps) {
    const { jobs } = loaderData;

    return (
        <div className="space-y-5 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold mb-6">My Jobs</h1>
                <Link to="/jobs/submit">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                        Post New Job
                    </button>
                </Link>
            </div>
            {jobs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No jobs posted yet.</p>
                    <p className="text-muted-foreground">Post your first job to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {jobs.map((job: any) => (
                        <JobCard
                            key={job.job_id}
                            id={String(job.job_id)}
                            company={job.company_name}
                            companyLogoUrl={job.company_logo}
                            companyHq={job.company_location}
                            title={job.position}
                            postedAt={job.created_at}
                            type={job.job_type}
                            positionLocation={job.location}
                            salary={job.salary_range}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

