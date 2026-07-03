import { Worker } from "bullmq";
import { MeiliIndexTaskData, NewSnippetIndex, SummaryTaskData } from "./types";

import { redisConnectionOptions } from "../lib/redis";
import { createAiAnalysis } from "../features/snippets/services/ai-analysis";
import { addNewSnippetToCollection } from "../lib/qdrant";
import { addCodeSnippet } from "../lib/meilisearch";

export const summaryWorker = new Worker(
  "ai-code-analysis",
  async (job) => {
    const { code, title, description, language, snippetId } =
      job.data as SummaryTaskData;

    const startTime = Date.now();
    try {
      await job.updateProgress(25);

      await createAiAnalysis({
        title,
        description,
        code,
        language,
        snippetId: snippetId,
      });
      await job.updateProgress(75);
      await job.updateProgress(100);

      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/snippets/${snippetId}/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
          },
        },
      );
      const processingTime = Date.now() - startTime;
      console.log(`Completed summary job ${job.id} in ${processingTime}ms`);
    } catch (error) {
      console.error(`Failed to process summary job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnectionOptions,
    concurrency: 5,
  },
);

summaryWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

summaryWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

export const qdrantIndexWorker = new Worker(
  "qdrant-snippet-index",
  async (job) => {
    const { title, description, code, language, id } =
      job.data as NewSnippetIndex;

    try {
      await job.updateProgress(25);

      await addNewSnippetToCollection({
        id,
        title,
        description,
        language,
        code,
      });
      await job.updateProgress(100);
    } catch (error) {
      console.error(`Failed to process Qdrant index job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnectionOptions,
    concurrency: 5,
  },
);

qdrantIndexWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

qdrantIndexWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

export const meiliIndexWorker = new Worker(
  "meili-snippet-index",
  async (job) => {
    const data = job.data as MeiliIndexTaskData;

    try {
      await addCodeSnippet({
        id: data.id,
        title: data.title,
        description: data.description,
        language: data.language,
        code: data.code,
        createdAt: data.createdAt ?? undefined,
      });
      await job.updateProgress(100);
    } catch (error) {
      console.error(`Failed to process Meili index job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnectionOptions,
    concurrency: 10,
  },
);

meiliIndexWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

meiliIndexWorker.on("error", (err) => {
  console.error("Worker error:", err);
});
