"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, History, User } from "lucide-react";

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

export function VersionSelector({
  versions,
  currentVersion,
}: {
  versions: typeof mockVersions;
  currentVersion: (typeof mockVersions)[0];
}) {
  return (
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
              version.id === currentVersion.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            // onClick={() => onVersionChange(version)}
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
              {version.changeDescription}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{version.author}</span>
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
  );
}
