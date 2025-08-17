import { generateEmbedding } from "@/lib/embedding";
import { qdrantClient } from "@/lib/qdrant";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q");

    const vector = await generateEmbedding(q!);

    const collections = await qdrantClient.getCollections();
    console.log(
      "Available collections:",
      collections,
      collections.collections.map((c) => c.name)
    );

    const collectionInfo = await qdrantClient.getCollection(
      process.env.QDRANT_COLLECTION!
    );
    console.log("Collection info:", collectionInfo);

    const results = await qdrantClient.search(process.env.QDRANT_COLLECTION!, {
      vector,
      limit: 5,
      with_payload: true,
    });

    return Response.json(results);
  } catch (error) {
    console.log("Error while searching snippet", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
};
