import { db } from "@/db";
import { snippets } from "@/db/schema";
import { addCodeSnippet, initializeIndex } from "@/lib/meilisearch";

export const POST = async (req: Request) => {
  try {
    const { title, description, code, language } = await req.json();

    const snippet = await db
      .insert(snippets)
      .values({
        title,
        description,
        createdBy: 1,
        code,
        language,
      })
      .returning({ id: snippets.id, createdAt: snippets.createdAt });

    await initializeIndex();

    const r = await addCodeSnippet({
      id: snippet[0].id,
      title,
      description,
      language,
      code,
      createdAt: snippet[0].createdAt,
    });

    console.log("r", r);

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
