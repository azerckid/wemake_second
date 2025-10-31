CREATE TYPE "public"."event_type" AS ENUM('product_view', 'product_visit', 'profile_view', 'idea_view', 'idea_claim', 'post_view', 'post_create', 'post_like', 'job_view', 'job_apply', 'team_view', 'team_join', 'page_view', 'search', 'click', 'conversion');--> statement-breakpoint
CREATE TYPE "public"."team_location" AS ENUM('remote', 'hybrid', 'onsite');--> statement-breakpoint
CREATE TYPE "public"."team_status" AS ENUM('recruiting', 'active', 'inactive', 'completed');--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" "event_type" NOT NULL,
	"user_id" uuid,
	"session_id" text,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"event_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"team_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "teams_team_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"product_name" text NOT NULL,
	"team_size" integer NOT NULL,
	"max_team_size" integer,
	"equity_split" integer NOT NULL,
	"product_stage" "product_stage" NOT NULL,
	"team_status" "team_status" DEFAULT 'recruiting' NOT NULL,
	"location" "team_location" DEFAULT 'remote' NOT NULL,
	"roles" text NOT NULL,
	"tech_stack" text[],
	"product_description" text NOT NULL,
	"team_leader_id" uuid NOT NULL,
	"application_deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_size_check" CHECK ("teams"."team_size" BETWEEN 1 AND 100),
	CONSTRAINT "max_team_size_check" CHECK ("teams"."max_team_size" IS NULL OR "teams"."max_team_size" BETWEEN 1 AND 100),
	CONSTRAINT "equity_split_check" CHECK ("teams"."equity_split" BETWEEN 0 AND 100),
	CONSTRAINT "product_description_check" CHECK (LENGTH("teams"."product_description") <= 1000)
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"team_member_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "team_members_team_member_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"team_id" bigint NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"equity_percentage" integer,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	CONSTRAINT "equity_percentage_check" CHECK ("team_members"."equity_percentage" IS NULL OR "team_members"."equity_percentage" BETWEEN 0 AND 100),
	CONSTRAINT "status_check" CHECK ("team_members"."status" IN ('active', 'pending', 'inactive'))
);
--> statement-breakpoint
ALTER TABLE "team" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "team" CASCADE;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_profile_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "post_upvotes" ALTER COLUMN "post_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post_upvotes" ALTER COLUMN "profile_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "topic_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "profile_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_team_leader_id_profiles_profile_id_fk" FOREIGN KEY ("team_leader_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "teams_product_stage_idx" ON "teams" USING btree ("product_stage");--> statement-breakpoint
CREATE INDEX "teams_team_leader_idx" ON "teams" USING btree ("team_leader_id");--> statement-breakpoint
CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "teams_status_idx" ON "teams" USING btree ("team_status");--> statement-breakpoint
CREATE INDEX "teams_location_idx" ON "teams" USING btree ("location");--> statement-breakpoint
CREATE INDEX "team_members_team_id_idx" ON "team_members" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_members_user_id_idx" ON "team_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "team_members_status_idx" ON "team_members" USING btree ("status");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_to_profiles" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;