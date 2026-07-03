import { redisConnectionOptions } from "@/lib/redis";
import { Queue } from "bullmq";

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 2000,
  },
  removeOnComplete: 10,
  removeOnFail: 5,
};

export const aiCodeAnalysisQueue = new Queue("ai-code-analysis", {
  connection: redisConnectionOptions,
  defaultJobOptions,
});

export const qdrantSnippetIndexQueue = new Queue("qdrant-snippet-index", {
  connection: redisConnectionOptions,
  defaultJobOptions,
});

export const meiliIndexQueue = new Queue("meili-snippet-index", {
  connection: redisConnectionOptions,
  defaultJobOptions,
});
