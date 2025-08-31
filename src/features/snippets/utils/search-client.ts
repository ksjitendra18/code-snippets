interface SearchFilters {
  language?: string;
  tags?: string[];
}

export class HybridSearchClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async search(
    query: string,
    filters: SearchFilters,
    options: {
      enableSemantic?: boolean;
      semanticWeight?: number;
      keywordWeight?: number;
    } = {}
  ) {
    const params = new URLSearchParams({
      q: query,
      ...(filters.language && { language: filters.language }),
      ...(filters.tags &&
        filters.tags.length > 0 && { tags: filters.tags.join(",") }),
      ...(options.enableSemantic !== undefined && {
        semantic: options.enableSemantic.toString(),
      }),
      ...(options.semanticWeight && {
        semanticWeight: options.semanticWeight.toString(),
      }),
      ...(options.keywordWeight && {
        keywordWeight: options.keywordWeight.toString(),
      }),
    });

    const response = await fetch(
      `${this.baseUrl}/api/snippets/search-hybrid?${params}`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
