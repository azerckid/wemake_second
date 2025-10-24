import { data, Link, useSearchParams } from "react-router";

import type { Route } from "./+types/jobs-page";

import { Hero } from "~/common/components/hero";
import { JobCard } from "../components/job-card";
import { Button } from "~/common/components/ui/button";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "../contants";
import { cn } from "~/lib/utils";
import { getJobs } from "../queries";
import { z } from "zod";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Jobs | wemake" },
        { name: "description", content: "Find your dream job at wemake" },
    ];
};

const searchParamsSchema = z.object({
    type: z
        .enum(JOB_TYPES.map((type) => type.value) as [string, ...string[]])
        .optional(),
    location: z
        .enum(LOCATION_TYPES.map((type) => type.value) as [string, ...string[]])
        .optional(),
    salary: z.enum(SALARY_RANGE).optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const { success, data: parsedData } = searchParamsSchema.safeParse(
        Object.fromEntries(url.searchParams)
    );
    if (!success) {
        throw data(
            {
                error_code: "invalid_search_params",
                message: "Invalid search params",
            },
            { status: 400 }
        );
    }
    const jobs = await getJobs({
        limit: 40,
        location: parsedData.location as "remote" | "in-person" | "hybrid" | undefined,
        type: parsedData.type as "full-time" | "part-time" | "freelance" | "internship" | undefined,
        salary: parsedData.salary as "$0 - $50,000" | "$50,000 - $70,000" | "$70,000 - $100,000" | "$100,000 - $120,000" | "$120,000 - $150,000" | "$150,000 - $250,000" | "$250,000+" | undefined,
    });
    return { jobs };
};

export default function JobsPage({ loaderData }: Route.ComponentProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const onFilterClick = (key: string, value: string) => {
        searchParams.set(key, value);
        setSearchParams(searchParams);
    };
    return (
        <div className="space-y-20">
            <Hero title="Jobs" subtitle="Companies looking for makers" />
            <div className="grid grid-cols-1 xl:grid-cols-6 gap-20 items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-5">
                    {
                        loaderData.jobs.map((job) => (
                            <JobCard
                                key={job.job_id}
                                id={job.job_id.toString()}
                                company={job.company_name}
                                companyLogoUrl={job.company_logo}
                                companyHq={job.company_location}
                                title={job.position}
                                postedAt={job.created_at}
                                type={job.job_type}
                                positionLocation={job.location}
                                salary={job.salary_range}
                            />
                        ))
                    }
                </div>
                <div className="xl:col-span-2 sticky top-20 flex flex-col gap-10">
                    <div className="flex flex-col items-start gap-2.5">
                        <h4 className="text-sm text-muted-foreground font-bold">Type</h4>
                        <div className="flex flex-wrap gap-2">
                            {JOB_TYPES.map((type) => (
                                <Button
                                    key={type.value}
                                    variant={"outline"}
                                    onClick={() => onFilterClick("type", type.value)}
                                    className={cn(
                                        type.value === searchParams.get("type") ? "bg-accent" : ""
                                    )}
                                >
                                    {type.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2.5">
                        <h4 className="text-sm text-muted-foreground font-bold">
                            Location
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {LOCATION_TYPES.map((type) => (
                                <Button
                                    key={type.value}
                                    variant={"outline"}
                                    onClick={() => onFilterClick("location", type.value)}
                                    className={cn(
                                        type.value === searchParams.get("location")
                                            ? "bg-accent"
                                            : ""
                                    )}
                                >
                                    {type.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2.5">
                        <h4 className="text-sm text-muted-foreground font-bold">
                            Salary Range
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {SALARY_RANGE.map((range) => (
                                <Button
                                    key={range}
                                    variant={"outline"}
                                    onClick={() => onFilterClick("salary", range)}
                                    className={cn(
                                        range === searchParams.get("salary") ? "bg-accent" : ""
                                    )}
                                >
                                    {range}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}