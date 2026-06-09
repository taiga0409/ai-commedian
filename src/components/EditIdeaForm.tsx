"use client";

import { useRouter } from "next/navigation";
import { IdeaForm, type IdeaFormValues } from "@/components/IdeaForm";
import type { Idea } from "@/types/idea";

type EditIdeaFormProps = {
  idea: Idea;
};

export function EditIdeaForm({ idea }: EditIdeaFormProps) {
  const router = useRouter();

  async function handleSubmit(values: IdeaFormValues) {
    const response = await fetch(`/api/ideas/${idea.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      alert("ネタの更新に失敗しました。");
      return;
    }

    router.push(`/ideas/${idea.id}`);
    router.refresh();
  }

  return (
    <IdeaForm
      initialValues={idea}
      submitLabel="変更を保存"
      onSubmit={handleSubmit}
    />
  );
}