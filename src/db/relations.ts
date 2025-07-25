import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
  users: {
    snippets: r.many.snippets(),
    session: r.one.sessions({
      from: r.users.id,
      to: r.sessions.userId,
    }),
  },
  snippets: {
    author: r.one.users({
      from: r.snippets.createdBy,
      to: r.users.id,
    }),
  },
}));
