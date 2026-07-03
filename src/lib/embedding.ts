import { createHash } from "node:crypto";
import { openai } from "./open-ai";
import { embed } from "ai";
import { redis } from "./redis";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

const hashQuery = (text: string) =>
  createHash("sha256").update(text).digest("hex").slice(0, 32);

export async function generateEmbedding(text: string): Promise<number[]> {
  const key = `emb:${hashQuery(text)}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as number[];
    }
  } catch {
    // fall through to network call
  }

  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });

  try {
    await redis.set(key, JSON.stringify(embedding), "EX", CACHE_TTL_SECONDS);
  } catch {
    // best-effort
  }

  return embedding;
}
