import { bigint, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

// 더 간단한 enum 정의 방식
export const jobTypes = pgEnum("job_type", [
    "full-time",
    "part-time",
    "freelance",
    "internship"
]);

export const locations = pgEnum("location", [
    "remote",
    "in-person",
    "hybrid"
]);

export const salaryRanges = pgEnum("salary_range", [
    "$0 - $50,000",
    "$50,000 - $70,000",
    "$70,000 - $100,000",
    "$100,000 - $120,000",
    "$120,000 - $150,000",
    "$150,000 - $250,000",
    "$250,000+"
]);

export const jobs = pgTable("jobs", {
    job_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    position: text().notNull(),
    overview: text().notNull(),
    responsibilities: text().notNull(),
    qualifications: text().notNull(),
    benefits: text().notNull(),
    skills: text().notNull(),
    company_name: text().notNull(),
    company_logo: text().notNull(),
    company_location: text().notNull(),
    apply_url: text().notNull(),
    job_type: jobTypes().notNull(),
    location: locations().notNull(),
    salary_range: salaryRanges().notNull(),
    profile_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});

// TypeScript 타입 추론을 위한 타입 정의
export type InsertJob = typeof jobs.$inferInsert;
export type SelectJob = typeof jobs.$inferSelect;