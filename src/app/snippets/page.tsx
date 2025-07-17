import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { languages, programmingLanguages } from "@/features/snippets/constant";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function SnippetsPage() {
  // const allSnippets = await db
  //   .select()
  //   .from(snippets)
  //   .groupBy(snippets.language);
  // console.log("allSnippets", allSnippets);
  return (
    <>
      <section className="flex my-5 mb-10 items-center gap-5">
        <h1 className="text-2xl font-bold">Snippets</h1>
        <Button asChild>
          <Link href="/snippets/new">
            <Plus />
            Create Snippet
          </Link>
        </Button>
      </section>

      {/* <section className="my-5 flex gap-5 flex-col">
        {allSnippets.map((snippet) => (
          <Link
            href={`/snippets/${snippet.id}`}
            key={snippet.id}
            className="flex border-2 border-gray-400 px-5 py-3 rounded-md items-center gap-5"
          >
            <h2 className="text-xl font-bold">{snippet.title}</h2>
          </Link>
        ))}
      </section>

      <section>
        {languages.map((lang, i) => (
          <div key={i}>{lang}</div>
        ))}
      </section> */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {programmingLanguages.map((lang, i) => (
          <Link
            href={`/snippets/${lang.slug}`}
            className="flex items-center gap-5 border-2 rounded-md px-4 py-2 hover:bg-gray-200 duration-200 ease-in"
            key={i}
          >
            <img src={lang.icon} alt={lang.name} className="w-10 h-10" />
            {lang.name}
          </Link>
        ))}
      </section>
    </>
  );
}
