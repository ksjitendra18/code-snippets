import { generateEmbedding } from "@/lib/embedding";
import { qdrantClient } from "@/lib/qdrant";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || !q.trim()) {
    return Response.json(
      { error: { code: "MISSING_QUERY", message: "Query is required" } },
      { status: 400 },
    );
  }

  const collection = process.env.QDRANT_COLLECTION;
  if (!collection) {
    return Response.json(
      { error: { code: "SERVER_ERROR", message: "Collection not configured" } },
      { status: 500 },
    );
  }

  const now = performance.now();

  try {
    const vector = await generateEmbedding(q);

    const results = await qdrantClient.search(collection, {
      vector,
      limit: 5,
      with_payload: true,
    });

    const processingTime = performance.now() - now;

    if (results.length === 0) {
      return Response.json({
        hits: [],
        totalHits: 0,
        processingTime,
        query: q,
      });
    }

    const modifiedResults = results
      .filter((r) => r.score > 0.3)
      .map((r) => ({
        id: r.payload?.id ?? "",
        title: r.payload?.title ?? "",
        language: r.payload?.language ?? "",
        score: r.score,
      }));

    return Response.json({
      hits: modifiedResults,
      totalHits: modifiedResults.length,
      processingTime,
      query: q,
    });
  } catch (error) {
    console.error("Error while semantic searching snippet", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 },
    );
  }
}
