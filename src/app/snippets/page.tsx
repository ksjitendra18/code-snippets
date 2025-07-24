import { Button } from "@/components/ui/button";
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { programmingLanguages } from "@/features/snippets/constant";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SnippetsPage() {
  const { user } = await checkAuthentication();

  if (!user) {
    return redirect(`/login?redirectTo=${`/snippets`}`);
  }
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
