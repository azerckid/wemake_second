import type { Config } from "drizzle-kit";

export default {
    schema: "./app/features/**/schema.ts",
    out: "./app/migrations",
    dialect: "postgresql" as const,
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    } as const,
} satisfies Config;
