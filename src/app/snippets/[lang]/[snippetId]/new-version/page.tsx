import { EditSnippet } from "@/features/snippets/components/edit-snippet";
import { getSnippetDataById } from "@/features/snippets/data";

type Params = Promise<{ snippetId: string }>;

const NotFound = () => {
  return <div>Not Found</div>;
};

export default async function NewVersionPage({ params }: { params: Params }) {
  const { snippetId } = await params;

  console.log("snippetId", snippetId);
  const snippetData = await getSnippetDataById(snippetId);
  console.log("snippetData", snippetData);

  if (!snippetData) {
    return <NotFound />;
  }
  return (
    <>
      <EditSnippet
        snippetId={snippetId}
        code={snippetData.versions[0].code}
        description={snippetData.versions[0].description}
        lang={snippetData.language}
        title={snippetData.versions[0].title}
        version={snippetData.versions[0].version}
      />
    </>
  );
}
