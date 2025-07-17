import { db } from "@/db";
import { snippets } from "@/db/schema";

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
      .returning({ id: snippets.id });

    return new Response(JSON.stringify(snippet), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
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
