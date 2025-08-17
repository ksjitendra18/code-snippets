import { BreadCrumbs } from "@/components/breadcrumps";
import { Button } from "@/components/ui/button";
import { DisplaySnippet } from "@/features/snippets/components/display-snippet";
import { getSnippetDataById } from "@/features/snippets/data";
import { ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ snippetId: string }>;

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

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Snippet Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The code snippet you're looking for doesn't exist or may have been
          removed.
        </p>
        <Button asChild size="lg" className="min-w-[200px]">
          <Link href="/snippets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Snippets
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default async function SnippetPage({ params }: { params: Params }) {
  const { snippetId } = await params;

  const snippetData = await getSnippetDataById(snippetId);

  if (!snippetData) return <NotFound />;
  const currentSnippet = snippetData?.versions.find((v) => v.isCurrent);

  if (!currentSnippet) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <BreadCrumbs
            customLabels={{
              "/snippets": "Code Snippets",
              [`/snippets/${snippetId}`]: currentSnippet?.title || "Snippet",
            }}
            className="mb-4"
          />
        </div>

        {!snippetData ? <NotFound /> : <DisplaySnippet snippet={snippetData} />}
      </div>
    </div>
  );
}
