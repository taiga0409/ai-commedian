"use client";

import { useState } from "react";
import type { Idea, IdeaStatus } from "@/types/idea";
import { IDEA_STATUS_LABELS } from "@/types/idea";

const statusOptions: IdeaStatus[] = [
  "MATERIAL",
  "WAITING_PUNCHLINE",
  "STRUCTURING",
  "COMPLETED",
  "REJECTED",
];

export type IdeaFormValues = {
  title: string;
  episodeRough: string;
  punchline: string;
  episodeMain: string;
  category: string;
  status: IdeaStatus;
  note: string;
};

const defaultValues: IdeaFormValues = {
  title: "",
  episodeRough: "",
  punchline: "",
  episodeMain: "",
  category: "",
  status: "MATERIAL",
  note: "",
};

type IdeaFormProps = {
  initialValues?: Partial<Idea>;
  submitLabel?: string;
  onSubmit?: (values: IdeaFormValues) => void;
};

export function IdeaForm({
  initialValues,
  submitLabel = "ネタを保存",
  onSubmit,
}: IdeaFormProps) {
  const [values, setValues] = useState<IdeaFormValues>({
    title: initialValues?.title ?? defaultValues.title,
    episodeRough: initialValues?.episodeRough ?? defaultValues.episodeRough,
    punchline: initialValues?.punchline ?? defaultValues.punchline,
    episodeMain: initialValues?.episodeMain ?? defaultValues.episodeMain,
    category: initialValues?.category ?? defaultValues.category,
    status: initialValues?.status ?? defaultValues.status,
    note: initialValues?.note ?? defaultValues.note,
  });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedValues: IdeaFormValues = {
      ...values,
      title: values.title.trim() || `Title_${Date.now()}`,
      episodeRough: values.episodeRough.trim(),
      punchline: values.punchline.trim(),
      episodeMain: values.episodeMain.trim(),
      category: values.category.trim(),
      note: values.note.trim(),
    };

    const hasAnyContent =
      normalizedValues.title.trim() ||
      normalizedValues.episodeRough ||
      normalizedValues.punchline ||
      normalizedValues.episodeMain ||
      normalizedValues.category ||
      normalizedValues.note;

    if (!hasAnyContent) {
      alert("何か1つ入力してください");
      return;
    }

    if (onSubmit) {
      onSubmit(normalizedValues);
      return;
    }

    console.log("送信するネタ:", normalizedValues);
    alert("まだ保存機能は未実装です。入力内容はコンソールに出力しています。");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-bold text-gray-700">
          タイトル
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="未入力の場合は自動でタイトルを作成します"
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="episodeRough"
          className="text-sm font-bold text-gray-700"
        >
          思いつきメモ
        </label>
        <textarea
          id="episodeRough"
          name="episodeRough"
          value={values.episodeRough}
          onChange={handleChange}
          placeholder="思いついたエピソードをそのまま書く"
          rows={6}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="episodeMain" className="text-sm font-bold text-gray-700">
          本番用の本文
        </label>
        <textarea
          id="episodeMain"
          name="episodeMain"
          value={values.episodeMain}
          onChange={handleChange}
          placeholder="人前で話す時の言い方に整える"
          rows={5}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="punchline" className="text-sm font-bold text-gray-700">
          オチ
        </label>
        <textarea
          id="punchline"
          name="punchline"
          value={values.punchline}
          onChange={handleChange}
          placeholder="最後の一言・オチを書く"
          rows={3}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="category" className="text-sm font-bold text-gray-700">
            カテゴリー
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={values.category}
            onChange={handleChange}
            placeholder="例: 日常、電車、バイト"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="status" className="text-sm font-bold text-gray-700">
            ステータス
          </label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {IDEA_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="note" className="text-sm font-bold text-gray-700">
          備考
        </label>
        <textarea
          id="note"
          name="note"
          value={values.note}
          onChange={handleChange}
          placeholder="あとで考えたいこと、改善メモなど"
          rows={4}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}