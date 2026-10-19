import { useEffect, useMemo, useState } from "react";
import { BookOpen, Code2, Crown, Gavel, Moon, Scale, Search, Sun, Type, X } from "lucide-react";
import { bookSubtitle, bookTitle, chapterPlain, chapters, readingMinutes } from "@/content/book";
import type { Block } from "@/content/types";

const STORAGE_KEY = "dadgostari-reader-v1";
const SIZES = ["1.2rem", "1.35rem", "1.55rem"] as const;

type Prefs = { theme: "day" | "night"; size: number; last: string };

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { theme: "day", size: 1, last: "cover" };
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      theme: parsed.theme === "night" ? "night" : "day",
      size: parsed.size === 0 || parsed.size === 2 ? parsed.size : 1,
      last: typeof parsed.last === "string" ? parsed.last : "cover",
    };
  } catch {
    return { theme: "day", size: 1, last: "cover" };
  }
}

function Blocks({ blocks }: { blocks: Block[] }) {
  let prev: Block["k"] extends never ? string : string | null = null;
  return (
    <div className="reading book-body text-ink">
      {blocks.map((block, i) => {
        if (block.k === "h") {
          prev = null;
          return <h2 key={i}>{block.t}</h2>;
        }
        if (block.k === "q") {
          prev = null;
          return (
            <blockquote key={i} className="law-quote">
              {block.t}
            </blockquote>
          );
        }
        if (block.k === "d") {
          const show = prev !== block.who;
          prev = block.who;
          return (
            <p key={i}>
              {show ? (
                <span className="dlg-label">
                  {block.who === "doctor" ? "دکتر خوشنویس" : "سرباز محمود"}
                </span>
              ) : null}
              {block.t}
            </p>
          );
        }
        if (block.k === "box") {
          prev = null;
          return (
            <section key={i} className="endnote">
              <h3>{block.title}</h3>
              <ul>
                {block.items.map((item, n) => (
                  <li key={n}>{item}</li>
                ))}
              </ul>
            </section>
          );
        }
        prev = null;
        return <p key={i}>{block.t}</p>;
      })}
    </div>
  );
}

export function BookReader({
  chapterId,
  onChapter,
}: {
  chapterId: string;
  onChapter: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [prefs, setPrefs] = useState<Prefs>({ theme: "day", size: 1, last: "cover" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = loadPrefs();
    setPrefs(next);
    document.documentElement.dataset.theme = next.theme;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = prefs.theme;
    if (chapterId !== "cover" && prefs.last !== chapterId) {
      const next = { ...prefs, last: chapterId };
      setPrefs(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    window.scrollTo(0, 0);
    setOpen(false);
  }, [chapterId, ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowLeft") {
        const i = chapters.findIndex((c) => c.id === chapterId);
        const next = chapters[i + 1];
        if (chapterId === "cover") onChapter(chapters[0].id);
        else if (next) onChapter(next.id);
      }
      if (e.key === "ArrowRight") {
        const i = chapters.findIndex((c) => c.id === chapterId);
        if (i === 0) onChapter("cover");
        else if (i > 0) onChapter(chapters[i - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapterId, onChapter]);

  const chapter = chapters.find((c) => c.id === chapterId) ?? null;
  const index = chapter ? chapters.findIndex((c) => c.id === chapter.id) : -1;

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return chapters;
    return chapters.filter((ch) => `${ch.part} ${ch.title} ${chapterPlain(ch)}`.includes(q));
  }, [query]);

  function update(partial: Partial<Prefs>) {
    const next = { ...prefs, ...partial, last: chapterId };
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (partial.theme) document.documentElement.dataset.theme = partial.theme;
  }

  const progress =
    chapterId === "cover" || index < 0 ? 0 : Math.round(((index + 1) / chapters.length) * 100);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="فهرست"
          >
            <BookOpen className="size-5" />
          </button>
          <button type="button" className="min-w-0 flex-1 text-start" onClick={() => onChapter("cover")}>
            <span className="block truncate text-sm font-medium">{bookTitle}</span>
            <span className="block truncate text-xs text-muted">
              {chapter ? chapter.part : "کتاب گفت‌وگو"}
            </span>
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line"
            onClick={() => update({ size: (prefs.size + 1) % 3 })}
            aria-label="اندازه متن"
          >
            <Type className="size-5" />
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line"
            onClick={() => update({ theme: prefs.theme === "night" ? "day" : "night" })}
            aria-label="حالت شب"
          >
            {prefs.theme === "night" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </div>
        <div className="h-0.5 bg-line">
          <div className="h-full bg-oxblood" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto border-e border-line px-4 py-6 lg:block">
          <Toc query={query} setQuery={setQuery} chapterId={chapterId} onChapter={onChapter} items={filtered} />
        </aside>

        <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12">
          {chapterId === "cover" || !chapter ? (
            <Cover
              resume={ready && prefs.last !== "cover" && prefs.last !== chapterId ? prefs.last : null}
              onChapter={onChapter}
            />
          ) : (
            <article style={{ ["--read-size" as string]: SIZES[prefs.size] }}>
              <p className="font-sans text-sm text-brass">{chapter.part}</p>
              <h1 className="mt-2 font-serif text-4xl leading-tight font-semibold text-ink sm:text-5xl">
                {chapter.title}
              </h1>
              <p className="mt-3 font-sans text-sm text-muted">حدود {readingMinutes(chapter)} دقیقه مطالعه</p>
              <div className="mt-2 h-px w-16 bg-oxblood" />
              <div className="mt-6">
                <Blocks blocks={chapter.blocks} />
              </div>
              <nav className="mt-12 flex items-stretch gap-3 border-t border-line pt-6">
                <button
                  type="button"
                  className="min-h-11 flex-1 rounded-md border border-line px-3 py-3 text-start text-sm"
                  onClick={() => onChapter(index <= 0 ? "cover" : chapters[index - 1].id)}
                >
                  <span className="block text-xs text-muted">قبلی</span>
                  {index <= 0 ? "جلد کتاب" : chapters[index - 1].title}
                </button>
                <button
                  type="button"
                  className="min-h-11 flex-1 rounded-md border border-line px-3 py-3 text-end text-sm disabled:opacity-40"
                  disabled={index === chapters.length - 1}
                  onClick={() => index < chapters.length - 1 && onChapter(chapters[index + 1].id)}
                >
                  <span className="block text-xs text-muted">بعدی</span>
                  {index === chapters.length - 1 ? "پایان" : chapters[index + 1].title}
                </button>
              </nav>
            </article>
          )}
        </main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-night/50" aria-label="بستن" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0 flex w-[min(100%,22rem)] flex-col bg-paper p-4 shadow-none">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium">فهرست</p>
              <button type="button" className="inline-flex size-11 items-center justify-center" onClick={() => setOpen(false)} aria-label="بستن فهرست">
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Toc query={query} setQuery={setQuery} chapterId={chapterId} onChapter={onChapter} items={filtered} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Cover({ resume, onChapter }: { resume: string | null; onChapter: (id: string) => void }) {
  const resumeChapter = chapters.find((c) => c.id === resume);
  return (
    <div className="mx-auto max-w-5xl py-4 sm:py-12">
      <div className="cover-layout">
        <div className="cover-art" aria-label="جلد کتاب با نماد ترازو، چکش قاضی، شاه و کد پرچم ایران">
          <div className="cover-stripe cover-stripe-green" />
          <div className="cover-stripe cover-stripe-white" />
          <div className="cover-stripe cover-stripe-red" />
          <div className="cover-code"><Code2 size={18} /> 01 · 10 · 1403</div>
          <div className="cover-crown"><Crown size={34} strokeWidth={1.5} /></div>
          <div className="cover-symbols">
            <Scale size={112} strokeWidth={1.1} />
            <Gavel className="cover-gavel" size={70} strokeWidth={1.25} />
          </div>
          <div className="cover-rule" />
          <span className="cover-edition">روایت‌هایی از عدالت و فناوری</span>
        </div>
        <div className="cover-copy">
          <p className="font-sans text-sm text-brass">گفت‌وگویی برای قضاوت در عصر کد</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight font-semibold sm:text-6xl">{bookTitle}</h1>
      <p className="book-body mt-6 text-2xl leading-relaxed text-ink">{bookSubtitle}</p>
      <div className="mt-8 h-px w-20 bg-oxblood" />
      <dl className="mt-6 space-y-3 font-sans text-sm">
        <div>
          <dt className="text-muted">دکتر خوشنویس</dt>
          <dd>رئیس دادگستری؛ تجربه حکم، مسئولیت و حد قانون</dd>
        </div>
        <div>
          <dt className="text-muted">سرباز محمود</dt>
          <dd>سرباز دفتر؛ مشاهده مردم، و زبان ابزارهای نو</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="min-h-11 rounded-md bg-oxblood px-5 py-3 text-sm font-medium text-soft"
          onClick={() => onChapter("note")}
        >
          شروع از یادداشت نویسندگان
        </button>
        <button
          type="button"
          className="min-h-11 rounded-md border border-line px-5 py-3 text-sm"
          onClick={() => onChapter("c1")}
        >
          رفتن به فصل اول
        </button>
      </div>
      {resumeChapter ? (
        <button type="button" className="mt-4 text-sm text-brass underline-offset-4 hover:underline" onClick={() => onChapter(resumeChapter.id)}>
          ادامه از {resumeChapter.part}: {resumeChapter.title}
        </button>
      ) : null}
      <p className="mt-10 text-sm leading-7 text-muted">
        چهارده فصل، از برخورد عدالت با الگوریتم تا نقشه راه قانون‌گذاری. گفت‌وگوها بازآفرینی شده‌اند و هر جا نص قانون ساکت است، متن میان قانون، سند سیاستی و پیشنهاد نویسندگان فاصله گذاشته است.
      </p>
        </div>
      </div>
    </div>
  );
}

function Toc({
  query,
  setQuery,
  chapterId,
  onChapter,
  items,
}: {
  query: string;
  setQuery: (v: string) => void;
  chapterId: string;
  onChapter: (id: string) => void;
  items: typeof chapters;
}) {
  return (
    <div>
      <label className="relative block">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجو در کتاب"
          className="h-11 w-full rounded-md border border-line bg-soft ps-10 pe-3 text-sm outline-none"
        />
      </label>
      <button
        type="button"
        onClick={() => onChapter("cover")}
        className={`mt-4 block w-full rounded-md px-2 py-2 text-start text-sm ${chapterId === "cover" ? "bg-soft text-oxblood" : ""}`}
      >
        جلد کتاب
      </button>
      <ol className="mt-2 space-y-1">
        {items.map((ch) => (
          <li key={ch.id}>
            <button
              type="button"
              onClick={() => onChapter(ch.id)}
              className={`w-full rounded-md px-2 py-2 text-start ${chapterId === ch.id ? "bg-soft" : ""}`}
            >
              <span className="block text-xs text-brass">{ch.part}</span>
              <span className="mt-0.5 block text-sm leading-6">{ch.title}</span>
            </button>
          </li>
        ))}
      </ol>
      {items.length === 0 ? <p className="mt-4 text-sm text-muted">چیزی با این عبارت پیدا نشد.</p> : null}
    </div>
  );
}
