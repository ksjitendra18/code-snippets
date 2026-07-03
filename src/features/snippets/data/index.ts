import { db } from "@/db";
import { snippets, snippetVersions } from "@/db/schema/snippets";
import { users } from "@/db/schema/auth";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

const versionMetaColumns = {
  id: snippetVersions.id,
  title: snippetVersions.title,
  version: snippetVersions.version,
  description: snippetVersions.description,
  changeDescription: snippetVersions.changeDescription,
  createdAt: snippetVersions.createdAt,
  isCurrent: snippetVersions.isCurrent,
} as const;

export const getSnippetDataById = async (id: string | number) => {
  "use cache";
  cacheLife("max");
  cacheTag(`snippets-${id}`);

  const numericId = Number(id);

  const [snippet] = await db
    .select({
      id: snippets.id,
      language: snippets.language,
      authorPfId: users.pfId,
    })
    .from(snippets)
    .leftJoin(users, eq(snippets.createdBy, users.id))
    .where(eq(snippets.id, numericId))
    .limit(1);

  if (!snippet) return null;

  const [currentVersion] = await db
    .select({
      ...versionMetaColumns,
      code: snippetVersions.code,
      authorPfId: users.pfId,
    })
    .from(snippetVersions)
    .leftJoin(users, eq(snippetVersions.createdBy, users.id))
    .where(
      and(
        eq(snippetVersions.snippetId, numericId),
        eq(snippetVersions.isCurrent, true),
      ),
    )
    .limit(1);

  if (!currentVersion) return null;

  const versions = await db
    .select({
      ...versionMetaColumns,
      authorPfId: users.pfId,
    })
    .from(snippetVersions)
    .leftJoin(users, eq(snippetVersions.createdBy, users.id))
    .where(eq(snippetVersions.snippetId, numericId))
    .orderBy(desc(snippetVersions.createdAt));

  return {
    id: snippet.id,
    language: snippet.language,
    author: { pfId: snippet.authorPfId },
    currentVersion: {
      id: currentVersion.id,
      title: currentVersion.title,
      version: currentVersion.version,
      description: currentVersion.description,
      changeDescription: currentVersion.changeDescription,
      createdAt: currentVersion.createdAt,
      isCurrent: currentVersion.isCurrent,
      code: currentVersion.code,
      author: { pfId: currentVersion.authorPfId },
    },
    versions: versions.map((v) => ({
      id: v.id,
      title: v.title,
      version: v.version,
      description: v.description,
      changeDescription: v.changeDescription,
      createdAt: v.createdAt,
      isCurrent: v.isCurrent,
      author: { pfId: v.authorPfId },
    })),
  };
};

export async function getSnippetVersionCode(
  snippetId: number,
  versionId: number,
) {
  "use cache";
  cacheLife("max");
  cacheTag(`snippets-${snippetId}`);

  const [row] = await db
    .select({ code: snippetVersions.code })
    .from(snippetVersions)
    .where(
      and(
        eq(snippetVersions.snippetId, snippetId),
        eq(snippetVersions.id, versionId),
      ),
    )
    .limit(1);

  return row?.code ?? null;
}

export type GetSnippetDataById = NonNullable<
  Awaited<ReturnType<typeof getSnippetDataById>>
>;
