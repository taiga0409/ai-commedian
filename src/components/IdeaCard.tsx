import Link from "next/link";
import type { Idea } from "@/types/idea";
import {
  IDEA_STATUS_LABELS,
  SCENE_LABELS,
  TALK_LENGTH_LABELS,
} from "@/types/idea";

type IdeaCardProps = {
  idea: Idea;
};

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      {label}
    </span>
  );
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const sceneLabels = idea.suitableScenes.map((scene) => SCENE_LABELS[scene]);
  const visibleTags = idea.tags.slice(0, 3);
  const hiddenTagCount = Math.max(idea.tags.length - visibleTags.length, 0);

  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="line-clamp-1 text-lg font-bold text-gray-900">
            {idea.title}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {idea.category || "未分類"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
          {IDEA_STATUS_LABELS[idea.status]}
        </span>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
        {idea.episodeRough || "思いつきメモは未入力です。"}
      </p>

      <div className="mb-4 grid gap-3">
        <div className="flex flex-wrap gap-2">
          {idea.talkLength && <Chip label={TALK_LENGTH_LABELS[idea.talkLength]} />}

          {sceneLabels.slice(0, 3).map((sceneLabel) => (
            <Chip key={sceneLabel} label={sceneLabel} />
          ))}
        </div>

        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500"
              >
                #{tag}
              </span>
            ))}

            {hiddenTagCount > 0 && (
              <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                +{hiddenTagCount}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end text-xs text-gray-500">
        <span>{new Date(idea.updatedAt).toLocaleDateString("ja-JP")}</span>
      </div>
    </Link>
  );
}