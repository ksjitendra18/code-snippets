import { CodeHighlighter } from "@/components/code-highlighter";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = Promise<{ snippetId: string }>;

export default async function SnippetPage({ params }: { params: Params }) {
  const { snippetId } = await params;

  const snippetData = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, Number(snippetId)));

  return (
    <>
      <h1 className="text-2xl font-bold my-3 text-center">
        {snippetData[0].title}
      </h1>

      <CodeHighlighter
        code={snippetData[0].code}
        language={snippetData[0].language}
      />
    </>
  );
}
