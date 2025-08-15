import { db } from "@/db";

export const getUser = async ({ pfId }: { pfId: string }) => {
  return db.query.users.findFirst({
    where: {
      pfId,
    },
  });
};
