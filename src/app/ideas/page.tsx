import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { mockIdeas } from "@/lib/mockIdeas";

export default function IdeasPage() {
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

        <div className="grid gap-4">
          {mockIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
    </main>
  );
}