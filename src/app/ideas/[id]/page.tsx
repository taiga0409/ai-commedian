import Link from "next/link";
import { notFound } from "next/navigation";
import type { Idea } from "@/types/idea";
import { AiAnalysisPanel } from "@/components/AiAnalysisPanel";
import { getIdeaById } from "@/lib/ideasRepository";
import {
  AUDIENCE_SIZE_LABELS,
  AUDIENCE_TYPE_LABELS,
  COMEDY_LEVEL_LABELS,
  IDEA_STATUS_LABELS,
  MOOD_LABELS,
  SCENE_LABELS,
  TALK_LENGTH_LABELS,
} from "@/types/idea";

type IdeaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DetailSectionProps = {
  title: string;
  children?: React.ReactNode;
};

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-bold text-gray-500">{title}</h2>
      <div className="whitespace-pre-wrap leading-7 text-gray-800">
        {children || <span className="text-gray-400">未入力</span>}
      </div>
    </section>
  );
}

type TagListProps = {
  items: string[];
};

function TagList({ items }: TagListProps) {
  if (items.length === 0) {
    return <span className="text-gray-400">未入力</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}



export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params;
  const idea = await getIdeaById(id);

  if (!idea) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/ideas"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            ← ネタ一覧へ戻る
          </Link>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              {IDEA_STATUS_LABELS[idea.status]}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {idea.category || "未分類"}
            </span>
          </div>

          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{idea.title}</h1>

            <Link
              href={`/ideas/${idea.id}/edit`}
              className="rounded-xl border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              編集する
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              作成日: {new Date(idea.createdAt).toLocaleDateString("ja-JP")}
            </span>
            <span>
              更新日: {new Date(idea.updatedAt).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <DetailSection title="思いつきメモ">
            {idea.episodeRough}
          </DetailSection>

          <DetailSection title="本番用の本文">
            {idea.episodeMain}
          </DetailSection>

          <DetailSection title="オチ">{idea.punchline}</DetailSection>

          <DetailSection title="備考">{idea.note}</DetailSection>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-500">
              分類・検索用情報
            </h2>

            <div className="grid gap-5">
              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">タグ</p>
                <TagList items={idea.tags} />
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">雰囲気</p>
                <TagList
                  items={idea.moods.map((mood) => MOOD_LABELS[mood])}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">
                  使える場面
                </p>
                <TagList
                  items={idea.suitableScenes.map(
                    (scene) => SCENE_LABELS[scene]
                  )}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">
                  向いている相手
                </p>
                <TagList
                  items={idea.audienceTypes.map(
                    (audienceType) => AUDIENCE_TYPE_LABELS[audienceType]
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="mb-2 text-xs font-bold text-gray-500">尺</p>
                  <p className="text-sm text-gray-800">
                    {idea.talkLength
                      ? TALK_LENGTH_LABELS[idea.talkLength]
                      : "未入力"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-gray-500">
                    人数規模
                  </p>
                  <p className="text-sm text-gray-800">
                    {idea.audienceSize
                      ? AUDIENCE_SIZE_LABELS[idea.audienceSize]
                      : "未入力"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-gray-500">
                    お笑い理解度
                  </p>
                  <p className="text-sm text-gray-800">
                    {idea.audienceComedyLevel
                      ? COMEDY_LEVEL_LABELS[idea.audienceComedyLevel]
                      : "未入力"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">
                  AI分類理由
                </p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                  {idea.classificationReason || "未入力"}
                </p>
              </div>
            </div>
          </section>

          <AiAnalysisPanel idea={idea} />

          
        </div>
      </div>
    </main>
  );
}