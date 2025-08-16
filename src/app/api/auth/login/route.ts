import {
  AUTH_CONSTANTS,
  PASSWORD_RESET_COOKIE_TIMEOUT,
} from "@/features/auth/constant";
import { getUser } from "@/features/auth/data";
import { createSession } from "@/features/auth/services/session";
import { aesEncrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { generateNonce } from "@/features/auth/utils/nonce";
import { verifyPassword } from "@/features/auth/utils/password";
import { LoginSchema } from "@/features/auth/validations/login";

import { cookies } from "next/headers";
import { z } from "zod/mini";

export const POST = async (req: Request) => {
  try {
    const requestData = await req.json();

    const result = LoginSchema.safeParse(requestData);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: z.flattenError(result.error),
          },
        },
        { status: 401 }
      );
    }

    const { pfId, password } = result.data;

    const existingUser = await getUser({ pfId });

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

    const cookieStore = await cookies();

    if (existingUser.shouldChangePassword) {
      const expiresAt = new Date().getTime() + PASSWORD_RESET_COOKIE_TIMEOUT;

      const data = {
        pfId: existingUser.pfId,
        nonce: generateNonce(),
        expiresAt,
      };
      const encryptedData = aesEncrypt(
        JSON.stringify(data),
        EncryptionPurpose.PASSWORD_RESET
      );

      cookieStore.set(AUTH_CONSTANTS.PASSWORD_RESET_COOKIE, encryptedData, {
        expires: new Date(expiresAt),
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return Response.json(
        {
          success: true,
          redirectTo: `/reset-password?first_login=true`,
        },
        { status: 200 }
      );
    }

    const { session, expiresAt } = await createSession({
      userId: existingUser.id,
    });

    const encryptedSessionId = aesEncrypt(
      session.id.toString(),
      EncryptionPurpose.SESSION_COOKIE_SECRET
    );

    

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
    console.log("Error in login route", error);
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
