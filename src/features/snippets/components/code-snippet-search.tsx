"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Code,
  Calendar,
  Tag,
  Copy,
  ExternalLink,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { languages } from "../constant";
import { toast } from "sonner";
import Link from "next/link";

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
  score?: number; // For semantic search results
}

interface SearchFilters {
  language: string;
  tags: string[];
}

interface SearchResponse {
  hits: CodeSnippet[];
  totalHits: number;
  processingTimeMs: number;
  query: string;
}

type SearchMode = "keyword" | "ai";

export const CodeSnippetSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({
    language: "",
    tags: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [searchMode, setSearchMode] = useState<SearchMode>("keyword");

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
    async (
      searchQuery: string,
      currentFilters: SearchFilters,
      mode: SearchMode
    ) => {
      if (
        !searchQuery.trim() &&
        !currentFilters.language &&
        currentFilters.tags.length === 0
      ) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      setResults([]);

      setLoading(true);
      try {
        let endpoint = "";
        let params = new URLSearchParams();

        if (mode === "ai") {
          // Use semantic search endpoint
          endpoint = "/api/snippets/semantic";
          params.set("q", searchQuery);
          // For semantic search, we might want to include filters differently
          if (currentFilters.language) {
            params.set("language", currentFilters.language);
          }
          if (currentFilters.tags.length > 0) {
            params.set("tags", currentFilters.tags.join(","));
          }
        } else {
          // Use traditional search endpoint
          endpoint = "/api/snippets/search";
          params.set("q", searchQuery);
          if (currentFilters.language) {
            params.set("language", currentFilters.language);
          }
          if (currentFilters.tags.length > 0) {
            params.set("tags", currentFilters.tags.join(","));
          }
        }

        const response = await fetch(`${endpoint}?${params}`);
        const data: SearchResponse = await response.json();

        if (response.ok) {
          setResults(data.hits || []);
          setTotalHits(data.totalHits || 0);
          setSearchTime(data.processingTimeMs || 0);
        } else {
          console.error("Search error:", (data as any).error);
          setResults([]);
          toast.error(
            mode === "ai"
              ? "AI search failed. Please try again."
              : "Search failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Search request failed:", error);
        setResults([]);
        toast.error("Search request failed. Please check your connection.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedSearch = useCallback(
    debounce(
      (
        searchQuery: string,
        currentFilters: SearchFilters,
        mode: SearchMode
      ) => {
        searchSnippets(searchQuery, currentFilters, mode);
      },
      300
    ),
    [searchSnippets]
  );

  useEffect(() => {
    debouncedSearch(query, filters, searchMode);
  }, [query, filters, searchMode, debouncedSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLanguageFilter = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      language: prev.language === language ? "" : language,
    }));
  };

  const handleSearchModeToggle = (mode: SearchMode) => {
    setSearchMode(mode);
    // Clear results when switching modes to avoid confusion
    setResults([]);
    setTotalHits(0);
  };

  const copyToClipboard = async (code: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const highlightText = (text: string, highlight: string): React.ReactNode => {
    if (!highlight || !text || searchMode === "ai") return text; // Don't highlight for AI search

    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlaceholderText = () => {
    return searchMode === "ai"
      ? "Ask anything about code... e.g., 'Find functions that handle user authentication'"
      : "Search code snippets...";
  };

  const getSearchExamples = () => {
    if (searchMode === "ai") {
      return [
        "Find functions that handle user authentication",
        "Show me React components for data visualization",
        "Get code that processes CSV files",
        "Find algorithms for sorting arrays",
        "Show database connection examples",
      ];
    }
    return [];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Search Code Snippets
        </h1>
        <p className="text-gray-600">
          Find and discover code snippets instantly with keyword or AI-powered
          search
        </p>
      </div>

      {/* Search Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            onClick={() => handleSearchModeToggle("keyword")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              searchMode === "keyword"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Keyword Search</span>
          </button>
          <button
            onClick={() => handleSearchModeToggle("ai")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              searchMode === "ai"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Search</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="relative">
          {searchMode === "ai" ? (
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          )}
          <input
            type="text"
            placeholder={getPlaceholderText()}
            value={query}
            onChange={handleQueryChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
              searchMode === "ai"
                ? "border-blue-200 focus:ring-blue-500 bg-blue-50/30"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {searchMode === "keyword" && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                showFilters
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Search Examples */}
      {searchMode === "ai" && !query && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            Try asking:
          </h3>
          <div className="flex flex-wrap gap-2">
            {getSearchExamples().map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="text-xs bg-white text-gray-700 px-3 py-2 rounded-full border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters - only show for keyword search */}
      {showFilters && searchMode === "keyword" && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Language</h3>
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

      {/* Search Results Info */}
      {(query || filters.language || filters.tags.length > 0) && (
        <div
          className={`flex items-center justify-between text-sm text-gray-600 px-4 py-2 rounded ${
            searchMode === "ai" ? "bg-blue-50" : "bg-gray-50"
          }`}
        >
          <span>
            {loading
              ? searchMode === "ai"
                ? "AI is searching..."
                : "Searching..."
              : `${totalHits} result${totalHits !== 1 ? "s" : ""} found`}
            {searchMode === "ai" && !loading && results.length > 0 && (
              <span className="ml-2 text-blue-600">• Semantic search</span>
            )}
          </span>
          {searchTime > 0 && <span>{searchTime}ms</span>}
        </div>
      )}

      <div className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                searchMode === "ai" ? "border-blue-500" : "border-gray-500"
              }`}
            ></div>
          </div>
        )}

        {!loading && results.length === 0 && (query || filters.language) && (
          <div className="text-center py-8 text-gray-500">
            <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No code snippets found</p>
            <p className="text-sm">
              {searchMode === "ai"
                ? "Try rephrasing your question or being more specific"
                : "Try adjusting your search terms or filters"}
            </p>
          </div>
        )}

        {results.length > 0 &&
          results.map((snippet, index) => (
            <Link
              key={snippet.id || index}
              href={`/snippets/${snippet.language}/${snippet.id}`}
            >
              <div
                className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  searchMode === "ai"
                    ? "border-blue-100 hover:border-blue-200"
                    : "border-gray-200"
                }`}
              >
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
                          highlightText(snippet.title, query)
                        )}
                      </h3>
                      {searchMode === "ai" && snippet.score && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {Math.round(snippet.score * 100)}% match
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {snippet._formatted?.description ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: snippet._formatted.description,
                          }}
                        />
                      ) : (
                        highlightText(snippet.description, query)
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(snippet.code);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
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
            </Link>
          ))}
      </div>

      {results.length > 0 && results.length < totalHits && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Showing {results.length} of {totalHits} results
          </p>
        </div>
      )}
    </div>
  );
};
