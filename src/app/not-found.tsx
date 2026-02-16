import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-9xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 min-w-[180px] justify-center"
          >
            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Go Home
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-start gap-3 text-left">
            <Search className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
            <div>
              <h3 className="font-semibold mb-1">
                Looking for something specific?
              </h3>
              <p className="text-sm text-gray-400">
                Try using the search function or navigate back to the homepage
                to find what you need.
              </p>
            </div>
          </div>
        </div>

        {/* Optional: Error Code */}
        <div className="mt-8 text-xs text-gray-600 font-mono">
          ERROR_CODE: 404_NOT_FOUND
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}
