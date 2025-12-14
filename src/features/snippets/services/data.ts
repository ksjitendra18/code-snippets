import { db } from "@/db";

export const getAllSnippets = async ({ lang }: { lang: string }) => {
  "use cache";
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
