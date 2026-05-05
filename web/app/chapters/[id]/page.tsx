import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChapters, getChapterById, getChapterNeighbors } from "@/lib/content";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllChapters().map((chapter) => ({ id: chapter.id }));
}

export default async function ChapterPage({ params }: Props) {
  const { id } = await params;
  const chapter = getChapterById(id);
  if (!chapter) notFound();

  const { prev, next } = getChapterNeighbors(id);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
      <div className="mb-6">
        <Link href="/" className="text-sm underline opacity-80">
          返回目錄
        </Link>
      </div>

      <article className="space-y-6 rounded-xl border p-6" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <header className="space-y-2">
          <p className="text-xs opacity-70">{chapter.id}</p>
          <h1 className="text-2xl font-semibold">{chapter.title}</h1>
        </header>

        <pre
          className="whitespace-pre-wrap break-words rounded-md border p-4 text-sm leading-8"
          style={{ borderColor: "var(--border)" }}
        >
          {chapter.content}
        </pre>
      </article>

      <nav className="mt-10 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/chapters/${prev.id}`}
            className="rounded-md border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            ← 上一章
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/chapters/${next.id}`}
            className="rounded-md border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            下一章 →
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
