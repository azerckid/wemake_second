import {
    bigint,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const gptIdeas = pgTable("gpt_ideas", {
    gpt_idea_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    idea: text().notNull(),
    views: integer().notNull().default(0),
    claimed_at: timestamp(),
    claimed_by: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});

export const gptIdeasLikes = pgTable(
    "gpt_ideas_likes",
    {
        gpt_idea_id: bigint({ mode: "number" }).references(
            () => gptIdeas.gpt_idea_id,
            {
                onDelete: "cascade",
            }
        ),
        profile_id: uuid().references(() => profiles.profile_id, {
            onDelete: "cascade",
        }),
    },
    (table) => [primaryKey({ columns: [table.gpt_idea_id, table.profile_id] })]
);

// TypeScript 타입 추론
export type InsertGptIdea = typeof gptIdeas.$inferInsert;
export type SelectGptIdea = typeof gptIdeas.$inferSelect;

export type InsertGptIdeaLike = typeof gptIdeasLikes.$inferInsert;
export type SelectGptIdeaLike = typeof gptIdeasLikes.$inferSelect;