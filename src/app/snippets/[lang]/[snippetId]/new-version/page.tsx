import { getSnippetDataById } from "@/features/snippets/data";

type Params = Promise<{ snippetId: string }>;

const NotFound = () => {
  return <div>
  
    Not Found
    
    
    </div>;
};

export default async function NewVersionPage({ params }: { params: Params }) {
  const { snippetId } = await params;

  const snippetData = await getSnippetDataById(snippetId);

  if (snippetData) {
    return <NotFound />;
  }
  return <></>;
}
