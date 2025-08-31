"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Code,
  Calendar,
  Tag,
  Copy,
  Zap,
  Brain,
  Layers,
  Settings,
  Info,
} from "lucide-react";
import { languages } from "../constant";
import { HybridSearchClient } from "../utils/search-client";

// Types
interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags?: string[];
  createdAt: string;
  _formatted?: {
    title?: string;
    description?: string;
  };
}

interface SearchFilters {
  language: string;
  tags: string[];
}

interface HybridSearchResult extends CodeSnippet {
  relevanceScore: number;
  meilisearchScore?: number;
  qdrantScore?: number;
  searchSource: "meilisearch" | "qdrant" | "hybrid";
}

interface SearchConfig {
  enableSemanticSearch: boolean;
  semanticWeight: number;
  keywordWeight: number;
}

export const EnhancedCodeSnippetSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<HybridSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({
    language: "",
    tags: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [searchStrategy, setSearchStrategy] = useState<string>("");

  // Search configuration
  const [searchConfig, setSearchConfig] = useState<SearchConfig>({
    enableSemanticSearch: true,
    semanticWeight: 0.6,
    keywordWeight: 0.4,
  });

  // Initialize search client
  const [searchClient] = useState(() => new HybridSearchClient());

  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const searchSnippets = useCallback(
    async (searchQuery: string, currentFilters: SearchFilters) => {
      if (
        !searchQuery.trim() &&
        !currentFilters.language &&
        currentFilters.tags.length === 0
      ) {
        setResults([]);
        setTotalHits(0);
        setSearchStrategy("");
        return;
      }

      setLoading(true);
      try {
        const searchResult = await searchClient.search(
          searchQuery,
          currentFilters,
          {
            enableSemantic: searchConfig.enableSemanticSearch,
            semanticWeight: searchConfig.semanticWeight,
            keywordWeight: searchConfig.keywordWeight,
          }
        );

        setResults(searchResult.results || []);
        setTotalHits(searchResult.totalHits || 0);
        setSearchTime(searchResult.processingTimeMs || 0);
        setSearchStrategy(searchResult.searchStrategy || "");
      } catch (error) {
        console.error("Hybrid search failed:", error);
        setResults([]);
        setTotalHits(0);
        setSearchStrategy("error");
      } finally {
        setLoading(false);
      }
    },
    [searchClient, searchConfig]
  );

  const debouncedSearch = useCallback(
    debounce((searchQuery: string, currentFilters: SearchFilters) => {
      searchSnippets(searchQuery, currentFilters);
    }, 300),
    [searchSnippets]
  );

  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLanguageFilter = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      language: prev.language === language ? "" : language,
    }));
  };

  const copyToClipboard = async (code: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getSearchSourceIcon = (source: string) => {
    switch (source) {
      case "hybrid":
        return <Layers className="w-3 h-3 text-purple-600" />;
      case "qdrant":
        return <Brain className="w-3 h-3 text-green-600" />;
      case "meilisearch":
        return <Zap className="w-3 h-3 text-blue-600" />;
      default:
        return <Search className="w-3 h-3 text-gray-600" />;
    }
  };

  const getSearchSourceLabel = (source: string) => {
    switch (source) {
      case "hybrid":
        return "Hybrid";
      case "qdrant":
        return "Semantic";
      case "meilisearch":
        return "Keyword";
      default:
        return "Search";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          AI-Powered Code Search
        </h1>
        <p className="text-gray-600">
          Search with natural language or keywords using hybrid AI search
        </p>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={
              searchConfig.enableSemanticSearch
                ? "Try: 'how to sort arrays in JavaScript' or 'authentication middleware'"
                : "Search code snippets with keywords..."
            }
            value={query}
            onChange={handleQueryChange}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-1 rounded ${
                showAdvanced
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Advanced settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1 rounded ${
                showFilters
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="bg-purple-50 p-4 rounded-lg space-y-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-700">
              Search Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={searchConfig.enableSemanticSearch}
                  onChange={(e) =>
                    setSearchConfig((prev) => ({
                      ...prev,
                      enableSemanticSearch: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span>Enable Semantic Search</span>
                <Brain className="w-4 h-4 text-green-600" />
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">
                Semantic Weight: {Math.round(searchConfig.semanticWeight * 100)}
                %
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={searchConfig.semanticWeight}
                onChange={(e) =>
                  setSearchConfig((prev) => ({
                    ...prev,
                    semanticWeight: parseFloat(e.target.value),
                    keywordWeight: 1 - parseFloat(e.target.value),
                  }))
                }
                className="w-full"
                disabled={!searchConfig.enableSemanticSearch}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600">
                Keyword Weight: {Math.round(searchConfig.keywordWeight * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={searchConfig.keywordWeight}
                onChange={(e) =>
                  setSearchConfig((prev) => ({
                    ...prev,
                    keywordWeight: parseFloat(e.target.value),
                    semanticWeight: 1 - parseFloat(e.target.value),
                  }))
                }
                className="w-full"
                disabled={!searchConfig.enableSemanticSearch}
              />
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-white p-3 rounded border">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p>
                  <strong>Semantic Search:</strong> Understands meaning and
                  context (e.g., "sort arrays" finds sorting algorithms)
                </p>
                <p>
                  <strong>Keyword Search:</strong> Matches exact terms and
                  filters efficiently
                </p>
                <p>
                  <strong>Hybrid:</strong> Combines both approaches for best
                  results
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Language</h4>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageFilter(lang)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.language === lang
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(query || filters.language || filters.tags.length > 0) && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded">
          <div className="flex items-center space-x-4">
            <span>
              {loading
                ? "Searching with AI..."
                : `${totalHits} result${totalHits !== 1 ? "s" : ""} found`}
            </span>
            {searchStrategy && (
              <span className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded border">
                {getSearchSourceIcon(searchStrategy)}
                <span className="capitalize">
                  {searchStrategy.replace("-", " ")}
                </span>
              </span>
            )}
          </div>
          {searchTime > 0 && <span>{Math.round(searchTime)}ms</span>}
        </div>
      )}

      <div className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-sm text-gray-600">
              {searchConfig.enableSemanticSearch
                ? "Running hybrid search (keyword + semantic)..."
                : "Running keyword search..."}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (query || filters.language) && (
          <div className="text-center py-8 text-gray-500 space-y-3">
            <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No code snippets found</p>
            <p className="text-sm">
              Try adjusting your search terms, enable semantic search, or check
              filters
            </p>
            {!searchConfig.enableSemanticSearch && (
              <button
                onClick={() =>
                  setSearchConfig((prev) => ({
                    ...prev,
                    enableSemanticSearch: true,
                  }))
                }
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Enable Semantic Search for better results
              </button>
            )}
          </div>
        )}

        {results.map((snippet, index) => (
          <a
            key={snippet.id || index}
            href={`/snippets/${snippet.language}/${snippet.id}`}
            className="block"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {snippet._formatted?.title ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: snippet._formatted.title,
                          }}
                        />
                      ) : (
                        snippet.title
                      )}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {getSearchSourceIcon(snippet.searchSource)}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {getSearchSourceLabel(snippet.searchSource)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {snippet._formatted?.description ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: snippet._formatted.description,
                        }}
                      />
                    ) : (
                      snippet.description
                    )}
                  </p>

                  {/* Relevance Score Visualization */}
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Relevance:</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            snippet.relevanceScore > 0.8
                              ? "bg-green-500"
                              : snippet.relevanceScore > 0.6
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                          style={{
                            width: `${Math.min(
                              snippet.relevanceScore * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span>{Math.round(snippet.relevanceScore * 100)}%</span>
                    </div>

                    {/* Show individual scores for hybrid results */}
                    {snippet.searchSource === "hybrid" && (
                      <div className="flex items-center space-x-3 text-xs">
                        {snippet.meilisearchScore && (
                          <span className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-blue-500" />
                            <span>
                              {Math.round(snippet.meilisearchScore * 100)}%
                            </span>
                          </span>
                        )}
                        {snippet.qdrantScore && (
                          <span className="flex items-center space-x-1">
                            <Brain className="w-3 h-3 text-green-500" />
                            <span>
                              {Math.round(snippet.qdrantScore * 100)}%
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(snippet.code);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-3 mb-3 overflow-x-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  <code className={`language-${snippet.language}`}>
                    {snippet.code?.length > 300
                      ? `${snippet.code.substring(0, 300)}...`
                      : snippet.code}
                  </code>
                </pre>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Code className="w-3 h-3" />
                    <span className="font-medium text-blue-600">
                      {snippet.language}
                    </span>
                  </div>
                  {snippet.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(snippet.createdAt)}</span>
                    </div>
                  )}
                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <div className="flex space-x-1">
                        {snippet.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-gray-200 px-2 py-0.5 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {snippet.tags.length > 3 && (
                          <span className="text-gray-400">
                            +{snippet.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {results.length > 0 && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Showing {results.length} results • Strategy: {searchStrategy}
          </p>
          {searchConfig.enableSemanticSearch && (
            <div className="text-xs text-gray-400">
              Weights: {Math.round(searchConfig.semanticWeight * 100)}%
              semantic, {Math.round(searchConfig.keywordWeight * 100)}% keyword
            </div>
          )}
        </div>
      )}

      {/* Quick Search Examples */}
      {!query && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Try these natural language searches:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {[
              "How to sort arrays in JavaScript",
              "Find React authentication components",
              "Show me API request examples",
              "Database connection patterns in Node.js",
              "CSS flexbox layout examples",
              "Python data validation functions",
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(example)}
                className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors text-blue-700"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
