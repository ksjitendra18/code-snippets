import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { createSnippet } from "@/features/snippets/services";
import { NewSnippetSchema } from "@/features/snippets/validations/new-snippet";
import { addCodeSnippet, initializeIndex } from "@/lib/meilisearch";
import { z } from "zod/mini";

export const POST = async (req: Request) => {
  try {
    const { user } = await checkAuthentication();

    if (!user)
      return Response.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );

    const requestBody = await req.json();

    const result = NewSnippetSchema.safeParse(requestBody);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: z.treeifyError(result.error),
          },
        },
        { status: 400 }
      );
    }

    const { title, description, code, language } = result.data;

    const snippet = await createSnippet({
      createdBy: user.id,
      language,
      title,
      description,
      code,
    });

    await initializeIndex();

    await addCodeSnippet({
      id: snippet.id,
      title,
      description,
      language,
      code,
      createdAt: snippet.createdAt,
    });

    return Response.json(
      {
        success: true,
        data: {
          snippet: {
            id: snippet.id,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while creating snippet", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
};
