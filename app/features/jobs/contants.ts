export const JOB_TYPES = [
    {
        label: "Full-Time",
        value: "full-time",
    },
    {
        label: "Part-Time",
        value: "part-time",
    },
    {
        label: "Freelance",
        value: "freelance",
    },
    {
        label: "Internship",
        value: "internship",
    },
] as const;

export const LOCATION_TYPES = [
    {
        label: "Remote",
        value: "remote",
    },
    {
        label: "In-Person",
        value: "in-person",
    },
    {
        label: "Hybrid",
        value: "hybrid",
    },
] as const;

export const SALARY_RANGE = [
    "$0 - $50,000",
    "$50,000 - $70,000",
    "$70,000 - $100,000",
    "$100,000 - $120,000",
    "$120,000 - $150,000",
    "$150,000 - $250,000",
    "$250,000+",
] as const;

// 타입 정의
export type JobType = typeof JOB_TYPES[number]['value'];
export type JobLocation = typeof LOCATION_TYPES[number]['value'];
export type SalaryRange = typeof SALARY_RANGE[number];