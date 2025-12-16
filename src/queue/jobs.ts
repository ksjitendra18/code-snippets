import { aiCodeAnalysisQueue, qdrantSnippetIndexQueue } from "./queues";
import { NewSnippetIndex, SummaryTaskData } from "./types";

export async function addSummaryJob(
  data: SummaryTaskData,
  priority: number = 0
) {
  console.log("Adding AI Analysis job...", data, new Date());
  const job = await aiCodeAnalysisQueue.add(`generate-ai-summary`, data, {
    priority,
    delay: 0,
  });

  return job;
}

export async function getSummaryJobStatus(jobId: string) {
  const job = await aiCodeAnalysisQueue.getJob(jobId);
  return job;
}

export async function addSnippetToQdrantIndexJob({
  data,
  priority,
}: {
  data: NewSnippetIndex;
  priority: number;
}) {
  console.log("Adding Snippet to Qdrant index job...", data, new Date());
  const job = await qdrantSnippetIndexQueue.add(
    `add-snippet-to-qdrant-index`,
    data,
    {
      priority,
      delay: 0,
    }
  );

  return job;
}
