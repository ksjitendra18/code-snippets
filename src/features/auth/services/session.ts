import { db } from "@/db";
import { sessions } from "@/db/schema";
import { AUTH_COOKIE_TIMEOUT } from "../constant";

export const createSession = async ({ userId }: { userId: number }) => {
  const now = new Date().getTime();
  const expiresAt = now + AUTH_COOKIE_TIMEOUT;

  const session = await db
    .insert(sessions)
    .values({
      expiresAt: new Date(expiresAt),
      userId,
    })
    .returning({ id: sessions.id });

  return { session: session?.[0], expiresAt };
};
