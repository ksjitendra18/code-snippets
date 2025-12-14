import { BreadCrumbs } from "@/components/breadcrumps";
import { Button } from "@/components/ui/button";
import { programmingLanguages } from "@/features/snippets/constant";
import { getAllSnippets } from "@/features/snippets/services/data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type Params = Promise<{ lang: string }>;

export default async function LanguagePage({ params }: { params: Params }) {
  const { lang } = await params;

  const langInfo = programmingLanguages.find((l) => l.slug === lang);

  const allSnippets = await getAllSnippets({ lang });

  return (
    <>
      <BreadCrumbs />
      <section className="flex my-5 mb-10 items-center gap-5">
        <h1 className="text-2xl font-bold"> {langInfo?.name} Snippets</h1>
        <Button asChild>
          <Link href={`/snippets/new?lang=${lang}`}>
            <Plus />
            Create Snippet
          </Link>
        </Button>
      </section>

      <Suspense fallback={<div>Loading...</div>}>
        <section className="my-5 grid grid-cols-2 gap-4 md:grid-cols-3 items-center">
          {allSnippets.map((snippet) => (
            <Link
              href={`/snippets/${lang}/${snippet.id}`}
              key={snippet.id}
              className="flex border-2 border-gray-400 px-5 py-3 rounded-md items-center gap-5"
            >
              <h2 className="text-xl font-bold">{snippet.versions[0].title}</h2>
            </Link>
          ))}
        </section>
      </Suspense>
    </>
  );
}
