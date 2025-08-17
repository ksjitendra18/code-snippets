import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { getSnippetDataById } from "@/features/snippets/data";
import { createSnippet, editSnippet } from "@/features/snippets/services";
import { EditSnippetSchema } from "@/features/snippets/validations/edit-snippet";
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
export const PATCH = async (req: Request) => {
  try {
    const { user } = await checkAuthentication();

    if (!user)
      return Response.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );

    const requestBody = await req.json();

    const result = EditSnippetSchema.safeParse(requestBody);

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

    const { title, description, code, changeType, snippetId } = result.data;

    console.log("saving......................");
    console.log("code", code);
    console.log("saving......................");

    const snippetData = await getSnippetDataById(snippetId);

    if (!snippetData) {
      return Response.json(
        {
          error: {
            code: "INVALID_SNIPPET_ID",
            message: "Invalid snippet ID",
          },
        },
        { status: 400 }
      );
    }

    const newVersion = await editSnippet({
      id: snippetId,
      title,
      description,
      code,
      changeType,
      createdBy: user.id,
      oldVersion: snippetData.versions[0].version,
    });

    await initializeIndex();

    await addCodeSnippet({
      id: snippetData.id,
      title,
      description,
      language: snippetData.language,
      code,
      createdAt: newVersion[0].createdAt,
    });

    return Response.json(
      {
        success: true,
        data: {},
      },
      { status: 200 }
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
