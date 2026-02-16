"use client";

import CodeEditor from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function AddNewSnippet() {
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

      const resp = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          code,
          language,
        }),
      });

      if (resp.status === 201) {
        router.push("/snippets");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-10 ">Add New Snippet</h1>
      <form
        onSubmit={handleSubmit}
        className="flex md:max-w-3/4 px-4 mt-10 mx-auto flex-col"
      >
        <div className="mt-4">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            className="border-gray-400 outline-black border-2 w-full rounded-md p-2"
            type="text"
            id="title"
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
            placeholder="Code"
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block" htmlFor="language">
            Language
          </label>
          <select
            className="w-full rounded-md p-2 border-2"
            id="language"
            name="language"
            defaultValue={search || ""}
          >
            <option value="dotnet">Dotnet / C#</option>
            <option value="java">Java</option>
            <option value="sql">SQL</option>
            <option value="javascript">JavaScript</option>
            <option value="css">CSS</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="react">React</option>
          </select>
        </div>

        <Button disabled={isLoading} className="my-5" type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Create Snippet"}
        </Button>
      </form>
    </>
  );
}
