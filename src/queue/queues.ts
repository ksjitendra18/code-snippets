import { redis } from "@/lib/redis";
import { Queue } from "bullmq";

export const aiCodeAnalysisQueue = new Queue("ai-code-analysis", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 10,
    removeOnFail: 5,
  },
});

export const qdrantSnippetIndexQueue = new Queue("qdrant-snippet-index", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 10,
    removeOnFail: 5,
  },
});
