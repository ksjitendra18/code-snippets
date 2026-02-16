import { db } from "@/db";
import { AUTH_CONSTANTS } from "@/features/auth/constant";
import { aesDecrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { cookies } from "next/headers";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const sessionData = await db.query.sessions.findFirst({
      where: {
        id: Number(decryptedSessionToken),
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

    return { isAuthenticated: true, user: sessionData.user };
  } catch (error) {
    console.log(error);

    return { isAuthenticated: false, user: null };
  }
}

export type AuthenticationData = Awaited<
  ReturnType<typeof checkAuthentication>
>;
