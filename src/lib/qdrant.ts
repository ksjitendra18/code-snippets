import { Snippet, SnippetVersion } from "@/db/schema";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "./embedding";

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  port: Number(process.env.QDRANT_PORT),
});

// create collection one time only
// await qdrantClient.createCollection(process.env.QDRANT_COLLECTION!, {
//   vectors: { size: 1536, distance: "Cosine" },
// });

type NewSnippetIndex = Pick<Snippet, "id" | "language"> &
  Pick<SnippetVersion, "title" | "description" | "code">;

export const addNewSnippetToCollection = async (snippet: NewSnippetIndex) => {
  const embedding = await generateEmbedding(
    `${snippet.title} ${snippet.description} ${snippet.code}`
  );
  await qdrantClient.upsert("snippets", {
    points: [
      {
        id: snippet.id,
        vector: embedding,
        payload: {
          id: snippet.id,
          language: snippet.language,
          title: snippet.title,
        },
      },
    ],
  });
};
