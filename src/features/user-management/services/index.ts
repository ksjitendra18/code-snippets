import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/features/auth/utils/password";
import { DEFAULT_PASSWORD } from "../constant";

import { userRolesEnum } from "../../../db/schema/auth";

export const addNewUser = async ({
  pfId,
  role,
}: {
  pfId: string;
  role: (typeof userRolesEnum.enumValues)[number];
}) => {
  const hashedPassword = await hashPassword({ password: DEFAULT_PASSWORD });
  await db.insert(users).values({
    password: hashedPassword,
    pfId,
    role,
  });
};
