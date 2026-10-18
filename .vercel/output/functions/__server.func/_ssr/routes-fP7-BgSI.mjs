import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search, i as Sun, n as Type, o as Moon, s as BookOpen, t as X } from "../_libs/lucide-react.mjs";
import { a as chapterPlain, i as bookTitle, n as Route, o as chapters, r as bookSubtitle, s as readingMinutes } from "./router-BRQMax4t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-fP7-BgSI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "dadgostari-reader-v1";
var SIZES = [
	"1.2rem",
	"1.35rem",
	"1.55rem"
];
function loadPrefs() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {
			theme: "day",
			size: 1,
			last: "cover"
		};
		const parsed = JSON.parse(raw);
		return {
			theme: parsed.theme === "night" ? "night" : "day",
			size: parsed.size === 0 || parsed.size === 2 ? parsed.size : 1,
			last: typeof parsed.last === "string" ? parsed.last : "cover"
		};
	} catch {
		return {
			theme: "day",
			size: 1,
			last: "cover"
		};
	}
}
function Blocks({ blocks }) {
	let prev = null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "reading book-body text-ink",
		children: blocks.map((block, i) => {
			if (block.k === "h") {
				prev = null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: block.t }, i);
			}
			if (block.k === "q") {
				prev = null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					className: "law-quote",
					children: block.t
				}, i);
			}
			if (block.k === "d") {
				const show = prev !== block.who;
				prev = block.who;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "dlg-label",
					children: block.who === "doctor" ? "دکتر خوشنویس" : "سرباز محمود"
				}) : null, block.t] }, i);
			}
			if (block.k === "box") {
				prev = null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "endnote",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: block.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: block.items.map((item, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, n)) })]
				}, i);
			}
			prev = null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: block.t }, i);
		})
	});
}
function BookReader({ chapterId, onChapter }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [prefs, setPrefs] = (0, import_react.useState)({
		theme: "day",
		size: 1,
		last: "cover"
	});
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const next = loadPrefs();
		setPrefs(next);
		document.documentElement.dataset.theme = next.theme;
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		document.documentElement.dataset.theme = prefs.theme;
		if (chapterId !== "cover" && prefs.last !== chapterId) {
			const next = {
				...prefs,
				last: chapterId
			};
			setPrefs(next);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		}
		window.scrollTo(0, 0);
		setOpen(false);
	}, [chapterId, ready]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
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
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim();
		if (!q) return chapters;
		return chapters.filter((ch) => `${ch.part} ${ch.title} ${chapterPlain(ch)}`.includes(q));
	}, [query]);
	function update(partial) {
		const next = {
			...prefs,
			...partial,
			last: chapterId
		};
		setPrefs(next);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		if (partial.theme) document.documentElement.dataset.theme = partial.theme;
	}
	const progress = chapterId === "cover" || index < 0 ? 0 : Math.round((index + 1) / chapters.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center gap-3 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden",
							onClick: () => setOpen(true),
							"aria-label": "فهرست",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-w-0 flex-1 text-start",
							onClick: () => onChapter("cover"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: bookTitle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted",
								children: chapter ? chapter.part : "کتاب گفت‌وگو"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-full border border-line",
							onClick: () => update({ size: (prefs.size + 1) % 3 }),
							"aria-label": "اندازه متن",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-full border border-line",
							onClick: () => update({ theme: prefs.theme === "night" ? "day" : "night" }),
							"aria-label": "حالت شب",
							children: prefs.theme === "night" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-0.5 bg-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-oxblood",
						style: { width: `${progress}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl lg:grid-cols-[18rem_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto border-e border-line px-4 py-6 lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toc, {
						query,
						setQuery,
						chapterId,
						onChapter,
						items: filtered
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 px-5 py-8 sm:px-8 lg:px-12",
					children: chapterId === "cover" || !chapter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
						resume: ready && prefs.last !== "cover" && prefs.last !== chapterId ? prefs.last : null,
						onChapter
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						style: { ["--read-size"]: SIZES[prefs.size] },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-sm text-brass",
								children: chapter.part
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-serif text-4xl leading-tight font-semibold text-ink sm:text-5xl",
								children: chapter.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-sans text-sm text-muted",
								children: [
									"حدود ",
									readingMinutes(chapter),
									" دقیقه مطالعه"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-px w-16 bg-oxblood" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocks, { blocks: chapter.blocks })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "mt-12 flex items-stretch gap-3 border-t border-line pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "min-h-11 flex-1 rounded-md border border-line px-3 py-3 text-start text-sm",
									onClick: () => onChapter(index <= 0 ? "cover" : chapters[index - 1].id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted",
										children: "قبلی"
									}), index <= 0 ? "جلد کتاب" : chapters[index - 1].title]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "min-h-11 flex-1 rounded-md border border-line px-3 py-3 text-end text-sm disabled:opacity-40",
									disabled: index === chapters.length - 1,
									onClick: () => index < chapters.length - 1 && onChapter(chapters[index + 1].id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted",
										children: "بعدی"
									}), index === chapters.length - 1 ? "پایان" : chapters[index + 1].title]
								})]
							})
						]
					})
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-night/50",
					"aria-label": "بستن",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-y-0 start-0 flex w-[min(100%,22rem)] flex-col bg-paper p-4 shadow-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "فهرست"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center",
							onClick: () => setOpen(false),
							"aria-label": "بستن فهرست",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toc, {
							query,
							setQuery,
							chapterId,
							onChapter,
							items: filtered
						})
					})]
				})]
			}) : null
		]
	});
}
function Cover({ resume, onChapter }) {
	const resumeChapter = chapters.find((c) => c.id === resume);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl py-6 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-sans text-sm text-brass",
				children: "گفت‌وگویی برای قضاوت در عصر کد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-5xl leading-tight font-semibold sm:text-6xl",
				children: bookTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "book-body mt-6 text-2xl leading-relaxed text-ink",
				children: bookSubtitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-px w-20 bg-oxblood" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 space-y-3 font-sans text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted",
					children: "دکتر خوشنویس"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "رئیس دادگستری؛ تجربه حکم، مسئولیت و حد قانون" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted",
					children: "سرباز محمود"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "سرباز دفتر؛ مشاهده مردم، و زبان ابزارهای نو" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-md bg-oxblood px-5 py-3 text-sm font-medium text-soft",
					onClick: () => onChapter("note"),
					children: "شروع از یادداشت نویسندگان"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-md border border-line px-5 py-3 text-sm",
					onClick: () => onChapter("c1"),
					children: "رفتن به فصل اول"
				})]
			}),
			resumeChapter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mt-4 text-sm text-brass underline-offset-4 hover:underline",
				onClick: () => onChapter(resumeChapter.id),
				children: [
					"ادامه از ",
					resumeChapter.part,
					": ",
					resumeChapter.title
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm leading-7 text-muted",
				children: "چهارده فصل، از برخورد عدالت با الگوریتم تا نقشه راه قانون‌گذاری. گفت‌وگوها بازآفرینی شده‌اند و هر جا نص قانون ساکت است، متن میان قانون، سند سیاستی و پیشنهاد نویسندگان فاصله گذاشته است."
			})
		]
	});
}
function Toc({ query, setQuery, chapterId, onChapter, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "relative block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "جست‌وجو در کتاب",
				className: "h-11 w-full rounded-md border border-line bg-soft ps-10 pe-3 text-sm outline-none"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChapter("cover"),
			className: `mt-4 block w-full rounded-md px-2 py-2 text-start text-sm ${chapterId === "cover" ? "bg-soft text-oxblood" : ""}`,
			children: "جلد کتاب"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-2 space-y-1",
			children: items.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChapter(ch.id),
				className: `w-full rounded-md px-2 py-2 text-start ${chapterId === ch.id ? "bg-soft" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-brass",
					children: ch.part
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-sm leading-6",
					children: ch.title
				})]
			}) }, ch.id))
		}),
		items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "چیزی با این عبارت پیدا نشد."
		}) : null
	] });
}
function Home() {
	const { c } = Route.useSearch();
	const navigate = useNavigate({ from: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookReader, {
		chapterId: c,
		onChapter: (id) => navigate({ search: { c: id } })
	});
}
//#endregion
export { Home as component };
