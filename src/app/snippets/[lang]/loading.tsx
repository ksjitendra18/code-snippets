import { BreadCrumbs } from "@/components/breadcrumps";

const PLACEHOLDERS = 6; // psychological trick (explained below)

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse will-change-transform ${className}`}
    />
  );
}

function SkeletonHeader() {
  return (
    <section className="flex my-5 mb-10 items-center gap-5">
      {/* Title */}
      <SkeletonBlock className="h-8 w-52" />

      {/* Button */}
      <SkeletonBlock className="h-10 w-40" />
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="flex border-2 border-gray-200 dark:border-gray-800 px-5 py-3 rounded-md items-center gap-5">
      <SkeletonBlock className="h-6 w-40" />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <BreadCrumbs />

      <SkeletonHeader />

      <section className="my-5 grid grid-cols-2 gap-4 md:grid-cols-3 items-center">
        {Array.from({ length: PLACEHOLDERS }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    </>
  );
}
