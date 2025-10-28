import { jsonb, pgEnum, pgTable, timestamp, uuid, text, index } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const eventType = pgEnum("event_type", [
    "product_view",
    "product_visit",
    "profile_view",
    "idea_view",
    "idea_claim",
    "post_view",
    "post_create",
    "post_like",
    "job_view",
    "job_apply",
    "team_view",
    "team_join",
    "page_view",
    "search",
    "click",
    "conversion",
]);

export const events = pgTable("events", {
    event_id: uuid("event_id").primaryKey().defaultRandom(),
    event_type: eventType("event_type").notNull(),
    user_id: uuid("user_id").references(() => profiles.profile_id, {
        onDelete: "set null", // 사용자 삭제 시 이벤트는 유지하되 user_id만 null
    }),
    session_id: text("session_id"), // 세션 추적용
    ip_address: text("ip_address"), // IP 주소 (개인정보 보호를 위해 해시화 권장)
    user_agent: text("user_agent"), // 브라우저/디바이스 정보
    referrer: text("referrer"), // 이전 페이지 URL
    event_data: jsonb("event_data"), // 이벤트별 상세 데이터
    created_at: timestamp("created_at").notNull().defaultNow(),
});

// 인덱스들은 나중에 수동으로 추가하거나 별도 마이그레이션으로 생성

// TypeScript 타입 추론
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;