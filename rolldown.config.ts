import { defineConfig } from "rolldown";

export default defineConfig({
  input: "./scripts/worker.ts",
  output: {
    dir: "./scripts/dist",
  },
  platform: "node",
});
