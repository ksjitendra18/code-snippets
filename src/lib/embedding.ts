// import { OpenAI } from "openai";

import { openai } from "./open-ai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function generateEmbedding(text: string): Promise<number[]> {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });

//   return response.data[0].embedding;
// }

import { embed } from "ai";

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });

  return embedding;
}
