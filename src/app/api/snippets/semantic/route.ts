import { generateEmbedding } from "@/lib/embedding";
import { qdrantClient } from "@/lib/qdrant";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  try {
    const now = performance.now();
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

    const processingTime = performance.now() - now;
    if (results.length === 0)
      return Response.json({
        hits: [],
        totalHits: results.length,
        processingTime,
        query: q!,
      });

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
      query: q!,
      rawResults: results,
    });
    // return Response.json({
    //   hits: results.map((r) => ({
    //     id: r.payload?.id ?? "",
    //     title: r.payload?.title ?? "",
    //     language: r.payload?.language ?? "",
    //   })),
    //   totalHits: results.length,
    //   processingTime,
    //   query: q!,
    //   rawResults: results,
    // });
  } catch (error) {
    console.log("Error while semantic searching snippet", error);
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
}
