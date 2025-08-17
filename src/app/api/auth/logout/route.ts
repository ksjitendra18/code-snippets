import { AUTH_CONSTANTS } from "@/features/auth/constant";
import { logoutUser } from "@/features/auth/services";
import { aesDecrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
  try {
    const cookieStore = await cookies();

    const authCookie = cookieStore.get(AUTH_CONSTANTS.SESSION_COOKIE);
    if (!authCookie) {
      return Response.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
        },
        { status: 401 }
      );
    }

    const decryptedSessionId = aesDecrypt(
      authCookie.value,
      EncryptionPurpose.SESSION_COOKIE_SECRET
    );

    await logoutUser(Number(decryptedSessionId));
    cookieStore.delete(AUTH_CONSTANTS.SESSION_COOKIE);

    return Response.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in logout route", error);
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
