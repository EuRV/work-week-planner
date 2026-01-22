CREATE TYPE "public"."day_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"day" "day_enum" NOT NULL,
	"time" varchar(5),
	"description" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "day_idx" ON "events" USING btree ("day");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "updated_at_idx" ON "events" USING btree ("updated_at");