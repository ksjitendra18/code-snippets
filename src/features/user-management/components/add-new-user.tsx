"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod/mini";
import { NewUserSchema, NewUserSchemaType } from "../validation/user";
import { userRolesEnum } from "@/db/schema";

export const AddNewUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const [validationIssue, setValidationIssue] =
    useState<z.core.$ZodErrorTree<NewUserSchemaType> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError({ isError: false, message: "" });
      setSuccess(false);
      setIsLoading(true);
      setValidationIssue(null);

      const formData = new FormData(e.currentTarget);
      const pfId = formData.get("pfId") as string;
      const role = formData.get(
        "role"
      ) as (typeof userRolesEnum.enumValues)[number];

      const result = NewUserSchema.safeParse({ pfId, role });
      if (!result.success) {
        setValidationIssue(z.treeifyError(result.error));
        return;
      }

      const addNewUserResponse = await fetch("/api/user-management/user", {
        method: "POST",

        body: JSON.stringify({
          pfId: result.data.pfId,
          role: result.data.role,
        }),
      });

      if (addNewUserResponse.status === 200) {
        setSuccess(true);
      } else {
        const error = await addNewUserResponse.json();
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

  const ROLES = userRolesEnum.enumValues;
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-5">New User</h1>
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
          <label htmlFor="role" className="block">
            Role
          </label>
          <select
            className="border-gray-400 outline-black border-2 w-full rounded-md p-2"
            id="role"
            name="role"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {success && (
          <div className="mt-4 text-white bg-green-700 px-2 rounded-md py-1">
            User added successfully
          </div>
        )}

        {error.isError && (
          <div className="mt-4 text-white bg-red-700 px-2 rounded-md py-1">
            {error.message}
          </div>
        )}

        <Button disabled={isLoading} className="my-5" type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Add New User"}
        </Button>
      </form>
    </>
  );
};
