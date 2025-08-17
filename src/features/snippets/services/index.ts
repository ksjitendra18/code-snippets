import { db } from "@/db";
import { snippets, snippetVersions } from "@/db/schema";
import { generateNewVersion } from "../utils/version";
import { eq } from "drizzle-orm";

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
    isCurrent: true,
    version: "1.0.0",
    code,
    title,
    description,
  });

  return newSnippet[0];
};

export const editSnippet = async ({
  id,
  title,
  description,
  code,
  changeType,
  createdBy,
  oldVersion,
}: {
  id: number;
  title: string;
  description: string;
  code: string;
  changeType: "major" | "minor" | "patch";
  createdBy: number;
  oldVersion: string;
}) => {
  const versionNumber = generateNewVersion(oldVersion, changeType);

  // !Danger: CHECK FOR ANY ABNORMAL BEHAVIOR TODO!
  await db
    .update(snippetVersions)
    .set({
      isCurrent: false,
    })
    .where(eq(snippetVersions.snippetId, id));

  console.log("updating......................");
  console.log("code", code);
  console.log("updating......................");
  return await db
    .insert(snippetVersions)
    .values({
      approvedBy: createdBy,
      createdBy,
      snippetId: id,
      version: versionNumber,
      code,
      isCurrent: true,
      title,
      description,
    })
    .returning({
      id: snippetVersions.id,
      createdAt: snippetVersions.createdAt,
    });
};
