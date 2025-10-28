-- Create enum for event types
CREATE TYPE "public"."event_type" AS ENUM('product_view', 'product_visit', 'profile_view', 'idea_view', 'idea_claim', 'post_view', 'post_create', 'post_like', 'job_view', 'job_apply', 'team_view', 'team_join', 'page_view', 'search', 'click', 'conversion');

-- Create events table
CREATE TABLE "public"."events" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" "public"."event_type" NOT NULL,
	"user_id" uuid,
	"session_id" text,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"event_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraint
ALTER TABLE "public"."events" ADD CONSTRAINT "events_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE set null ON UPDATE no action;

-- Create indexes for performance
CREATE INDEX "events_event_type_idx" ON "public"."events" ("event_type");
CREATE INDEX "events_user_id_idx" ON "public"."events" ("user_id");
CREATE INDEX "events_created_at_idx" ON "public"."events" ("created_at");
CREATE INDEX "events_session_id_idx" ON "public"."events" ("session_id");
CREATE INDEX "events_user_event_type_idx" ON "public"."events" ("user_id","event_type");
CREATE INDEX "events_type_created_at_idx" ON "public"."events" ("event_type","created_at");
