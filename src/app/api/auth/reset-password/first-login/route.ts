import { AUTH_CONSTANTS } from "@/features/auth/constant";
import { getUser } from "@/features/auth/data";
import {
  updateUserPassword,
  updateUserShouldChangePassword,
} from "@/features/auth/services/password";
import { aesDecrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { FirstTimeResetPasswordSchema } from "@/features/auth/validations/first-time-reset-password";
import { cookies } from "next/headers";
import { z } from "zod/mini";

export const POST = async (req: Request) => {
  try {
    const requestData = await req.json();
    const cookieStore = await cookies();

    const firstLoginCookieData = cookieStore.get(
      AUTH_CONSTANTS.PASSWORD_RESET_COOKIE
    );

    if (!firstLoginCookieData) {
      return Response.json(
        {
          error: {
            code: "INVALID_COOKIE",
            message: "Invalid cookie",
          },
        },
        { status: 401 }
      );
    }

    const decryptedData = aesDecrypt(
      firstLoginCookieData.value,
      EncryptionPurpose.PASSWORD_RESET
    );

    const data = JSON.parse(decryptedData);

    // !todo check nonce
    // check expiry
    if (data.expiresAt < new Date().getTime()) {
      return Response.json(
        {
          error: {
            code: "EXPIRED_COOKIE",
            message: "Expired cookie",
          },
        },
        { status: 401 }
      );
    }

    const userData = await getUser({ pfId: data.pfId });

    if (
      !userData ||
      userData.pfId !== data.pfId ||
      !userData.shouldChangePassword
    ) {
      return Response.json(
        {
          error: {
            code: "INVALID_COOKIE",
            message: "Invalid cookie",
          },
        },
        { status: 401 }
      );
    }

    const result = FirstTimeResetPasswordSchema.safeParse(requestData);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: z.treeifyError(result.error),
          },
        },
        { status: 401 }
      );
    }

    await updateUserPassword({
      pfId: userData.pfId,
      password: result.data.password,
    });

    await updateUserShouldChangePassword({
      pfId: userData.pfId,
      shouldChangePassword: false,
    });

    return Response.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in reset password route", error);
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
