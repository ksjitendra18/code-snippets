import { Worker } from "bullmq";
import { NewSnippetIndex, SummaryTaskData } from "./types";
// import { createAiAnalysis } from "../..//features/snippets/services/ai-analysis";
// import { redis } from "@/lib/redis";
// import { addNewSnippetToCollection } from "@/lib/qdrant";

import { redis } from "../lib/redis";
import { createAiAnalysis } from "../features/snippets/services/ai-analysis";
import { addNewSnippetToCollection } from "../lib/qdrant";

export const summaryWorker = new Worker(
  "ai-code-analysis",
  async (job) => {
    const startTime = Date.now();
    const { code, title, description, language, snippetId } =
      job.data as SummaryTaskData;

    console.log(`Processing summary job ${job.id} for user ${snippetId}`);

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

      const processingTime = Date.now() - startTime;

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
      console.log(`Completed summary job ${job.id} in ${processingTime}ms`);
    } catch (error) {
      console.error(`Failed to process summary job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

summaryWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

summaryWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

summaryWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

export const qdrantIndexWorker = new Worker(
  "qdrant-snippet-index",
  async (job) => {
    const startTime = Date.now();
    const { title, description, code, language, id } =
      job.data as NewSnippetIndex;

    console.log(`Processing Qdrant index job ${job.id} for snippet ${id}`);

    try {
      await job.updateProgress(25);

      await addNewSnippetToCollection({
        id,
        title,
        description,
        language,
        code,
      });
      await job.updateProgress(75);

      const processingTime = Date.now() - startTime;

      await job.updateProgress(100);
      console.log(
        `Completed Qdrant index job ${job.id} in ${processingTime}ms`,
      );
    } catch (error) {
      console.error(`Failed to process Qdrant index job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

qdrantIndexWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

qdrantIndexWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

qdrantIndexWorker.on("error", (err) => {
  console.error("Worker error:", err);
});
