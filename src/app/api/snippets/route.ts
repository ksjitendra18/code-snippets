import { db } from "@/db";
import { snippets } from "@/db/schema";
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { addCodeSnippet, initializeIndex } from "@/lib/meilisearch";

export const POST = async (req: Request) => {
  try {
    const { user } = await checkAuthentication();

    if (!user)
      return Response.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );

    const { title, description, code, language } = await req.json();

    const snippet = await db
      .insert(snippets)
      .values({
        title,
        description,
        createdBy: user.id,
        code,
        language,
      })
      .returning({ id: snippets.id, createdAt: snippets.createdAt });

    await initializeIndex();

    await addCodeSnippet({
      id: snippet[0].id,
      title,
      description,
      language,
      code,
      createdAt: snippet[0].createdAt,
    });

    return new Response(JSON.stringify(snippet), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
