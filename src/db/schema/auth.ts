import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int({ mode: "number" }).primaryKey({}),
  pfId: text("pfId").unique().notNull(),
  password: text("password").notNull(),
  shouldChangePassword: int({ mode: "boolean" }).default(true).notNull(),
  role: text("role").notNull(),
  createdAt: int({ mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int({ mode: "timestamp" })
    .$default(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: int({ mode: "number" }).primaryKey({}),
    userId: int({ mode: "number" })
      .references(() => users.id)
      .notNull(),
    expiresAt: int({ mode: "timestamp" }).notNull(),
    createdAt: int({ mode: "timestamp" })
      .$default(() => new Date())
      .notNull(),
  },
  (table) => [index("sessions_userid").on(table.userId)]
);
