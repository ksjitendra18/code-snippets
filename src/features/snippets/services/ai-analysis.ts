import { db } from "@/db";
import { snippetAIAnalysis } from "@/db/schema";
import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod/v4";

export const getAIAnalysisBySnippetId = async (snippetId: number) => {
  "use cache";
  cacheLife("max");
  cacheTag(`snippet-ai-analysis-${snippetId}`);
  const result = await db.query.snippetAIAnalysis.findFirst({
    where: {
      snippetId,
    },
  });

  return result;
};

const AIAnalysisSchema = z.object({
  codeFunctionality: z
    .string()
    .describe(
      "A clear, concise explanation of what this code does, its main purpose, and key features",
    ),
  optimizations: z
    .array(
      z.object({
        type: z
          .enum([
            "performance",
            "readability",
            "security",
            "maintainability",
            "best-practices",
          ])
          .describe("The category of optimization"),
        title: z
          .string()
          .describe("Brief title of the optimization suggestion"),
        description: z
          .string()
          .describe("Detailed explanation of the optimization"),
        priority: z
          .enum(["low", "medium", "high"])
          .describe("Priority level of this optimization"),
      }),
    )
    .describe("Array of optimization suggestions for the code"),
  additionalRecommendations: z
    .string()
    .describe(
      "General recommendations, alternative approaches, or related concepts that might be helpful",
    ),
});

export const createAiAnalysis = async ({
  title,
  description,
  code,
  language,
  snippetId,
}: {
  title: string;
  description: string;
  code: string;
  language: string;
  snippetId: number;
}) => {
  const { output: analysis } = await generateText({
    model: openai("gpt-4o-mini"),
    output: Output.object({
      schema: AIAnalysisSchema,
    }),
    prompt: createAnalysisPrompt({
      code,
      description,
      language,
      title,
      tags: [],
    }),
    temperature: 0.3,
  });

  await db.insert(snippetAIAnalysis).values({
    snippetId,
    codeFunctionality: analysis.codeFunctionality,
    optimizations: analysis.optimizations,
    additionalRecommendations: analysis.additionalRecommendations,
  });
};

interface LocalSnippetData {
  title: string;
  description: string;
  code: string;
  language: string;
  tags?: string[];
}

function createAnalysisPrompt(snippet: LocalSnippetData): string {
  const tagsText =
    snippet.tags && snippet.tags.length > 0
      ? `Tags: ${snippet.tags.join(", ")}\n`
      : "";

  return `Please analyze the following ${snippet.language} code snippet and provide a comprehensive analysis:

Title: ${snippet.title}
Description: ${snippet.description}
Language: ${snippet.language}
${tagsText}

Code:
\`\`\`${snippet.language}
${snippet.code}
\`\`\`

Please provide:

1. **Code Functionality**: Explain what this code does, its main purpose, and how it works. Be clear and concise.

2. **Optimizations**: Identify specific improvements across these categories:
   - Performance: Speed, memory usage, algorithmic efficiency
   - Readability: Code clarity, naming, structure
   - Security: Potential vulnerabilities or security best practices
   - Maintainability: Code organization, modularity, extensibility
   - Best Practices: Language-specific conventions and patterns

   For each optimization, provide:
   - Clear description of the issue/improvement
   - Priority level (low/medium/high)
   - Optionally include improved code examples

3. **Additional Recommendations**: General advice, alternative approaches, related concepts, or broader architectural considerations.

Focus on practical, actionable insights that would help developers understand and improve this code.`;
}
