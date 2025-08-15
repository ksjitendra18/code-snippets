CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "favorite_snippets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "favorite_snippets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"snippetId" integer NOT NULL,
	"userId" integer NOT NULL,
	"version" text DEFAULT '1.0.0' NOT NULL,
	"isLatestVersion" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_snippet_favorite" UNIQUE("snippetId","userId")
);
--> statement-breakpoint
CREATE TABLE "snippets_version" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "snippets_version_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"code" text NOT NULL,
	"version" text NOT NULL,
	"isCurrent" boolean DEFAULT false NOT NULL,
	"snippetId" integer NOT NULL,
	"createdBy" integer NOT NULL,
	"isApproved" boolean DEFAULT false NOT NULL,
	"approvedBy" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "snippets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"language" text NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"createdBy" integer NOT NULL,
	"isApproved" boolean DEFAULT false NOT NULL,
	"approvedBy" integer,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pfId" text NOT NULL,
	"password" text NOT NULL,
	"shouldChangePassword" boolean DEFAULT true NOT NULL,
	"role" "user_role" NOT NULL,
	"isBanned" boolean DEFAULT false NOT NULL,
	"banReason" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	CONSTRAINT "users_pfId_unique" UNIQUE("pfId")
);
--> statement-breakpoint
ALTER TABLE "favorite_snippets" ADD CONSTRAINT "favorite_snippets_snippetId_snippets_id_fk" FOREIGN KEY ("snippetId") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_snippets" ADD CONSTRAINT "favorite_snippets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets_version" ADD CONSTRAINT "snippets_version_snippetId_snippets_id_fk" FOREIGN KEY ("snippetId") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets_version" ADD CONSTRAINT "snippets_version_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets_version" ADD CONSTRAINT "snippets_version_approvedBy_users_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_approvedBy_users_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "snippet_favorites_snippet" ON "favorite_snippets" USING btree ("snippetId");--> statement-breakpoint
CREATE INDEX "snippet_favorites_user" ON "favorite_snippets" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "snippets_version_createdby" ON "snippets_version" USING btree ("createdBy");--> statement-breakpoint
CREATE INDEX "snippets_createdby" ON "snippets" USING btree ("createdBy");--> statement-breakpoint
CREATE INDEX "sessions_userid" ON "sessions" USING btree ("userId");