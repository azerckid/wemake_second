import {
    bigint,
    check,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const productStage = pgEnum("product_stage", [
    "idea",
    "prototype",
    "mvp",
    "product"
]);

export const team = pgTable(
    "team",
    {
        team_id: bigint({ mode: "number" })
            .primaryKey()
            .generatedAlwaysAsIdentity(),
        product_name: text().notNull(),
        team_size: integer().notNull(),
        equity_split: integer().notNull(),
        product_stage: productStage().notNull(),
        roles: text().notNull(),
        product_description: text().notNull(),
        created_at: timestamp().notNull().defaultNow(),
        updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        check("team_size_check", sql`${table.team_size} BETWEEN 1 AND 100`),
        check("equity_split_check", sql`${table.equity_split} BETWEEN 1 AND 100`),
        check(
            "product_description_check",
            sql`LENGTH(${table.product_description}) <= 200`
        ),
    ]
);

// TypeScript 타입 추론
export type InsertTeam = typeof team.$inferInsert;
export type SelectTeam = typeof team.$inferSelect;