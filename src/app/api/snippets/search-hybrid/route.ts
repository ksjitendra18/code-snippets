import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "@/lib/embedding";
import { qdrantClient } from "@/lib/qdrant";

interface SearchFilters {
  language?: string;
  tags?: string[];
}

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags?: string[];
  createdAt: string;
}

interface HybridSearchResult extends CodeSnippet {
  relevanceScore: number;
  meilisearchScore?: number;
  qdrantScore?: number;
  searchSource: "meilisearch" | "qdrant" | "hybrid";
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const language = searchParams.get("language") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const enableSemantic = searchParams.get("semantic") !== "false";

    const filters: SearchFilters = {
      language: language || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    // Determine search strategy
    const isNaturalLanguage =
      query.length > 10 ||
      /\b(how to|find|create|make|build|implement|what is|example of|show me)\b/i.test(
        query
      );

    const useSemanticSearch = enableSemantic && isNaturalLanguage;

    let meilisearchResults: CodeSnippet[] = [];
    let qdrantResults: Array<{
      id: string;
      score: number;
      payload: CodeSnippet;
    }> = [];

    // Parallel search execution
    const searchPromises: Promise<void>[] = [];

    // 1. Meilisearch (keyword search)
    searchPromises.push(
      searchMeilisearch(query, filters)
        .then((results) => {
          meilisearchResults = results.hits || [];
        })
        .catch((error) => {
          console.error("Meilisearch error:", error);
          meilisearchResults = [];
        })
    );

    // 2. Qdrant (semantic search)
    if (useSemanticSearch) {
      searchPromises.push(
        searchQdrant(query, filters)
          .then((results) => {
            qdrantResults = results;
          })
          .catch((error) => {
            console.error("Qdrant error:", error);
            qdrantResults = [];
          })
      );
    }

    await Promise.all(searchPromises);

    // 3. Fuse results
    const fusedResults = fuseResults(meilisearchResults, qdrantResults, {
      semanticWeight: 0.6,
      keywordWeight: 0.4,
      maxResults: 20,
    });

    const processingTimeMs = performance.now() - startTime;

    return NextResponse.json({
      results: fusedResults,
      totalHits: fusedResults.length,
      processingTimeMs,
      searchStrategy: useSemanticSearch ? "hybrid" : "keyword-only",
      query,
    });
  } catch (error) {
    console.error("Hybrid search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

async function searchMeilisearch(query: string, filters: SearchFilters) {
  const params = new URLSearchParams({
    q: query,
    ...(filters.language && { language: filters.language }),
    ...(filters.tags &&
      filters.tags.length > 0 && { tags: filters.tags.join(",") }),
  });

  const response = await fetch(
    `http://localhost:3000/api/snippets/search?${params}`
  );
  return await response.json();
}

async function searchQdrant(query: string, filters: SearchFilters) {
  try {
    const embedding = await generateEmbedding(query);

    // Build Qdrant filter
    const qdrantFilter: any = {
      must: [],
    };

    if (filters.language) {
      qdrantFilter.must.push({
        key: "language",
        match: { value: filters.language },
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      qdrantFilter.must.push({
        key: "tags",
        match: { any: filters.tags },
      });
    }

    const searchResult = await qdrantClient.search("snippets", {
      vector: embedding,
      filter: qdrantFilter.must.length > 0 ? qdrantFilter : undefined,
      limit: 20,
      score_threshold: 0.7,
      with_payload: true,
    });

    return searchResult.map((result) => ({
      id: result.id as string,
      score: result.score || 0,
      payload: result.payload as CodeSnippet,
    }));
  } catch (error) {
    console.error("Qdrant search error:", error);
    return [];
  }
}

function fuseResults(
  meilisearchResults: CodeSnippet[],
  qdrantResults: Array<{ id: string; score: number; payload: CodeSnippet }>,
  config: { semanticWeight: number; keywordWeight: number; maxResults: number }
): HybridSearchResult[] {
  const fusedResults = new Map<string, HybridSearchResult>();

  // Process Meilisearch results
  meilisearchResults.forEach((snippet, index) => {
    const meilisearchScore =
      (meilisearchResults.length - index) / meilisearchResults.length;

    fusedResults.set(snippet.id, {
      ...snippet,
      relevanceScore: meilisearchScore * config.keywordWeight,
      meilisearchScore,
      searchSource: "meilisearch",
    });
  });

  // Process Qdrant results
  qdrantResults.forEach((result) => {
    const existingResult = fusedResults.get(result.id);
    const qdrantScore = result.score;

    if (existingResult) {
      // Combine scores for items found in both searches
      existingResult.relevanceScore =
        (existingResult.meilisearchScore || 0) * config.keywordWeight +
        qdrantScore * config.semanticWeight;
      existingResult.qdrantScore = qdrantScore;
      existingResult.searchSource = "hybrid";
    } else {
      // Add Qdrant-only results
      fusedResults.set(result.id, {
        ...result.payload,
        relevanceScore: qdrantScore * config.semanticWeight,
        qdrantScore,
        searchSource: "qdrant",
      });
    }
  });

  // Sort by relevance score and return top results
  return Array.from(fusedResults.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, config.maxResults);
}
