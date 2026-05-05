import Link from "next/link";
import { getAllChapters } from "@/lib/content";

export default function Home() {
  const chapters = getAllChapters();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 md:px-10">
      <main className="space-y-8">
        <header className="space-y-3 rounded-xl border px-6 py-6" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <p className="text-xs tracking-[0.3em]" style={{ color: "var(--accent)" }}>道 家 文 獻 錄 入</p>
          <h1 className="text-3xl font-semibold tracking-tight">炁體源流</h1>
          <p className="max-w-3xl text-sm opacity-80">
            本站展示《炁體源流》相關文本。當前版本先完成正文線上閱讀，
            后续可扩展全文检索、术语索引和专题导读等功能。
          </p>
          <p className="text-xs opacity-70">
            當前已導入章節數：{chapters.length}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">章節目錄</h2>
          <ul className="space-y-2">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/chapters/${chapter.id}`}
                  className="block rounded-md border px-4 py-3 text-sm transition hover:translate-x-0.5"
                  style={{ borderColor: "var(--border)", background: "var(--card)" }}
                >
                  <span className="font-medium">{chapter.title}</span>
                  <span className="ml-3 text-xs opacity-70">{chapter.id}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
