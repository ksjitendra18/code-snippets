import { FirstTimeResetPassword } from "@/features/auth/components/first-time-reset-password";
import { AUTH_CONSTANTS } from "@/features/auth/constant";
import { getUser } from "@/features/auth/data";
import { aesDecrypt, EncryptionPurpose } from "@/features/auth/utils/aes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPassword({ searchParams }: PageProps) {
  const sp = await searchParams;
  const isFirstLogin = sp["first_login"] === "true";

  const cookieStore = await cookies();

  if (isFirstLogin) {
    const firstLoginCookieData = cookieStore.get(
      AUTH_CONSTANTS.PASSWORD_RESET_COOKIE,
    );

    if (!firstLoginCookieData) {
      return redirect(`/login`);
    }

    const decryptedData = aesDecrypt(
      firstLoginCookieData.value,
      EncryptionPurpose.PASSWORD_RESET,
    );

    const data = JSON.parse(decryptedData);

    // !todo check nonce
    // check expiry

    if (data.expiresAt < new Date().getTime()) {
      return redirect(`/login`);
    }

    const userData = await getUser({ pfId: data.pfId });

    if (
      !userData ||
      userData.pfId !== data.pfId ||
      !userData.shouldChangePassword
    ) {
      return redirect(`/login`);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-5">Reset Password</h1>

      {isFirstLogin && (
        <Suspense>
          <FirstTimeResetPassword />
        </Suspense>
      )}
    </>
  );
}
