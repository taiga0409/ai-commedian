import Link from "next/link";
import { IdeaForm } from "@/components/IdeaForm";

export default function NewIdeaPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/ideas"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            ← ネタ一覧へ戻る
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-gray-500">
            ネタ作成
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            新しいネタを仕込む
          </h1>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <IdeaForm />
        </section>
      </div>
    </main>
  );
}