import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/redis";

export const logoutUser = async (sessionId: number) => {
  // Delete session from database
  await db.delete(sessions).where(eq(sessions.id, sessionId));
  
  // Remove cached session from Redis
  await redis.del(`session:${sessionId}`);
};
