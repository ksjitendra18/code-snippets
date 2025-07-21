import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const snippets = sqliteTable(
  "snippets",
  {
    id: int({ mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    code: text("code").notNull(),
    language: text("language").notNull(),
    createdBy: int({ mode: "number" })
      .references(() => users.id)
      .notNull(),
    isApproved: int({ mode: "boolean" }).default(false).notNull(),
    isDeleted: int({ mode: "boolean" }).default(false).notNull(),
    createdAt: int({ mode: "timestamp" })
      .$default(() => new Date())
      .notNull(),
    updatedAt: int({ mode: "timestamp" })
      .$default(() => new Date())
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (t) => [index("snippets_createdby").on(t.createdBy)]
);

export type Snippet = typeof snippets.$inferSelect

export const favoriteSnippets = sqliteTable(
  "favorite_snippets",
  {
    id: int({ mode: "number" }).primaryKey({ autoIncrement: true }),
    snippetId: int({ mode: "number" })
      .references(() => snippets.id, { onDelete: "cascade" })
      .notNull(),
    userId: int({ mode: "number" })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    version: text("version").notNull().default("1.0.0"),
    isLatestVersion: int({ mode: "boolean" }).default(true).notNull(),

    createdAt: int({ mode: "timestamp" })
      .$default(() => new Date())
      .notNull(),
  },
  (t) => [
    unique("unique_snippet_favorite").on(t.snippetId, t.userId),
    index("snippet_favorites_snippet").on(t.snippetId),
    index("snippet_favorites_user").on(t.userId),
  ]
);

export const snippetVersions = sqliteTable(
  "snippet_versions",
  {
    id: int({ mode: "number" }).primaryKey({ autoIncrement: true }),
    snippetId: int({ mode: "number" })
      .references(() => snippets.id, { onDelete: "cascade" })
      .notNull(),
    version: text("version").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    code: text("code").notNull(),
    changeLog: text("change_log"), // What changed in this version
    createdBy: int({ mode: "number" })
      .references(() => users.id)
      .notNull(),
    createdAt: int({ mode: "timestamp" })
      .$default(() => new Date())
      .notNull(),
  },
  (t) => [
    unique("unique_snippet_version").on(t.snippetId, t.version),
    index("snippet_versions_snippet").on(t.snippetId),
    index("snippet_versions_version").on(t.version),
    index("snippet_versions_created_at").on(t.createdAt),
  ]
);
