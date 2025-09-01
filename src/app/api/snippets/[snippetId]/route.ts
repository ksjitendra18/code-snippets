import { db } from "@/db";
import { snippets } from "@/db/schema";
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { eq } from "drizzle-orm";

export const DELETE = async (
  request: Request,
  context: { params: Promise<{ snippetId: string }> }
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
      }
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
      }
    );
  }

  await db.delete(snippets).where(eq(snippets.id, Number(snippetId)));

  return Response.json(
    {
      success: true,
    },
    {
      status: 200,
    }
  );
};
