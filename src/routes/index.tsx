import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookReader } from "@/components/book-reader";
import { chapters } from "@/content/book";

type Search = { c: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const c = typeof search.c === "string" ? search.c : "cover";
    if (c !== "cover" && !chapters.some((ch) => ch.id === c)) return { c: "cover" };
    return { c };
  },
  component: Home,
});

function Home() {
  const { c } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  return <BookReader chapterId={c} onChapter={(id) => navigate({ search: { c: id } })} />;
}
