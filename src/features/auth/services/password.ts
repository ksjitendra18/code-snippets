import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/password";

export const updateUserPassword = async ({
  pfId,
  password,
}: {
  pfId: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword({ password });
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.pfId, pfId));
};

export const updateUserShouldChangePassword = async ({
  pfId,
  shouldChangePassword,
}: {
  pfId: string;
  shouldChangePassword: boolean;
}) => {
  await db
    .update(users)
    .set({ shouldChangePassword })
    .where(eq(users.pfId, pfId));
};
