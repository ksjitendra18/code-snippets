import { AddNewSnippet } from "@/features/snippets/components/new-snippet";

export const metadata = {
  title: "New Snippet",
  description: "New Snippet",
};

export default async function NewSnippet() {
  return (
    <>
      <AddNewSnippet />
    </>
  );
}
