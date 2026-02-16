import { Skeleton } from "@/components/ui/skeleton";

export default function SnippetsLoading() {
  return (
    <>
      {/* HEADER */}
      <section className="flex my-5 mb-10 items-center gap-5">
        <Skeleton className="h-8 w-32" />

        <Skeleton className="h-10 w-40 rounded-md" />
      </section>

      {/* GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-5 border-2 rounded-md px-4 py-2"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </section>
    </>
  );
}
