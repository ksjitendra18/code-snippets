import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const logoutUser = async (sessionId: number) => {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
};
