import Link from "next/link";
import { notFound } from "next/navigation";
import { IdeaForm } from "@/components/IdeaForm";
import { getMockIdeaById } from "@/lib/mockIdeas";

type EditIdeaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditIdeaPage({ params }: EditIdeaPageProps) {
  const { id } = await params;
  const idea = getMockIdeaById(id);

  if (!idea) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/ideas/${idea.id}`}
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            ← 詳細へ戻る
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-gray-500">ネタ編集</p>
          <h1 className="text-3xl font-bold text-gray-900">
            ネタを磨き直す
          </h1>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <IdeaForm initialValues={idea} submitLabel="変更を保存" />
        </section>
      </div>
    </main>
  );
}