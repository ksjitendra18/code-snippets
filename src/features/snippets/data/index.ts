import { db } from "@/db";

export const getSnippetDataById = async (id: string) => {
  return await db.query.snippets.findFirst({
    where: { id: Number(id) },
    columns: {
      title: true,
    },
  });
};



export type GetSnippetDataById = Awaited<ReturnType<typeof getSnippetDataById>>;
