import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { EditSnippet } from "@/features/snippets/components/edit-snippet";
import { getSnippetDataById } from "@/features/snippets/data";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Params = Promise<{ snippetId: string }>;

const NotFound = () => {
  return <div>Not Found</div>;
};

export default async function NewVersionPage({ params }: { params: Params }) {
  const { isAuthenticated } = await checkAuthentication();

  if (!isAuthenticated) {
    redirect(`/login?redirect=${encodeURIComponent("/snippets/")}`);
  }
  const { snippetId } = await params;

  const snippetData = await getSnippetDataById(snippetId);

  if (!snippetData) {
    return <NotFound />;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditSnippet
        snippetId={snippetId}
        code={snippetData.currentVersion.code}
        description={snippetData.currentVersion.description}
        lang={snippetData.language}
        title={snippetData.currentVersion.title}
        version={snippetData.currentVersion.version}
      />
    </Suspense>
  );
}
