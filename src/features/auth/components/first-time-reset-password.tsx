"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod/mini";
import {
  FirstTimeResetPasswordSchema,
  FirstTimeResetPasswordSchemaType,
} from "../validations/first-time-reset-password";
import { useRouter } from "next/navigation";

export const FirstTimeResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      const result = FirstTimeResetPasswordSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!result.success) {
        setValidationIssue(z.treeifyError(result.error));
        return;
      }

      const resetPasswordResponse = await fetch(
        "/api/auth/reset-password/first-login",
        {
          method: "POST",

          body: JSON.stringify({
            password: result.data.password,
            confirmPassword: result.data.confirmPassword,
          }),
        }
      );

      if (resetPasswordResponse.status === 200) {
        const resetPasswordData = await resetPasswordResponse.json();

        if (resetPasswordData.success) {
          router.push("/snippets");
          router.refresh();
        } else {
          setValidationIssue(resetPasswordData.error);
        }
      } else {
        const error = await resetPasswordResponse.json();
        setError({
          isError: true,
          message: error.error.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [validationIssue, setValidationIssue] =
    useState<z.core.$ZodErrorTree<FirstTimeResetPasswordSchemaType> | null>(
      null
    );

  const [error, setError] = useState<{ isError: boolean; message: string }>({
    isError: false,
    message: "",
  });
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex md:max-w-1/2 px-4 mt-10 mx-auto flex-col"
      >
        <div className="mt-4">
          <label htmlFor="title" className="block">
            New Password
          </label>

          <div className="relative">
            <input
              className="border-gray-400  outline-black border-2 w-full rounded-md p-2"
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-2 top-2  cursor-pointer select-none text-gray-600"
            >
              {isPasswordVisible ? (
                <Eye className="h-6 w-6" />
              ) : (
                <EyeOff className="h-6 w-6 " />
              )}
            </button>
          </div>

          <div>
            {validationIssue?.properties?.password?.errors && (
              <>
                <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
                  {validationIssue.properties?.password?.errors}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="confirmPassword" className="block">
            Confirm New Password
          </label>

          <div className="relative">
            <input
              className="border-gray-400  outline-black border-2 w-full rounded-md p-2"
              type={isConfirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => {
                setTouched(true);
                setConfirmPassword(e.target.value);
              }}
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
              className="absolute right-2 top-2  cursor-pointer select-none text-gray-600"
            >
              {isConfirmPasswordVisible ? (
                <Eye className="h-6 w-6" />
              ) : (
                <EyeOff className="h-6 w-6 " />
              )}
            </button>

            {touched && password !== confirmPassword && (
              <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
                Passwords do not match
              </div>
            )}
          </div>

          <div>
            {validationIssue?.properties?.confirmPassword?.errors && (
              <>
                <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
                  {validationIssue.properties?.confirmPassword?.errors}
                </div>
              </>
            )}
          </div>
        </div>

        {error.isError && (
          <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
            {error.message}
          </div>
        )}

        <Button disabled={isLoading} className="my-5" type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};
