import {
    jsonb,
    pgEnum,
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

const users = pgSchema("auth").table("users", {
    id: uuid().primaryKey(),
});

export const roles = pgEnum("role", [
    "developer",
    "designer",
    "marketer",
    "founder",
    "product-manager",
]);

export const profiles = pgTable("profiles", {
    profile_id: uuid()
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    avatar: text(),
    name: text().notNull(),
    username: text().notNull(),
    headline: text(),
    bio: text(),
    role: roles().default("developer").notNull(),
    stats: jsonb().$type<{
        followers: number;
        following: number;
    }>(),
    views: jsonb(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});

export const follows = pgTable("follows", {
    follower_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    following_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
});

// TypeScript 타입 추론을 위한 타입 정의
export type InsertProfile = typeof profiles.$inferInsert;
export type SelectProfile = typeof profiles.$inferSelect;

export type InsertFollow = typeof follows.$inferInsert;
export type SelectFollow = typeof follows.$inferSelect;