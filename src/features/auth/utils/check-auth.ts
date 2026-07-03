import { db } from "@/db";
import { AUTH_CONSTANTS } from "@/features/auth/constant";
import { aesDecrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

export async function checkAuthentication() {
  const cookiesStore = await cookies();
  try {
    const sessionToken = cookiesStore.get(AUTH_CONSTANTS.SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return { isAuthenticated: false, user: null };
    }

    const decryptedSessionToken = aesDecrypt(
      sessionToken,
      EncryptionPurpose.SESSION_COOKIE_SECRET,
    );
    const sessionId = Number(decryptedSessionToken);

    // Try to get user data from Redis cache first
    const cachedUserData = await redis.get(`session:${sessionId}`);
    if (cachedUserData) {
      const parsedUserData = JSON.parse(cachedUserData);
      return { isAuthenticated: true, user: parsedUserData };
    }

    // If not in cache, fetch from database
    const sessionData = await db.query.sessions.findFirst({
      where: {
        id: sessionId,
      },
      with: {
        user: {
          columns: {
            id: true,
            role: true,
            pfId: true,
          },
        },
      },
    });

    if (!sessionData || !sessionData.user) {
      return { isAuthenticated: false, user: null };
    }

    // Cache the user data in Redis for future requests
    await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(sessionData.user)); // Cache for 1 hour

    return { isAuthenticated: true, user: sessionData.user };
  } catch (error) {
    console.log(error);

    return { isAuthenticated: false, user: null };
  }
}

export type AuthenticationData = Awaited<
  ReturnType<typeof checkAuthentication>
>;
