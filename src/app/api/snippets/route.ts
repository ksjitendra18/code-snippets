import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { getSnippetDataById } from "@/features/snippets/data";
import { createSnippet, editSnippet } from "@/features/snippets/services";
import { EditSnippetSchema } from "@/features/snippets/validations/edit-snippet";
import { NewSnippetSchema } from "@/features/snippets/validations/new-snippet";
import {
  addSnippetToMeiliIndexJob,
  addSnippetToQdrantIndexJob,
  addSummaryJob,
} from "@/queue/jobs";
import { revalidateTag } from "next/cache";
import { z } from "zod/mini";

export const POST = async (req: Request) => {
  try {
    const { user } = await checkAuthentication();

    if (!user)
      return Response.json(
        { error: { message: "Unauthorized" } },
        { status: 401 },
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
        { status: 400 },
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

    await Promise.all([
      addSummaryJob({
        title,
        description,
        code,
        language,
        snippetId: snippet.id,
      }),
      addSnippetToQdrantIndexJob({
        data: { id: snippet.id, title, description, language, code },
        priority: 1,
      }),
      addSnippetToMeiliIndexJob({
        id: snippet.id,
        title,
        description,
        language,
        code,
        createdAt: snippet.createdAt ?? undefined,
      }),
    ]);

    revalidateTag(`snippets-${snippet.id}`, "max");
    revalidateTag(`snippets-${language}`, "max");

    return Response.json(
      {
        success: true,
        data: { snippet: { id: snippet.id } },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error while creating snippet", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { user } = await checkAuthentication();

    if (!user)
      return Response.json(
        { error: { message: "Unauthorized" } },
        { status: 401 },
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
        { status: 400 },
      );
    }

    const {
      title,
      description,
      code,
      changeType,
      snippetId,
      changeDescription,
    } = result.data;

    const snippetData = await getSnippetDataById(snippetId);

    if (!snippetData) {
      return Response.json(
        {
          error: {
            code: "INVALID_SNIPPET_ID",
            message: "Invalid snippet ID",
          },
        },
        { status: 400 },
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
      changeDescription,
    });

    await addSnippetToMeiliIndexJob({
      id: snippetData.id,
      title,
      description,
      language: snippetData.language,
      code,
      createdAt: newVersion[0].createdAt ?? undefined,
    });

    return Response.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error("Error while editing snippet", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 },
    );
  }
};
