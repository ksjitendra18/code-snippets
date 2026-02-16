import { db } from "@/db";
import { cacheLife, cacheTag } from "next/cache";

export const getSnippetDataById = async (id: string | number) => {
  "use cache";
  cacheLife("max");
  cacheTag(`snippets-${id}`);
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
          changeDescription: true,
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
