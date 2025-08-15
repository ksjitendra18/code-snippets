import { AddNewSnippet } from "@/features/snippets/components/new-snippet";
import { Suspense } from "react";

export const metadata = {
  title: "New Snippet",
  description: "New Snippet",
};

export default async function NewSnippet() {
  return (
    <>
      <Suspense>
        <AddNewSnippet />
      </Suspense>
    </>
  );
}
