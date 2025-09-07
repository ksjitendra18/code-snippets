import { z } from "zod/mini";

export const NewSnippetSchema = z.object({
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
      z.maxLength(10000, "Code must be at most 10_000 characters")
    ),
  language: z
    .string({ error: "Language is required" })
    .check(
      z.minLength(2, "Language must be at least 2 characters"),
      z.maxLength(64, "Language must be at most 64 characters")
    ),
});
