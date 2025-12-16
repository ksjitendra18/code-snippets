import { db } from "@/db";
import { cacheTag } from "next/cache";

export const getAllSnippets = async ({ lang }: { lang: string }) => {
  return await db.query.snippets.findMany({
    where: {
      language: lang,
    },
    with: {
      versions: {
        where: {
          isCurrent: true,
        },
      },
    },
  });
};
