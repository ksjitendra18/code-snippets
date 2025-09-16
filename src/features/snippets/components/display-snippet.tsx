"use client";

import { CodeHighlighter } from "@/components/code-highlighter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Copy,
  GitBranch,
  History,
  Pencil,
  User,
} from "lucide-react";
import { useState } from "react";
import { GetSnippetDataById } from "../data";

import { toast } from "sonner";
import Link from "next/link";

export function DisplaySnippet({ snippet }: { snippet: GetSnippetDataById }) {
  const versions = snippet.versions;
  const [selectedVersion, setSelectedVersion] = useState(
    versions.find((v) => v.isCurrent) || versions[0]
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 ">
                {selectedVersion.title}
              </h1>

              <Button variant={"outline"} asChild>
                <Link
                  href={`/snippets/${snippet.language}/${snippet.id}/new-version`}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <GitBranch className="h-3 w-3 mr-1" />v{selectedVersion.version}
              </Badge>
              <Badge variant="secondary">{snippet.language}</Badge>
            </div>
          </div>
        </div>

        {selectedVersion.description && (
          <div className="   mb-4">
            <h3 className="font-medium text-black mb-1">Description:</h3>
            <p className=" text-sm">{selectedVersion.description}</p>
          </div>
        )}
        {selectedVersion.changeDescription && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-1">What's New:</h3>
            <p className="text-blue-800 text-sm">
              {selectedVersion.changeDescription}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Created by {snippet.author?.pfId}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{selectedVersion.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="relative group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Code - Version {selectedVersion.version}</span>
                <CopyButton code={selectedVersion.code} />
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="relative">
                <CodeHighlighter
                  code={selectedVersion.code}
                  language={snippet.language}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5" />
                Version History ({versions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    version.id === selectedVersion.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={version.isCurrent ? "default" : "secondary"}
                        className="text-xs"
                      >
                        v{version.version}
                      </Badge>
                      {version.isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {version?.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{version.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {version.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{version.author?.pfId}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>
                      {version.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className="bg-white rounded-lg shadow-sm border p-6">
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentsSection />
        </Suspense>
      </div> */}
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        toast.success("Copied to clipboard", {
          position: "top-center",
        });
      }}
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <Copy className="h-4 w-4 mr-1" />
      Copy
    </Button>
  );
}
