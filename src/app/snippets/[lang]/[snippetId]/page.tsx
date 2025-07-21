import { BreadCrumbs } from "@/components/breadcrumps";
import { CodeHighlighter } from "@/components/code-highlighter";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ snippetId: string }>;

export default async function SnippetPage({ params }: { params: Params }) {
  const { snippetId } = await params;

  const snippetData = await db.query.snippets.findFirst({
    where: { id: Number(snippetId) },
  });

  return (
    <>
      <BreadCrumbs />
      {!snippetData ? (
        <div>
          <h1 className="text-center mt-20 text-2xl font-bold">
            No Snippet Found
          </h1>

          <div className="flex items-center mt-5 justify-center">
            <Button asChild>
              <Link href="/snippets">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Snippets
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold my-3 text-center">
            {snippetData.title}
          </h1>

          <CodeHighlighter
            code={snippetData.code}
            language={snippetData.language}
          />
        </>
      )}
    </>
  );
}
