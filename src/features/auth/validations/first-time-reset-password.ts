import { z } from "zod/mini";

export const FirstTimeResetPasswordSchema = z.object({
  password: z
    .string({ error: "Please enter a valid password" })
    .check(
      z.regex(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      )
    ),
  confirmPassword: z
    .string({ error: "Please enter a valid password" })
    .check(
      z.regex(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      )
    ),
});

export type FirstTimeResetPasswordSchemaType = z.infer<
  typeof FirstTimeResetPasswordSchema
>;
