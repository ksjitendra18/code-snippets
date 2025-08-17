"use client";

import CodeEditor from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { desc } from "drizzle-orm";
import { generateNewVersion } from "../utils/version";

interface EditSnippetProps {
  lang: string;
  snippetId: string;
  title: string;
  description: string;
  code: string;
  version: string;
}

export function EditSnippet({
  snippetId,
  title,
  description,
  code,
  version,
}: EditSnippetProps) {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();

  const search = searchParams.get("lang");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const code = formData.get("code") as string;
      const language = formData.get("language") as string;

      console.log(title, description, code, language);

      const resp = await fetch("/api/snippets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          code,
          changeType,
          snippetId: Number(snippetId),
        }),
      });

      if (resp.status === 200) {
        router.push("/snippets");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [newVersion, setNewVersion] = useState("");
  const [changeType, setChangeType] = useState<"major" | "minor" | "patch">(
    "patch"
  );
  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-10 ">Edit Snippet</h1>
      <form
        onSubmit={handleSubmit}
        className="flex md:max-w-3/4 px-4 mt-10 mx-auto flex-col"
      >
        <div className="mt-4">
          <label htmlFor="title" className="block">
            Type of Change
          </label>
          <select
            onChange={(e) => {
              setChangeType(e.target.value as "major" | "minor" | "patch");
              setNewVersion(() => generateNewVersion(version, e.target.value));
            }}
            className="w-full rounded-md p-2 border-2"
            id="type"
            name="type"
          >
            <option value="unknown">Select</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="patch">Patch</option>
          </select>
        </div>

        {/* <div>Current Version: {version}</div> */}
        {newVersion && <div className="mt-2">New Version: {newVersion}</div>}
        <div className="mt-4">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            className="border-gray-400 outline-black border-2 w-full rounded-md p-2"
            type="text"
            id="title"
            defaultValue={title}
            name="title"
            placeholder="Title"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            className="border-2 border-gray-400  outline-black w-full rounded-md p-2"
            id="description"
            name="description"
            defaultValue={description || ""}
            placeholder="Description"
          ></textarea>
        </div>

        <div className="mt-4">
          <label htmlFor="code" className="block">
            Code
          </label>

          <textarea
            className="border-2 border-gray-400  outline-black w-full rounded-md p-2"
            id="code"
            name="code"
            rows={10}
            defaultValue={code}
            placeholder="Code"
          ></textarea>
        </div>

        <Button disabled={isLoading} className="my-5" type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Edit Snippet"}
        </Button>
      </form>
    </>
  );
}
