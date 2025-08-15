import { db } from "@/db";
import { snippets, snippetVersions } from "@/db/schema";

export const createSnippet = async ({
  createdBy,
  language,
  title,
  description,
  code,
}: {
  createdBy: number;
  language: string;
  title: string;
  description: string;
  code: string;
}) => {
  const newSnippet = await db
    .insert(snippets)
    .values({
      createdBy,
      language,
    })
    .returning({ id: snippets.id, createdAt: snippets.createdAt });

  console.log("new snippet", newSnippet);

  if (!newSnippet[0]) throw new Error("Error creating snippet");

  await db.insert(snippetVersions).values({
    approvedBy: createdBy,
    createdBy,
    snippetId: newSnippet[0].id,
    version: "1.0.0",
    code,
    title,
    description,
  });

  return newSnippet[0];
};
