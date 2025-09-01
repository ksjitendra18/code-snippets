CREATE TABLE "snippet_ai_analysis" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "snippet_ai_analysis_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"snippetId" integer NOT NULL,
	"codeFunctionality" text NOT NULL,
	"optimizations" json NOT NULL,
	"additionalRecommendations" text,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "snippets_version" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "snippets_version" ADD COLUMN "change_description" text;--> statement-breakpoint
ALTER TABLE "snippet_ai_analysis" ADD CONSTRAINT "snippet_ai_analysis_snippetId_snippets_id_fk" FOREIGN KEY ("snippetId") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "snippet_analysis_snippet" ON "snippet_ai_analysis" USING btree ("snippetId");