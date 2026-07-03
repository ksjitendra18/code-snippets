import { Snippet, SnippetVersion } from "@/db/schema";

export type SummaryTaskData = {
  title: string;
  description: string;
  code: string;
  language: string;
  snippetId: number;
};

export type NewSnippetIndex = Pick<Snippet, "id" | "language"> &
  Pick<SnippetVersion, "title" | "description" | "code">;

export type MeiliIndexTaskData = {
  id: number;
  title: string;
  description: string;
  language: string;
  code: string;
  createdAt?: string | Date | null;
};
