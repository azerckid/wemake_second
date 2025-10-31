-- Add profile_id column to jobs table to track job creator
ALTER TABLE "jobs" ADD COLUMN "profile_id" uuid REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;

