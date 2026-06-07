import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-500">
            エピソードトークを育てるネタ帳
          </p>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            AIネタ帳
          </h1>

          <p className="mb-8 leading-7 text-gray-600">
            思いついたエピソードを保存し、あとからオチや本番用のセリフを整理できるWebアプリです。
            将来的にはAIによるオチ生成やAI審査員機能も追加します。
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ideas"
              className="rounded-xl bg-gray-900 px-5 py-3 text-center font-semibold text-white hover:bg-gray-700"
            >
              ネタをチェック
            </Link>

            <Link
              href="/ideas/new"
              className="rounded-xl border border-gray-300 px-5 py-3 text-center font-semibold text-gray-900 hover:bg-gray-100"
            >
              ネタを新規追加
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}