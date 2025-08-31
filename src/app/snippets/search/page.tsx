import { CodeSnippetSearch } from "@/features/snippets/components/code-snippet-search";
import { EnhancedCodeSnippetSearch } from "@/features/snippets/components/enhanced-search";

export default async function Search() {
  return (
    <>
      {/* <CodeSnippetSearch /> */}
      <EnhancedCodeSnippetSearch />
    </>
  );
}
