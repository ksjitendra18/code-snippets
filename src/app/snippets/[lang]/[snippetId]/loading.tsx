import { BreadCrumbs } from "@/components/breadcrumps";
import { Separator } from "@/components/ui/separator";

const PLACEHOLDER_CODE_LINES = 10;

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse will-change-transform ${className}`}
    />
  );
}

function SkeletonBreadcrumb() {
  return (
    <div className="mb-8">
      <BreadCrumbs className="mb-4" />
    </div>
  );
}

function SkeletonCodeHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function SkeletonCodeBlock() {
  return (
    <div className="bg-white border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <SkeletonCodeHeader />

      <div className="space-y-3">
        {Array.from({ length: PLACEHOLDER_CODE_LINES }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${
              i % 3 === 0
                ? "w-full"
                : i % 3 === 1
                ? "w-[90%]"
                : "w-[75%]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonAIAnalysis() {
  return (
    <>
      <Separator className="my-12" />

      <div className="bg-white rounded-lg p-8 space-y-6">
        <Skeleton className="h-8 w-56" />

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SkeletonBreadcrumb />

        {/* Main Snippet Display */}
        <SkeletonCodeBlock />

        {/* AI Analysis Section */}
        <SkeletonAIAnalysis />
      </div>
    </div>
  );
}
