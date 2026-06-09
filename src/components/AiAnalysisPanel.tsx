"use client";

import { useState } from "react";
import type { Idea } from "@/types/idea";
import type { AiAnalysisResult } from "@/types/aiAnalysis";
import {
  AUDIENCE_SIZE_LABELS,
  AUDIENCE_TYPE_LABELS,
  COMEDY_LEVEL_LABELS,
  MOOD_LABELS,
  SCENE_LABELS,
  TALK_LENGTH_LABELS,
} from "@/types/idea";

type AiAnalysisPanelProps = {
  idea: Idea;
};

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      {label}
    </span>
  );
}

function ChipList({ labels }: { labels: string[] }) {
  if (labels.length === 0) {
    return <span className="text-sm text-gray-400">未入力</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <Chip key={label} label={label} />
      ))}
    </div>
  );
}

export function AiAnalysisPanel({ idea }: AiAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAnalyze() {
    setIsLoading(true);
    setErrorMessage("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/ideas/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idea),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "AI分析に失敗しました。");
        return;
      }

      setAnalysis(data as AiAnalysisResult);
    } catch (error) {
      console.error(error);
      setErrorMessage("AI分析中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-500">AI分析</h2>
          <p className="mt-1 text-sm text-gray-500">
            ネタを分類し、オチ案・点数・改善レビューを生成します。
          </p>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? "分析中..." : "AI分析する"}
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {analysis && (
        <div className="grid gap-5 border-t border-gray-100 pt-5">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="mb-2 text-xs font-bold text-gray-500">
              AIスコア
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {analysis.aiScore}点
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">
              AI生成オチ
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
              {analysis.aiPunchline}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">
              AIレビュー
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
              {analysis.aiReview}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">
              カテゴリー
            </p>
            <Chip label={analysis.category} />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">タグ</p>
            <ChipList labels={analysis.tags.map((tag) => `#${tag}`)} />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">尺</p>
            <Chip label={TALK_LENGTH_LABELS[analysis.talkLength]} />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">雰囲気</p>
            <ChipList
              labels={analysis.moods.map((mood) => MOOD_LABELS[mood])}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">
              使える場面
            </p>
            <ChipList
              labels={analysis.suitableScenes.map(
                (scene) => SCENE_LABELS[scene]
              )}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">
              向いている相手
            </p>
            <ChipList
              labels={analysis.audienceTypes.map(
                (audienceType) => AUDIENCE_TYPE_LABELS[audienceType]
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold text-gray-500">
                人数規模
              </p>
              <Chip label={AUDIENCE_SIZE_LABELS[analysis.audienceSize]} />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-gray-500">
                お笑い理解度
              </p>
              <Chip
                label={COMEDY_LEVEL_LABELS[analysis.audienceComedyLevel]}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">
              分類理由
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
              {analysis.classificationReason}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}