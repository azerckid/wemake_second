import {
    bigint,
    jsonb,
    primaryKey,
    pgEnum,
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { products } from "../products/schema";
import { posts } from "../community/schema";

// auth 스키마 정의
const authSchema = pgSchema("auth");

// auth.users 테이블 (Supabase auth.users 참조용)
const users = authSchema.table("users", {
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
    follower_id: uuid()
        .references(() => profiles.profile_id, {
            onDelete: "cascade",
        })
        .notNull(),
    following_id: uuid()
        .references(() => profiles.profile_id, {
            onDelete: "cascade",
        })
        .notNull(),
    created_at: timestamp().notNull().defaultNow(),
});

export const notificationType = pgEnum("notification_type", [
    "follow",
    "review",
    "reply",
]);

export const notifications = pgTable("notifications", {
    notification_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    source_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    product_id: bigint({ mode: "number" }).references(() => products.product_id, {
        onDelete: "cascade",
    }),
    post_id: bigint({ mode: "number" }).references(() => posts.post_id, {
        onDelete: "cascade",
    }),
    target_id: uuid()
        .references(() => profiles.profile_id, {
            onDelete: "cascade",
        })
        .notNull(),
    seen: boolean().default(false).notNull(),
    type: notificationType().notNull(),
    created_at: timestamp().notNull().defaultNow(),
});

export const messageRooms = pgTable("message_rooms", {
    message_room_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    created_at: timestamp().notNull().defaultNow(),
});

export const messageRoomMembers = pgTable(
    "message_room_members",
    {
        message_room_id: bigint({ mode: "number" }).references(
            () => messageRooms.message_room_id,
            {
                onDelete: "cascade",
            }
        ),
        profile_id: uuid().references(() => profiles.profile_id, {
            onDelete: "cascade",
        }),
        created_at: timestamp().notNull().defaultNow(),
    },
    (table) => [
        primaryKey({ columns: [table.message_room_id, table.profile_id] }),
    ]
);

export const messages = pgTable("messages", {
    message_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    message_room_id: bigint({ mode: "number" })
        .references(() => messageRooms.message_room_id, {
            onDelete: "cascade",
        })
        .notNull(),
    sender_id: uuid()
        .references(() => profiles.profile_id, {
            onDelete: "cascade",
        })
        .notNull(),
    content: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
});

// TypeScript 타입 추론을 위한 타입 정의
export type InsertProfile = typeof profiles.$inferInsert;
export type SelectProfile = typeof profiles.$inferSelect;

export type InsertFollow = typeof follows.$inferInsert;
export type SelectFollow = typeof follows.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type SelectNotification = typeof notifications.$inferSelect;

export type InsertMessageRoom = typeof messageRooms.$inferInsert;
export type SelectMessageRoom = typeof messageRooms.$inferSelect;

export type InsertMessageRoomMember = typeof messageRoomMembers.$inferInsert;
export type SelectMessageRoomMember = typeof messageRoomMembers.$inferSelect;

export type InsertMessage = typeof messages.$inferInsert;
export type SelectMessage = typeof messages.$inferSelect;