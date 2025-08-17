import { searchCodeSnippets } from "@/lib/meilisearch";

interface Filters {
  language?: string;
  // add other optional properties as needed
}

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    // const { q: query = "", language = "", tags = "" } = url.searchParams;

    const q = url.searchParams.get("q");
    const language = url.searchParams.get("language");

    const filters: Filters = {};
    if (language) filters.language = language;
    // if (tags) filters.tags = tags.split(",");

    const results = await searchCodeSnippets(q ?? "", filters);

    return Response.json({
      hits: results.hits,
      totalHits: results.estimatedTotalHits,
      processingTimeMs: results.processingTimeMs,
      query: results.query,
    });
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
