import client from "~/supa-client";

export const getJobs = async ({
    limit,
    page = 1,
    location,
    type,
    salary,
    sorting = "newest",
}: {
    limit: number;
    page?: number;
    location?: "remote" | "in-person" | "hybrid";
    type?: "full-time" | "part-time" | "freelance" | "internship";
    salary?: "$0 - $50,000" | "$50,000 - $70,000" | "$70,000 - $100,000" | "$100,000 - $120,000" | "$120,000 - $150,000" | "$150,000 - $250,000" | "$250,000+";
    sorting?: "newest" | "oldest";
}) => {
    const baseQuery = client
        .from("jobs")
        .select(
            `
    job_id,
    position,
    overview,
    company_name,
    company_logo,
    company_location,
    job_type,
    location,
    salary_range,
    created_at
    `
        )
        .order("created_at", { ascending: sorting === "oldest" })
        .range((page - 1) * limit, page * limit - 1);

    if (location) {
        baseQuery.eq("location", location);
    }
    if (type) {
        baseQuery.eq("job_type", type);
    }
    if (salary) {
        baseQuery.eq("salary_range", salary);
    }

    const { data, error } = await baseQuery;
    if (error) {
        throw error;
    }
    return data;
};

export const getJobsCount = async ({
    location,
    type,
    salary,
}: {
    location?: "remote" | "in-person" | "hybrid";
    type?: "full-time" | "part-time" | "freelance" | "internship";
    salary?: "$0 - $50,000" | "$50,000 - $70,000" | "$70,000 - $100,000" | "$100,000 - $120,000" | "$120,000 - $150,000" | "$150,000 - $250,000" | "$250,000+";
}) => {
    const baseQuery = client
        .from("jobs")
        .select("*", { count: "exact", head: true });

    if (location) {
        baseQuery.eq("location", location);
    }
    if (type) {
        baseQuery.eq("job_type", type);
    }
    if (salary) {
        baseQuery.eq("salary_range", salary);
    }

    const { count, error } = await baseQuery;
    if (error) {
        throw error;
    }
    return count || 0;
};

export const getJob = async (job_id: number) => {
    const { data, error } = await client
        .from("jobs")
        .select("*")
        .eq("job_id", job_id)
        .single();
    if (error) {
        throw error;
    }
    return data;
};