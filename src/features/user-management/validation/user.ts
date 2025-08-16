import { userRolesEnum } from "@/db/schema";
import { z } from "zod/mini";

export const NewUserSchema = z.object({
  pfId: z
    .string({ error: "Please enter a valid pfId" })
    .check(
      z.minLength(7, "pfId must be at least 7 characters"),
      z.maxLength(7, "pfId must be at most 7 characters")
    ),
  role: z.enum(userRolesEnum.enumValues, {
    error: "Please select a valid role",
  }),
});

export type NewUserSchemaType = z.infer<typeof NewUserSchema>;
