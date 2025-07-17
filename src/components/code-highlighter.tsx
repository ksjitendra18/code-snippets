// components/CodeHighlighter.tsx
"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface CodeHighlighterProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

export function CodeHighlighter({
  code,
  language,
  title,
  showLineNumbers = true,
  copyable = true,
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border bg-gray-950 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-sm text-gray-300">
          <span>{title}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
        lineNumberStyle={{
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
