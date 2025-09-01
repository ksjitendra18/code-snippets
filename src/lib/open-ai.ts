import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  headers: {
    "header-name": "header-value",
  },
});
