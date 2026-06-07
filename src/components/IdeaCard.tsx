import Link from "next/link";
import type { Idea } from "@/types/idea";
import { IDEA_STATUS_LABELS } from "@/types/idea";

type IdeaCardProps = {
  idea: Idea;
};

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="line-clamp-1 text-lg font-bold text-gray-900">
          {idea.title}
        </h2>

        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {IDEA_STATUS_LABELS[idea.status]}
        </span>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
        {idea.episode}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{idea.category || "未分類"}</span>
        <span>{new Date(idea.updatedAt).toLocaleDateString("ja-JP")}</span>
      </div>
    </Link>
  );
}