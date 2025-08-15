"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginSchema, LoginSchemaType } from "../validations/login";
import { z } from "zod/v4-mini";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: "",
  });

  const [validationIssue, setValidationIssue] = useState<z.core.$ZodErrorTree<
    LoginSchemaType,
    string
  > | null>(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      setValidationIssue(null);
      e.preventDefault();

      setError({ isError: false, message: "" });

      const formData = new FormData(e.currentTarget);

      const pfId = formData.get("pfId") as string;
      const password = formData.get("password") as string;

      const result = LoginSchema.safeParse({ pfId, password });

      if (!result.success) {
        setValidationIssue(z.treeifyError(result.error));
        return;
      }

      const resp = await fetch("/api/auth/login", {
        method: "POST",

        body: JSON.stringify({
          pfId,
          password,
        }),
      });

      if (resp.status === 200) {
        router.push("/snippets");
        router.refresh();
      } else {
        const error = await resp.json();
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
  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-10 ">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex md:max-w-1/2 px-4 mt-10 mx-auto flex-col"
      >
        <div className="mt-4">
          <label htmlFor="title" className="block">
            PF ID
          </label>
          <input
            className="border-gray-400 outline-black border-2 w-full rounded-md p-2"
            type="text"
            id="pfId"
            name="pfId"
            placeholder="PF ID"
          />

          <div>
            {validationIssue?.properties?.pfId?.errors && (
              <>
                <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
                  {validationIssue.properties?.pfId?.errors}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="title" className="block">
            Password
          </label>

          <div className="relative">
            <input
              className="border-gray-400  outline-black border-2 w-full rounded-md p-2"
              type={isPasswordVisible ? "text" : "password"}
              id="password"
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

        {error.isError && (
          <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
            {error.message}
          </div>
        )}

        <Button disabled={isLoading} className="my-5" type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </>
  );
}
