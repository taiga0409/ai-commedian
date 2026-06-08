import Link from "next/link";
import { notFound } from "next/navigation";
import { getMockIdeaById } from "@/lib/mockIdeas";
import { IDEA_STATUS_LABELS } from "@/types/idea";

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

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const {id} = await params;
  const idea = getMockIdeaById(id);

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

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {idea.title}
          </h1>

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
          <DetailSection title="実際のエピソード">
            {idea.episode}
          </DetailSection>

          <DetailSection title="本番用のセリフ">
            {idea.performanceText}
          </DetailSection>

          <DetailSection title="オチ">{idea.punchline}</DetailSection>

          <DetailSection title="備考">{idea.note}</DetailSection>
        </div>
      </div>
    </main>
  );
}