-- Create new enums
CREATE TYPE "public"."team_status" AS ENUM('recruiting', 'active', 'inactive', 'completed');
CREATE TYPE "public"."team_location" AS ENUM('remote', 'hybrid', 'onsite');

-- Drop existing team table and recreate with new schema
DROP TABLE IF EXISTS "team" CASCADE;

-- Create teams table with new schema
CREATE TABLE "teams" (
	"team_id" bigserial PRIMARY KEY NOT NULL,
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
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create team_members table
CREATE TABLE "team_members" (
	"team_member_id" bigserial PRIMARY KEY NOT NULL,
	"team_id" bigint NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"equity_percentage" integer,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL
);

-- Add constraints
ALTER TABLE "teams" ADD CONSTRAINT "team_size_check" CHECK (team_size BETWEEN 1 AND 100);
ALTER TABLE "teams" ADD CONSTRAINT "max_team_size_check" CHECK (max_team_size IS NULL OR max_team_size BETWEEN 1 AND 100);
ALTER TABLE "teams" ADD CONSTRAINT "equity_split_check" CHECK (equity_split BETWEEN 0 AND 100);
ALTER TABLE "teams" ADD CONSTRAINT "product_description_check" CHECK (LENGTH(product_description) <= 1000);

ALTER TABLE "team_members" ADD CONSTRAINT "equity_percentage_check" CHECK (equity_percentage IS NULL OR equity_percentage BETWEEN 0 AND 100);
ALTER TABLE "team_members" ADD CONSTRAINT "status_check" CHECK (status IN ('active', 'pending', 'inactive'));

-- Add foreign key constraints
ALTER TABLE "teams" ADD CONSTRAINT "teams_team_leader_id_profiles_profile_id_fk" FOREIGN KEY ("team_leader_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;

-- Create indexes
CREATE INDEX "teams_product_stage_idx" ON "teams" USING btree ("product_stage");
CREATE INDEX "teams_team_leader_idx" ON "teams" USING btree ("team_leader_id");
CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at");
CREATE INDEX "teams_status_idx" ON "teams" USING btree ("team_status");
CREATE INDEX "teams_location_idx" ON "teams" USING btree ("location");

CREATE INDEX "team_members_team_id_idx" ON "team_members" USING btree ("team_id");
CREATE INDEX "team_members_user_id_idx" ON "team_members" USING btree ("user_id");
CREATE INDEX "team_members_status_idx" ON "team_members" USING btree ("status");
