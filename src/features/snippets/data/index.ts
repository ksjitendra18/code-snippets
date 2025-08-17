import { db } from "@/db";

export const getSnippetDataById = async (id: string | number) => {
  return await db.query.snippets.findFirst({
    where: { id: Number(id) },
    columns: {
      id: true,
      language: true,
    },
    with: {
      author: {
        columns: {
          pfId: true,
        },
      },
      versions: {
        columns: {
          title: true,
          version: true,
          description: true,
          code: true,
          createdAt: true,
          isCurrent: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        with: {
          author: {
            columns: {
              pfId: true,
            },
          },
        },
      },
    },
  });
};

export type GetSnippetDataById = NonNullable<
  Awaited<ReturnType<typeof getSnippetDataById>>
>;
