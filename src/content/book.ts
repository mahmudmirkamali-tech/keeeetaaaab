import type { Chapter } from "./types";
import { front } from "./front";
import { ch0104 } from "./ch01-04";
import { ch0508 } from "./ch05-08";
import { ch0914 } from "./ch09-14";

export const bookTitle = "از دادگستری تا دنیای دیجیتال";
export const bookSubtitle =
  "گفت‌وگوی رئیس دادگستری و یک سرباز درباره حقوق، هوش مصنوعی، بلاک‌چین و آینده عدالت در ایران";

export const chapters: Chapter[] = [...front, ...ch0104, ...ch0508, ...ch0914];

export function chapterPlain(ch: Chapter) {
  return ch.blocks
    .map((b) => (b.k === "box" ? `${b.title} ${b.items.join(" ")}` : b.t))
    .join("\n");
}

export function readingMinutes(ch: Chapter) {
  const words = chapterPlain(ch).trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 180));
}
