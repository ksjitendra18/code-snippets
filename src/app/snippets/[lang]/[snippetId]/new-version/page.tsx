import { EditSnippet } from "@/features/snippets/components/edit-snippet";
import { getSnippetDataById } from "@/features/snippets/data";
import { Suspense } from "react";

type Params = Promise<{ snippetId: string }>;

const NotFound = () => {
  return <div>Not Found</div>;
};
// export default async function NewVersionPage({ params }: { params: Params }) {

export default async function NewVersionPage() {
  // const { snippetId } = await params

  const snippetId = "1";

  const snippetData = await getSnippetDataById(snippetId);

  if (!snippetData) {
    return <NotFound />;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditSnippet
        snippetId={snippetId}
        code={snippetData.versions[0].code}
        description={snippetData.versions[0].description}
        lang={snippetData.language}
        title={snippetData.versions[0].title}
        version={snippetData.versions[0].version}
      />
    </Suspense>
  );
}
