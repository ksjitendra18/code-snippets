import client from "../lib/meilisearch";

async function checkTaskStatus(taskUid: number) {
  try {
    const task = await client.tasks.getTask(taskUid,{
        
    });
    // console.log('Task status:', task.status)
    console.log("Task details:", task);
    return task;
  } catch (error) {
    console.error("Error checking task:", error);
  }
}

// Check your specific task
checkTaskStatus(7);
