import { db } from "@/db";
import { cacheLife, cacheTag } from "next/cache";

export const getAllSnippets = async ({ lang }: { lang: string }) => {
  "use cache";
  cacheLife("max");
  cacheTag(`snippet-${lang}`);
  return await db.query.snippets.findMany({
    where: {
      language: lang,
    },
    columns: { id: true },
    with: {
      versions: {
        columns: { title: true },

        where: {
          isCurrent: true,
        },
      },
    },
  });
};
