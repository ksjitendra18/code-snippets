import {
  aiCodeAnalysisQueue,
  meiliIndexQueue,
  qdrantSnippetIndexQueue,
} from "./queues";
import {
  MeiliIndexTaskData,
  NewSnippetIndex,
  SummaryTaskData,
} from "./types";

export async function addSummaryJob(
  data: SummaryTaskData,
  priority: number = 0
) {
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

export async function addSnippetToMeiliIndexJob(data: MeiliIndexTaskData) {
  const job = await meiliIndexQueue.add(`add-snippet-to-meili-index`, data, {
    priority: 1,
    delay: 0,
  });
  return job;
}
