"use client";

import { CodeHighlighter } from "@/components/code-highlighter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Copy, GitBranch, History, User } from "lucide-react";
import { useState } from "react";
import { GetSnippetDataById } from "../data";

const mockVersions = [
  {
    id: 1,
    version: "1.0.0",
    title: "React Component with useState Hook",
    code: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    language: "javascript",
    changeDescription: "Initial version with basic counter functionality",
    createdAt: new Date("2024-01-10T09:00:00"),
    author: "You",
    isCurrent: false,
  },
  {
    id: 2,
    version: "1.1.0",
    title: "Enhanced Counter with Reset",
    code: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <div className="buttons">
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}`,
    language: "javascript",
    changeDescription:
      "Added decrement and reset functionality with better styling",
    createdAt: new Date("2024-01-12T14:30:00"),
    author: "You",
    isCurrent: false,
  },
  {
    id: 3,
    version: "2.0.0",
    title: "TypeScript Counter with Custom Hook",
    code: `import React, { useState, useCallback } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

export default function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const { count, increment, decrement, reset } = useCounter(initialValue, step);

  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Counter: {count}
      </h2>
      <div className="flex gap-2 justify-center">
        <button 
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +{step}
        </button>
        <button 
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -{step}
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}`,
    language: "typescript",
    changeDescription:
      "Converted to TypeScript, added custom hook, props support, and Tailwind styling",
    createdAt: new Date("2024-01-15T16:45:00"),
    author: "You",
    isCurrent: true,
  },
];

export function SnippetContent({ snippet }: { snippet: GetSnippetDataById }) {
  const versions = snippet.versions;
  const [selectedVersion, setSelectedVersion] = useState(
    versions.find((v) => v.isCurrent) || versions[0]
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedVersion.title}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <GitBranch className="h-3 w-3 mr-1" />v{selectedVersion.version}
              </Badge>
              <Badge variant="secondary">{snippet.language}</Badge>
            </div>
          </div>
        </div>

        {selectedVersion.description && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-1">What's New:</h3>
            <p className="text-blue-800 text-sm">
              {selectedVersion.description}
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
                      {version.createdAt.toLocaleDateString()}
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
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <Copy className="h-4 w-4 mr-1" />
      Copy
    </Button>
  );
}
