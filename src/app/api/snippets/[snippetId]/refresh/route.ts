import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

export const POST = async (
  request: Request,
  context: { params: Promise<{ snippetId: string }> },
) => {
  const { snippetId } = await context.params;

  // match the headers provided by it

  const reqHeaders = await headers();

  const authHeader = reqHeaders.get("authorization");

  const isAuthenticated =
    authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`;

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

  revalidateTag(`snippets-${snippetId}`, "max");

  return Response.json(
    {
      success: true,
    },
    {
      status: 200,
    },
  );
};
