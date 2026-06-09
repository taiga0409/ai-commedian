"use client";

import { useRouter } from "next/navigation";
import { IdeaForm, type IdeaFormValues } from "@/components/IdeaForm";
import type { Idea } from "@/types/idea";

export function NewIdeaForm() {
  const router = useRouter();

  async function handleSubmit(values: IdeaFormValues) {
    const response = await fetch("/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      alert("ネタの作成に失敗しました。");
      return;
    }

    const createdIdea = (await response.json()) as Idea;

    router.push(`/ideas/${createdIdea.id}`);
    router.refresh();
  }

  return <IdeaForm submitLabel="ネタを作成" onSubmit={handleSubmit} />;
}