import { z } from "zod/mini";

export const EditSnippetSchema = z.object({
  snippetId: z.number({ error: "Snippet ID is required" }),
  title: z
    .string({ error: "Title is required" })
    .check(
      z.minLength(3, "Title must be at least 3 characters"),
      z.maxLength(100, "Title must be at most 100 characters")
    ),
  description: z
    .string({ error: "Description is required" })
    .check(
      z.minLength(3, "Description must be at least 3 characters"),
      z.maxLength(500, "Description must be at most 500 characters")
    ),
  code: z
    .string({ error: "Code is required" })
    .check(
      z.minLength(3, "Code must be at least 3 characters"),
      z.maxLength(5000, "Code must be at most 5000 characters")
    ),
  changeType: z.enum(["major", "minor", "patch"], {
    error: "Please enter a valid change type",
  }),
});
