CREATE UNIQUE INDEX IF NOT EXISTS "snippet_analysis_snippetid_unique" ON "snippet_ai_analysis" USING btree ("snippetId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "snippets_version_snippetid_iscurrent" ON "snippets_version" USING btree ("snippetId","isCurrent");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "snippets_version_snippetid" ON "snippets_version" USING btree ("snippetId");
