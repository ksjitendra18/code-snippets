import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userRolesEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "USER",
]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pfId: text().unique().notNull(),
  password: text().notNull(),
  shouldChangePassword: boolean().default(true).notNull(),
  role: userRolesEnum().notNull(),
  isBanned: boolean().default(false).notNull(),
  banReason: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" }).$onUpdateFn(() =>
    new Date().toISOString()
  ),
});

export const sessions = pgTable(
  "sessions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [index("sessions_userid").on(table.userId)]
);
