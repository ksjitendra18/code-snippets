import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { getSnippetVersionCode } from "@/features/snippets/data";

export const GET = async (
  _req: Request,
  context: {
    params: Promise<{ snippetId: string; versionId: string }>;
  },
) => {
  const { isAuthenticated } = await checkAuthentication();

  if (!isAuthenticated) {
    return Response.json(
      { error: { message: "Unauthorized" } },
      { status: 401 },
    );
  }

  const { snippetId, versionId } = await context.params;

  const code = await getSnippetVersionCode(
    Number(snippetId),
    Number(versionId),
  );

  if (code === null) {
    return Response.json(
      { error: { message: "Version not found" } },
      { status: 404 },
    );
  }

  return Response.json({ code }, { status: 200 });
};
