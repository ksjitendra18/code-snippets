import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { users } from "./auth";

export const snippets = pgTable(
  "snippets",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    language: text("language").notNull(),
    isPublic: boolean().default(true).notNull(),
    createdBy: integer()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    isApproved: boolean().default(false).notNull(),
    approvedBy: integer().references(() => users.id),

    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).$onUpdateFn(
      () => new Date().toISOString()
    ),
  },
  (t) => [index("snippets_createdby").on(t.createdBy)]
);

export const snippetVersions = pgTable(
  "snippets_version",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    changeDescription: text("change_description"),
    code: text("code").notNull(),
    version: text("version").notNull(),
    isCurrent: boolean().default(false).notNull(),
    snippetId: integer()
      .references(() => snippets.id)
      .notNull(),
    createdBy: integer()
      .references(() => users.id)
      .notNull(),
    isApproved: boolean().default(false).notNull(),
    approvedBy: integer()
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).$onUpdateFn(
      () => new Date().toISOString()
    ),
  },
  (t) => [index("snippets_version_createdby").on(t.createdBy)]
);

export type Snippet = typeof snippets.$inferSelect;
export type SnippetVersion = typeof snippetVersions.$inferSelect;

export const favoriteSnippets = pgTable(
  "favorite_snippets",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    snippetId: integer()
      .references(() => snippets.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    version: text("version").notNull().default("1.0.0"),
    isLatestVersion: boolean().default(true).notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow(),
  },
  (t) => [
    unique("unique_snippet_favorite").on(t.snippetId, t.userId),
    index("snippet_favorites_snippet").on(t.snippetId),
    index("snippet_favorites_user").on(t.userId),
  ]
);
