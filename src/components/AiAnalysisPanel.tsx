"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AudienceSize,
  AudienceType,
  ComedyLevel,
  Idea,
  Mood,
  Scene,
  TalkLength,
} from "@/types/idea";
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

type SaveField =
  | "category"
  | "tags"
  | "talkLength"
  | "moods"
  | "suitableScenes"
  | "audienceTypes"
  | "audienceSize"
  | "audienceComedyLevel"
  | "classificationReason";

const saveFieldLabels: Record<SaveField, string> = {
  category: "カテゴリー",
  tags: "タグ",
  talkLength: "尺",
  moods: "雰囲気",
  suitableScenes: "使える場面",
  audienceTypes: "向いている相手",
  audienceSize: "人数規模",
  audienceComedyLevel: "お笑い理解度",
  classificationReason: "分類理由",
};

const initialAcceptedFields: Record<SaveField, boolean> = {
  category: false,
  tags: false,
  talkLength: false,
  moods: false,
  suitableScenes: false,
  audienceTypes: false,
  audienceSize: false,
  audienceComedyLevel: false,
  classificationReason: false,
};

const talkLengthOptions = Object.keys(TALK_LENGTH_LABELS) as TalkLength[];
const moodOptions = Object.keys(MOOD_LABELS) as Mood[];
const sceneOptions = Object.keys(SCENE_LABELS) as Scene[];
const audienceTypeOptions = Object.keys(
  AUDIENCE_TYPE_LABELS
) as AudienceType[];
const audienceSizeOptions = Object.keys(
  AUDIENCE_SIZE_LABELS
) as AudienceSize[];
const comedyLevelOptions = Object.keys(
  COMEDY_LEVEL_LABELS
) as ComedyLevel[];

function AdoptionButton({
  field,
  acceptedFields,
  onToggle,
}: {
  field: SaveField;
  acceptedFields: Record<SaveField, boolean>;
  onToggle: (field: SaveField) => void;
}) {
  const isAccepted = acceptedFields[field];

  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className={
        isAccepted
          ? "rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white hover:bg-gray-700"
          : "rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100"
      }
    >
      {isAccepted ? "採用中" : "採用する"}
    </button>
  );
}

function FieldHeader({
  field,
}: {
  field: SaveField;
  acceptedFields: Record<SaveField, boolean>;
  onToggle: (field: SaveField) => void;
}) {
  return (
    <p className="mb-2 text-xs font-bold text-gray-500">
      {saveFieldLabels[field]}
    </p>
  );
}

export function AiAnalysisPanel({ idea }: AiAnalysisPanelProps) {
  const router = useRouter();

  const [editableAnalysis, setEditableAnalysis] =
    useState<AiAnalysisResult | null>(null);
  const [acceptedFields, setAcceptedFields] =
    useState<Record<SaveField, boolean>>(initialAcceptedFields);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function toggleAcceptedField(field: SaveField) {
    setAcceptedFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function updateEditableAnalysis(values: Partial<AiAnalysisResult>) {
    setEditableAnalysis((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...values,
      };
    });
  }

  function toggleArrayValue<T extends string>(
    values: T[],
    value: T,
    checked: boolean
  ) {
    if (checked) {
      return [...values, value];
    }

    return values.filter((currentValue) => currentValue !== value);
  }

  async function handleAnalyze() {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setEditableAnalysis(null);
    setAcceptedFields(initialAcceptedFields);

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

      setEditableAnalysis(data as AiAnalysisResult);
    } catch (error) {
      console.error(error);
      setErrorMessage("AI分析中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveAnalysis() {
    if (!editableAnalysis) {
      return;
    }

    const payload: Partial<Idea> = {
        aiPunchline: editableAnalysis.aiPunchline,
        aiScore: editableAnalysis.aiScore,
        aiReview: editableAnalysis.aiReview,
    };

    if (acceptedFields.category) {
      payload.category = editableAnalysis.category;
    }

    if (acceptedFields.tags) {
      payload.tags = editableAnalysis.tags;
    }

    if (acceptedFields.talkLength) {
      payload.talkLength = editableAnalysis.talkLength;
    }

    if (acceptedFields.moods) {
      payload.moods = editableAnalysis.moods;
    }

    if (acceptedFields.suitableScenes) {
      payload.suitableScenes = editableAnalysis.suitableScenes;
    }

    if (acceptedFields.audienceTypes) {
      payload.audienceTypes = editableAnalysis.audienceTypes;
    }

    if (acceptedFields.audienceSize) {
      payload.audienceSize = editableAnalysis.audienceSize;
    }

    if (acceptedFields.audienceComedyLevel) {
      payload.audienceComedyLevel = editableAnalysis.audienceComedyLevel;
    }

    if (acceptedFields.classificationReason) {
      payload.classificationReason = editableAnalysis.classificationReason;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/ideas/${idea.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setErrorMessage("採用したAI分析結果の保存に失敗しました。");
        return;
      }

      setSuccessMessage("採用したAI分析結果を保存しました。");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("AI分析結果の保存中にエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-500">AI分析</h2>
          <p className="mt-1 text-sm text-gray-500">
            ネタを分類し、オチ案・点数・改善レビューを生成します。
            採用した項目だけ保存できます。
          </p>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading || isSaving}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? "分析中..." : "AI分析する"}
        </button>
      </div>

      

      {editableAnalysis && (
        <div className="grid gap-5 border-t border-gray-100 pt-5">
          

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="mb-2 text-xs font-bold text-gray-500">AIスコア</p>
            <p className="text-3xl font-bold text-gray-900">
                {editableAnalysis.aiScore}点
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">AI生成オチ</p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                {editableAnalysis.aiPunchline}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">AIレビュー</p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                {editableAnalysis.aiReview}
            </p>
          </div>

          <div>
            <FieldHeader
                field="category"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
            />
            <input
                type="text"
                value={editableAnalysis.category}
                onChange={(event) =>
                updateEditableAnalysis({
                    category: event.target.value,
                })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
            />

            <div className="mt-2 flex justify-end">
                <AdoptionButton
                field="category"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
            </div>
          </div>

          <div>
            <FieldHeader
                field="tags"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
            />
            <input
                type="text"
                value={editableAnalysis.tags.join(", ")}
                onChange={(event) =>
                updateEditableAnalysis({
                    tags: event.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
                }
                placeholder="例: コンビニ, 日常, あるある"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
            <p className="mt-2 text-xs text-gray-400">
                カンマ区切りで編集できます。
            </p>

            <div className="mt-2 flex justify-end">
                <AdoptionButton
                field="tags"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
            </div>
          </div>

          <div>
            <FieldHeader
                field="moods"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
            />
            <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                <label
                    key={mood}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700"
                >
                    <input
                    type="checkbox"
                    checked={editableAnalysis.moods.includes(mood)}
                    onChange={(event) =>
                        updateEditableAnalysis({
                        moods: toggleArrayValue(
                            editableAnalysis.moods,
                            mood,
                            event.target.checked
                        ),
                        })
                    }
                    />
                    {MOOD_LABELS[mood]}
                </label>
                ))}
            </div>

            <div className="mt-2 flex justify-end">
                <AdoptionButton
                field="moods"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
            </div>
          </div>


          <div>
            <FieldHeader
              field="audienceTypes"
              acceptedFields={acceptedFields}
              onToggle={toggleAcceptedField}
            />
            <div className="flex flex-wrap gap-2">
              {audienceTypeOptions.map((audienceType) => (
                <label
                  key={audienceType}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={editableAnalysis.audienceTypes.includes(
                      audienceType
                    )}
                    onChange={(event) =>
                      updateEditableAnalysis({
                        audienceTypes: toggleArrayValue(
                          editableAnalysis.audienceTypes,
                          audienceType,
                          event.target.checked
                        ),
                      })
                    }
                  />
                  {AUDIENCE_TYPE_LABELS[audienceType]}
                </label>
              ))}

              
            </div>
            <div className="mt-2 flex justify-end">
                <AdoptionButton
                field="audienceTypes"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
                <FieldHeader
                field="talkLength"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
                <select
                value={editableAnalysis.talkLength}
                onChange={(event) =>
                    updateEditableAnalysis({
                    talkLength: event.target.value as TalkLength,
                    })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
                >
                {talkLengthOptions.map((talkLength) => (
                    <option key={talkLength} value={talkLength}>
                    {TALK_LENGTH_LABELS[talkLength]}
                    </option>
                ))}
                </select>
                <div className="mt-2 flex justify-end">
                    <AdoptionButton
                    field="talkLength"
                    acceptedFields={acceptedFields}
                    onToggle={toggleAcceptedField}
                    />
                </div>
            </div>
            <div>
              <FieldHeader
                field="audienceSize"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
              />
              <select
                value={editableAnalysis.audienceSize}
                onChange={(event) =>
                  updateEditableAnalysis({
                    audienceSize: event.target.value as AudienceSize,
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
              >
                {audienceSizeOptions.map((audienceSize) => (
                  <option key={audienceSize} value={audienceSize}>
                    {AUDIENCE_SIZE_LABELS[audienceSize]}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex justify-end">
                <AdoptionButton
                field="audienceSize"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
              </div>
            </div>

            <div>
              <FieldHeader
                field="audienceComedyLevel"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
              />
              <select
                value={editableAnalysis.audienceComedyLevel}
                onChange={(event) =>
                  updateEditableAnalysis({
                    audienceComedyLevel: event.target.value as ComedyLevel,
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
              >
                {comedyLevelOptions.map((comedyLevel) => (
                  <option key={comedyLevel} value={comedyLevel}>
                    {COMEDY_LEVEL_LABELS[comedyLevel]}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex justify-end">
                <AdoptionButton
                field="audienceComedyLevel"
                acceptedFields={acceptedFields}
                onToggle={toggleAcceptedField}
                />
              </div>
            </div>
          </div>

          {/* <div>
            <FieldHeader
              field="classificationReason"
              acceptedFields={acceptedFields}
              onToggle={toggleAcceptedField}
            />
            <textarea
              value={editableAnalysis.classificationReason}
              onChange={(event) =>
                updateEditableAnalysis({
                  classificationReason: event.target.value,
                })
              }
              rows={5}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none focus:border-gray-900"
            />
          </div> */}

          <div className="pt-4">
            {(errorMessage || successMessage) && (
                <div className="mb-6 grid gap-3">
                {errorMessage && (
                    <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-700">
                    {successMessage}
                    </div>
                )}
                </div>
            )}

            <div className="flex justify-center">
                <button
                type="button"
                onClick={handleSaveAnalysis}
                disabled={isSaving}
                className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                {isSaving ? "保存中..." : "AI結果を保存"}
                </button>
            </div>
          </div>

        </div>
        
      )}

    </section>
  );
}