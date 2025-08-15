import { z } from "zod/mini";

export const LoginSchema = z.object({
  pfId: z
    .string({ error: "Please enter a valid pfId" })
    .check(
      z.minLength(7, "pfId must be at least 7 characters"),
      z.maxLength(7, "pfId must be at most 7 characters")
    ),

  password: z
    .string({ error: "Please enter a valid password" })
    .check(
      z.regex(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      )
    ),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
