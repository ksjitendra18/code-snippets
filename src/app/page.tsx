import { Home } from "@/components/homepage";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-30 mb-10">
        <h1 className="text-3xl font-bold">Code Snippets</h1>
        <Button className="mt-5" asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </div>

      <Home />
    </>
  );
}
