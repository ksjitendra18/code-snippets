import { Snippet, SnippetVersion } from "@/db/schema";
import { MeiliSearch, SearchParams } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7701",
  apiKey: process.env.MEILISEARCH_API_KEY,
});

export default client;

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

// type NewSnippetIndex = Pick<
//   Snippet,
//   "id" | "title" | "description" | "language" | "code" | "createdAt"
// >;
type NewSnippetIndex = Pick<Snippet, "id" | "language" | "createdAt"> &
  Pick<SnippetVersion, "title" | "description" | "code">;

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
      createdAt: snippet.createdAt || new Date().toISOString(),
    },
  ]);
};

export const searchCodeSnippets = async (query: string, filters: Filters) => {
  const index = client.index("code-snippets");

  const searchParams: SearchParams = {
    q: query,
    limit: 20,
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
      `tags IN [${filters.tags.map((tag) => `"${tag}"`).join(", ")}]`
    );
  }

  if (filterArray.length > 0) {
    searchParams.filter = filterArray;
  }

  return await index.search(query, searchParams);
};
