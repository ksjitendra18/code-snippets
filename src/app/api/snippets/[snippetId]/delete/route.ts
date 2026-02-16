import { db } from "@/db";
import { snippets } from "@/db/schema";
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { getSnippetDataById } from "@/features/snippets/data";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

export const GET = async (
  request: Request,
  context: { params: Promise<{ snippetId: string }> },
) => {
  const { snippetId } = await context.params;

  const { isAuthenticated, user } = await checkAuthentication();

  if (!isAuthenticated) {
    return Response.json(
      {
        error: {
          message: "Unauthorized",
        },
      },
      {
        status: 401,
      },
    );
  }

  if (user?.role !== "SUPER_ADMIN") {
    return Response.json(
      {
        error: {
          message: "Unauthorized",
        },
      },
      {
        status: 401,
      },
    );
  }

  const snippetData = await getSnippetDataById(snippetId);

  await db.delete(snippets).where(eq(snippets.id, Number(snippetId)));

  updateTag(`snippets-${snippetId}`);

  updateTag(`snippets-${snippetData?.language}`);

  return Response.json(
    {
      success: true,
    },
    {
      status: 200,
    },
  );
};
