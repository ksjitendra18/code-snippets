import "../src/queue/workers";

console.log("BullMQ workers started...");

process.on("SIGINT", () => {
  console.log("Shutting down workers...");
  process.exit(0);
});
