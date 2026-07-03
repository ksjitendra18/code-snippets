import { Snippet, SnippetVersion } from "@/db/schema";
import { Meilisearch, SearchParams } from "meilisearch";

const client = new Meilisearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7701",
  apiKey: process.env.MEILISEARCH_API_KEY,
});

export default client;

const PREVIEW_MAX_CHARS = 300;

const truncate = (s: string, max: number) =>
  s.length <= max ? s : `${s.slice(0, max).trimEnd()}…`;

export const initializeIndex = async () => {
  const index = client.index("code-snippets");

  await index.updateSearchableAttributes([
    "title",
    "description",
    "language",
    "content",
  ]);

  await index.updateFilterableAttributes(["language", "createdAt"]);

  await index.updateSortableAttributes(["createdAt", "title"]);

  return index;
};

type NewSnippetIndex = Pick<Snippet, "id" | "language"> &
  Pick<SnippetVersion, "title" | "description" | "code"> & {
    createdAt?: string | Date | null;
  };

interface Filters {
  language?: string;
  tags?: string[];
}

export const addCodeSnippet = async (snippet: NewSnippetIndex) => {
  const index = client.index("code-snippets");

  return await index.addDocuments([
    {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      content: snippet.code,
      preview: truncate(snippet.code, PREVIEW_MAX_CHARS),
      createdAt: snippet.createdAt || new Date().toISOString(),
    },
  ]);
};

export const searchCodeSnippets = async (query: string, filters: Filters) => {
  const index = client.index("code-snippets");

  const searchParams: SearchParams = {
    q: query,
    limit: 20,
    attributesToRetrieve: [
      "id",
      "title",
      "description",
      "language",
      "content",
      "preview",
      "createdAt",
    ],
    attributesToHighlight: ["title", "description"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
  };

  const filterArray = [];
  if (filters.language) {
    filterArray.push(`language = "${filters.language}"`);
  }
  if (filters.tags && filters.tags.length > 0) {
    filterArray.push(
      `tags IN [${filters.tags.map((tag) => `"${tag}"`).join(", ")}]`,
    );
  }

  if (filterArray.length > 0) {
    searchParams.filter = filterArray;
  }

  const result = await index.search(query, searchParams);

  const hits = (result.hits as Array<Record<string, unknown>>).map((hit) => {
    const content = (hit.content as string | undefined) ?? "";
    return {
      ...hit,
      code: content,
      preview:
        (hit.preview as string | undefined) ?? truncate(content, PREVIEW_MAX_CHARS),
    };
  });

  return { ...result, hits };
};
