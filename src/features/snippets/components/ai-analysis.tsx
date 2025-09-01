import React from "react";
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Code2,
  Shield,
  Zap,
  Eye,
  Settings,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface AIAnalysisData {
  id: number;
  snippetId: number;
  codeFunctionality: string;
  optimizations: Array<{
    type:
      | "performance"
      | "readability"
      | "security"
      | "maintainability"
      | "best-practices";
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    codeExample?: string;
  }>;
  additionalRecommendations?: string | null;
  createdAt: string;
}

interface AIAnalysisDisplayProps {
  analysis: AIAnalysisData;
}

// Helper function to get optimization type icon and color
const getOptimizationTypeInfo = (
  type: AIAnalysisData["optimizations"][0]["type"]
) => {
  switch (type) {
    case "performance":
      return {
        icon: Zap,
        color: "bg-green-100 text-green-700 border-green-200",
        label: "Performance",
      };
    case "readability":
      return {
        icon: Eye,
        color: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Readability",
      };
    case "security":
      return {
        icon: Shield,
        color: "bg-red-100 text-red-700 border-red-200",
        label: "Security",
      };
    case "maintainability":
      return {
        icon: Settings,
        color: "bg-purple-100 text-purple-700 border-purple-200",
        label: "Maintainability",
      };
    case "best-practices":
      return {
        icon: CheckCircle,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Best Practices",
      };
    default:
      return {
        icon: Code2,
        color: "bg-gray-100 text-gray-700 border-gray-200",
        label: "General",
      };
  }
};

const getPriorityInfo = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "high":
      return { variant: "destructive" as const, label: "High Priority" };
    case "medium":
      return { variant: "default" as const, label: "Medium Priority" };
    case "low":
      return { variant: "secondary" as const, label: "Low Priority" };
  }
};

export function AIAnalysisDisplay({ analysis }: AIAnalysisDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupedOptimizations = analysis.optimizations.reduce((acc, opt) => {
    if (!acc[opt.type]) {
      acc[opt.type] = [];
    }
    acc[opt.type].push(opt);
    return acc;
  }, {} as Record<string, typeof analysis.optimizations>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">AI Analysis</h2>
        </div>
        <div className="text-sm text-gray-500">
          Generated on {formatDate(analysis.createdAt)}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Code2 className="h-5 w-5 text-blue-500" />
            <span>Code Functionality</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {analysis.codeFunctionality}
          </p>
        </CardContent>
      </Card>

      {analysis.optimizations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Optimization Suggestions</span>
              <Badge variant="outline" className="ml-2">
                {analysis.optimizations.length} suggestions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(groupedOptimizations).map(
              ([type, optimizations], typeIndex) => {
                const typeInfo = getOptimizationTypeInfo(type as any);
                const IconComponent = typeInfo.icon;

                return (
                  <div key={type}>
                    {typeIndex > 0 && <Separator className="my-6" />}

                    {/* Category Header */}
                    <div className="flex items-center space-x-2 mb-4">
                      <IconComponent className="h-4 w-4" />
                      <h3 className="font-medium text-gray-900">
                        {typeInfo.label}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {optimizations.length}
                      </Badge>
                    </div>

                    {/* Optimizations for this category */}
                    <div className="space-y-4 ml-6">
                      {optimizations.map((opt, optIndex) => {
                        const priorityInfo = getPriorityInfo(opt.priority);

                        return (
                          <div
                            key={optIndex}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 flex-1">
                                {opt.title}
                              </h4>
                              <Badge
                                variant={priorityInfo.variant}
                                className="text-xs ml-3"
                              >
                                {priorityInfo.label}
                              </Badge>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                              {opt.description}
                            </p>

                            {/* Code Example */}
                            {opt.codeExample && (
                              <div className="bg-gray-900 rounded-md p-3 overflow-x-auto">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                    Improved Code
                                  </span>
                                </div>
                                <pre className="text-sm text-gray-100 overflow-x-auto">
                                  <code>{opt.codeExample}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Recommendations */}
      {analysis.additionalRecommendations && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span>Additional Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {analysis.additionalRecommendations}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {analysis.optimizations.length}
          </div>
          <div className="text-sm text-gray-600">Total Suggestions</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {
              analysis.optimizations.filter((opt) => opt.priority === "high")
                .length
            }
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {
              analysis.optimizations.filter((opt) => opt.priority === "medium")
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Medium Priority</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(groupedOptimizations).length}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
      </div>
    </div>
  );
}

export function AIAnalysisLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
        <h2 className="text-xl font-semibold text-gray-900">AI Analysis</h2>
        <div className="text-sm text-gray-500">Generating...</div>
      </div>

      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// Error state component
export function AIAnalysisError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load AI analysis
      </h3>
      <p className="text-gray-600 mb-4">
        There was an error loading the analysis for this snippet.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try again
        </button>
      )}
    </div>
  );
}
