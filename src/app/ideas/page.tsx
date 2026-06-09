"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import type { Idea, IdeaStatus, Scene, TalkLength } from "@/types/idea";
import {
  IDEA_STATUS_LABELS,
  SCENE_LABELS,
  TALK_LENGTH_LABELS,
} from "@/types/idea";

const statusOptions: IdeaStatus[] = [
  "MATERIAL",
  "WAITING_PUNCHLINE",
  "STRUCTURING",
  "COMPLETED",
  "REJECTED",
];

const sceneOptions: Scene[] = [
  "DRINKING_PARTY",
  "FRIENDS",
  "WORK",
  "FIRST_MEETING",
  "DATE",
  "SNS",
  "STAGE",
  "CASUAL_CHAT",
];

const talkLengthOptions: TalkLength[] = ["SHORT", "MEDIUM", "LONG"];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<IdeaStatus | "ALL">(
    "ALL"
  );
  const [selectedScene, setSelectedScene] = useState<Scene | "ALL">("ALL");
  const [selectedTalkLength, setSelectedTalkLength] = useState<
    TalkLength | "ALL"
  >("ALL");

  useEffect(() => {
    async function fetchIdeas() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/ideas");

        if (!response.ok) {
          throw new Error("ネタ一覧の取得に失敗しました。");
        }

        const data = (await response.json()) as Idea[];
        setIdeas(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("ネタ一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    }

    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesStatus =
      selectedStatus === "ALL" || idea.status === selectedStatus;

    const matchesScene =
      selectedScene === "ALL" || idea.suitableScenes.includes(selectedScene);

    const matchesTalkLength =
      selectedTalkLength === "ALL" || idea.talkLength === selectedTalkLength;

    return matchesStatus && matchesScene && matchesTalkLength;
  });

  function resetFilters() {
    setSelectedStatus("ALL");
    setSelectedScene("ALL");
    setSelectedTalkLength("ALL");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-500">
              ネタ一覧
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              仕込み中のネタ
            </h1>
          </div>

          <Link
            href="/ideas/new"
            className="rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
          >
            ＋ 新規追加
          </Link>
        </div>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-gray-700">絞り込み</h2>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900"
            >
              リセット
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <label
                htmlFor="status"
                className="text-xs font-bold text-gray-500"
              >
                ステータス
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as IdeaStatus | "ALL")
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
              >
                <option value="ALL">すべて</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {IDEA_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="scene"
                className="text-xs font-bold text-gray-500"
              >
                使える場面
              </label>
              <select
                id="scene"
                value={selectedScene}
                onChange={(event) =>
                  setSelectedScene(event.target.value as Scene | "ALL")
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
              >
                <option value="ALL">すべて</option>
                {sceneOptions.map((scene) => (
                  <option key={scene} value={scene}>
                    {SCENE_LABELS[scene]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="talkLength"
                className="text-xs font-bold text-gray-500"
              >
                尺
              </label>
              <select
                id="talkLength"
                value={selectedTalkLength}
                onChange={(event) =>
                  setSelectedTalkLength(event.target.value as TalkLength | "ALL")
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
              >
                <option value="ALL">すべて</option>
                {talkLengthOptions.map((talkLength) => (
                  <option key={talkLength} value={talkLength}>
                    {TALK_LENGTH_LABELS[talkLength]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mb-4 text-sm font-semibold text-gray-500">
          {isLoading ? "読み込み中..." : `${filteredIdeas.length}件のネタ`}
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            ネタを読み込んでいます。
          </div>
        ) : filteredIdeas.length > 0 ? (
          <div className="grid gap-4">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            条件に合うネタがありません。
          </div>
        )}
      </div>
    </main>
  );
}