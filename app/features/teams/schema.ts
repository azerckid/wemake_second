import {
    bigint,
    check,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "../users/schema";

export const productStage = pgEnum("product_stage", [
    "idea",
    "prototype",
    "mvp",
    "product"
]);

export const teamStatus = pgEnum("team_status", [
    "recruiting",
    "active",
    "inactive",
    "completed"
]);

export const teamLocation = pgEnum("team_location", [
    "remote",
    "hybrid",
    "onsite"
]);

export const team = pgTable(
    "teams",
    {
        team_id: bigint({ mode: "number" })
            .primaryKey()
            .generatedAlwaysAsIdentity(),
        product_name: text().notNull(),
        team_size: integer().notNull(),
        max_team_size: integer(),
        equity_split: integer().notNull(),
        product_stage: productStage().notNull(),
        team_status: teamStatus().notNull().default("recruiting"),
        location: teamLocation().notNull().default("remote"),
        roles: text().notNull(),
        tech_stack: text().array(), // 기술 스택 배열
        product_description: text().notNull(),
        team_leader_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
        application_deadline: timestamp(),
        created_at: timestamp().notNull().defaultNow(),
        updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        check("team_size_check", sql`${table.team_size} BETWEEN 1 AND 100`),
        check("max_team_size_check", sql`${table.max_team_size} IS NULL OR ${table.max_team_size} BETWEEN 1 AND 100`),
        check("equity_split_check", sql`${table.equity_split} BETWEEN 0 AND 100`),
        check(
            "product_description_check",
            sql`LENGTH(${table.product_description}) <= 1000`
        ),
        // 인덱스 추가
        index("teams_product_stage_idx").on(table.product_stage),
        index("teams_team_leader_idx").on(table.team_leader_id),
        index("teams_created_at_idx").on(table.created_at),
        index("teams_status_idx").on(table.team_status),
        index("teams_location_idx").on(table.location),
    ]
);

// 팀 멤버 관계 테이블
export const teamMembers = pgTable(
    "team_members",
    {
        team_member_id: bigint({ mode: "number" })
            .primaryKey()
            .generatedAlwaysAsIdentity(),
        team_id: bigint({ mode: "number" })
            .references(() => team.team_id, { onDelete: "cascade" })
            .notNull(),
        user_id: uuid()
            .references(() => profiles.profile_id, { onDelete: "cascade" })
            .notNull(),
        role: text().notNull(),
        equity_percentage: integer(),
        joined_at: timestamp().notNull().defaultNow(),
        status: varchar("status", { length: 20 }).notNull().default("active"), // active, pending, inactive
    },
    (table) => [
        check("equity_percentage_check", sql`${table.equity_percentage} IS NULL OR ${table.equity_percentage} BETWEEN 0 AND 100`),
        check("status_check", sql`${table.status} IN ('active', 'pending', 'inactive')`),
        // 인덱스 추가
        index("team_members_team_id_idx").on(table.team_id),
        index("team_members_user_id_idx").on(table.user_id),
        index("team_members_status_idx").on(table.status),
    ]
);

// TypeScript 타입 추론
export type InsertTeam = typeof team.$inferInsert;
export type SelectTeam = typeof team.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type SelectTeamMember = typeof teamMembers.$inferSelect;