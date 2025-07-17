import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { AUTH_CONSTANTS } from "@/features/auth/constant";
import { aesEncrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { verifyPassword } from "@/features/auth/utils/password";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const { pfId, password } = await req.json();

    const existingUser = await db.query.users.findFirst({
      where: {
        pfId,
      },
    });

    if (!existingUser) {
      return Response.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid credentials",
          },
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword({
      enteredPassword: password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      return Response.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid credentials",
          },
        },
        { status: 401 }
      );
    }

    const now = new Date().getTime();
    const expiresAt = now + 1000 * 60 * 60 * 24 * 7; // 7 days

    const newSession = await db
      .insert(sessions)
      .values({
        expiresAt: new Date(expiresAt),
        userId: existingUser.id,
      })
      .returning({ id: sessions.id });

    const encryptedSessionId = aesEncrypt(
      newSession[0].id.toString(),
      EncryptionPurpose.SESSION_COOKIE_SECRET
    );

    const cookieStore = await cookies();

    cookieStore.set(AUTH_CONSTANTS.SESSION_COOKIE, encryptedSessionId, {
      expires: new Date(expiresAt),
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return Response.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
};
