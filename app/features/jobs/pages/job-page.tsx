import type { Route } from "./+types/job-page";
import { Link } from "react-router";

import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { getJobById } from "../queries";
import { DateTime } from "luxon";

export const meta: Route.MetaFunction = () => {
    return [{ title: "Job Details | wemake" }];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
    const job = await getJobById(params.jobId);
    return { job };
};

export default function JobPage({ loaderData }: Route.ComponentProps) {
    const { job } = loaderData;
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
                            Posted {DateTime.fromISO(job.created_at).toRelative()}
                        </span>
                    </div>
                    <Button className="w-full" asChild>
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                            Company Website
                        </a>
                    </Button>
                    <Button className="w-full" asChild>
                        <Link to="/jobs/submit">
                            Apply Now
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}