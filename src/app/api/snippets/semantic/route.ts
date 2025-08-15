import { getEmbedding } from "@/lib/embedding";
import { qdrantClient } from "@/lib/qdrant";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q");

    const vector = await getEmbedding(q!);

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
