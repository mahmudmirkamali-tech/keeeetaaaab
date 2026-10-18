import { i as __toESM } from "../_runtime.mjs";
import { _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, q as require_react, v as createRootRoute, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BRQMax4t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-BgiAZ0aS.css";
var APP_NAME = "از دادگستری تا دنیای دیجیتال";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "گفت‌وگوی دکتر خوشنویس و سرباز محمود درباره حقوق، هوش مصنوعی، بلاک‌چین و آینده عدالت در ایران"
			},
			{
				name: "theme-color",
				content: "#7A2E2A"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fa",
		dir: "rtl",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var front = [
	{
		id: "note",
		part: "یادداشت",
		title: "درباره شیوه نگارش",
		blocks: [
			{
				k: "p",
				t: "گفت‌وگوهای این کتاب بر پایه هم‌اندیشی و تجربه محیط دادگستری، با ویرایش روایی بازآفرینی شده‌اند. صحنه آغازین هر فصل واقع‌نماست، نه گزارش یک پرونده معین. نام مراجعه‌کنندگان نیامده است و هیچ اطلاعات پرونده‌ای، امنیتی یا هویتی در متن نیست."
			},
			{
				k: "p",
				t: "دکتر خوشنویس در این صفحات رئیس دادگستری است: حقوقدان، مدیر، و کسی که مواد قانون را به زبان خودش می‌خواند. سرباز محمود کارمند دفتر اوست؛ جوانی کنجکاو که با هوش مصنوعی و بلاک‌چین از راه مشاهده و مطالعه آشنا شده، نه از راه پروانه کارشناسی. او حق را تفسیر نمی‌کند. هر جا سخن از حکم قانونی است، گوینده دکتر است."
			},
			{
				k: "p",
				t: "میان سه چیز در سراسر کتاب فاصله گذاشته شده است. اول، قانون لازم‌الاجرا. دوم، سند سیاستی، بخشنامه یا مصوبه اجرایی. سوم، پیشنهاد نویسندگان این گفت‌وگو. اگر متن می‌گوید «قانون ساکت است»، یعنی نویسندگان نص صریحی نیافته‌اند و تحلیل را بر قواعد عمومی نهاده‌اند، نه آنکه خلأ را با ماده ساخته‌شده پر کنند."
			},
			{
				k: "p",
				t: "مواد قانونی پیش از درج با متن مصوب تطبیق شده است. در موضوعاتی که میان حقوقدانان اختلاف است، کتاب رأی قطعی صادر نمی‌کند."
			}
		]
	},
	{
		id: "preface",
		part: "پیشگفتار",
		title: "به قلم دکتر خوشنویس",
		blocks: [
			{
				k: "p",
				t: "سال‌ها پشت این میز نشسته‌ام. پرونده آمده و رفته است. آدم‌ها آمده‌اند با چشم نگران و کاغذی که گاهی همه دارایی‌شان بوده. قانون را خوانده‌ام، تفسیر کرده‌ام، اجرا کرده‌ام. گمان می‌کردم چیز چندانی نمانده که در راهروی دادگستری غافلگیرم کند."
			},
			{
				k: "p",
				t: "بعد یک سرباز جوان روی صندلی روبه‌رو نشست و از چیزی حرف زد که نه در دوره‌های آموزشی ما بود و نه در حاشیه‌نویسی قانون. از الگوریتمی که احتمال می‌دهد. از قراردادی که خودش اجرا می‌شود. از مالی که نه در بانک است، نه در دفتر املاک، نه در هیچ جا که نص ما اسمش را برده باشد."
			},
			{
				k: "p",
				t: "اول فکر کردم اغراق می‌کند. بعد فکر کردم این‌ها دردِ آینده است و آینده هنوز به راهرو نرسیده. همان هفته پرونده‌ای آمد که یک طرف می‌گفت نرم‌افزار پولش را برده. فهمیدم آینده خیلی وقت است رسیده؛ فقط ما در اتاق را بسته بودیم."
			},
			{
				k: "p",
				t: "باید چیزی را روشن بگویم که در عرف اداری همیشه گفته نمی‌شود. بسیاری از ما عادت کرده‌ایم دانش را فقط در رتبه و مدرک جست‌وجو کنیم و به کسی که پایین‌تر نشسته است گوش ندهیم. این عادت را من نپذیرفتم. محمود سرباز دفتر بود، نه مشاور منصوب. اما در همان حوزه که من بیگانه بودم، زبانی داشت که دستگاه عدالت به آن محتاج است. استفاده از این ظرفیت، لطف نبود؛ وظیفه بود. مدیری که در نادانیِ خودش سکوت کند، مسئولیت را دور زده است."
			},
			{
				k: "p",
				t: "این کتاب حاصل همان گفت‌وگوهاست. گاهی در دفتر، گاهی در راهرو، گاهی وقتی چای سرد می‌شد و سؤال هنوز گرم بود. من تجربه قضاوت را آوردم. او سعی کرد ماشین را طوری توضیح دهد که قاضی بفهمد، بی‌آنکه دقت را قربانی سادگی کند. هیچ‌کدام به تنهایی نویسنده این مسیر نیستیم."
			},
			{
				k: "p",
				t: "شرط استفاده از فناوری، در نگاه من، یک جمله است: سامانه می‌تواند پیشنهاد دهد، دسته کند، هشدار بدهد. هر جا تصمیم بر حق بنیادین اثر می‌گذارد، باید انسانِ مسئول، دلیلِ قابل اعتراض، و نامی که بشود از او پرسید «چرا» در کار باشد. عدالت محاسبه نیست. محاسبه می‌تواند در خدمت عدالت باشد، به شرط آنکه جای انصاف، حق دفاع و مسئولیت اخلاقی را نگیرد."
			},
			{
				k: "p",
				t: "قانون خوب درباره فناوری، قانونی نیست که برای هر چیز تازه فوراً ممنوعیت بتراشد. قانون خوب مفهوم را تعریف می‌کند، حق شخص را به رسمیت می‌شناسد، حدود نهاد را روشن می‌کند، مسئولیت را قابل تشخیص می‌کند، و جا برای اصلاح بعدی می‌گذارد. چنین متنی در اتاق بسته و با یک رشته نوشته نمی‌شود."
			},
			{
				k: "p",
				t: "اگر قاضی هستید، وکیل هستید، قانون‌گذار هستید، برنامه می‌نویسید، یا فقط شهروندی هستید که با تلفن و بانک و سکوهای اینترنتی زندگی می‌کند، این گفت‌وگو به شما مربوط است. تصمیم امروز درباره داده و الگوریتم و دارایی دیجیتال، فردا بر آزادی و مالکیت و فرصت زندگی اثر می‌گذارد."
			},
			{
				k: "p",
				t: "و شاید شخصی‌ترین حاصل این تجربه برای من این باشد: عدالت همیشه از جایگاه بلند نمی‌آید. گاهی از گفت‌وگو با کسی می‌آید که گمان می‌کردیم حرفی برای گفتن ندارد."
			}
		]
	},
	{
		id: "intro",
		part: "مقدمه",
		title: "چطور این کتاب شکل گرفت",
		blocks: [
			{
				k: "h",
				t: "دکتر خوشنویس روایت می‌کند"
			},
			{
				k: "p",
				t: "محمود اول اردیبهشت آمد. مثل سربازهای تازه‌وارد: کمی محتاط، پوشه‌ای زیر بغل که معلوم بود تازه خریده شده. کارش روشن بود. پرونده را مرتب کند، نامه را برساند، چای بیاورد. چند هفته نگذشته بود که فهمیدم این یکی فقط منتظر دستور نمی‌ماند؛ نگاه می‌کند."
			},
			{
				k: "p",
				t: "آن روز زنی مسن آمده بود. می‌گفت پسرش مبلغی را از راه یک برنامه روی گوشی برای کسی فرستاده و آن کس منکر است. رسید کاغذی نبود. امضا نبود. شاهد نبود. فقط تاریخچه‌ای روی صفحه. من داشتم می‌گفتم اثبات این موضوع در چارچوب ادله آشنا دشوار است که محمود، آهسته و با اجازه، گفت اگر انتقال از مسیر یک شبکه ثبت توزیع‌شده گذشته باشد، رد تراکنش ممکن است باقی مانده باشد."
			},
			{
				k: "p",
				t: "زن نگاهش کرد. من هم. هیچ‌کدام همان لحظه نفهمیدیم دقیق چه گفت. بعد از رفتن مراجع، گفتم بنشین. این چیزی که گفتی چیست؟ آن روز، روز اول بود. نه روزی که جواب را پیدا کردیم؛ روزی که قبول کردیم سؤال را جدی بگیریم."
			},
			{
				k: "h",
				t: "سرباز محمود روایت می‌کند"
			},
			{
				k: "p",
				t: "انتظار نداشتم دکتر بپرسد. فکر می‌کردم مثل خیلی از بزرگ‌ترها بگوید «بعداً» و موضوع را عوض کند. دکتر خوشنویس نشست. جایی که نمی‌فهمید، تعارف نکرد. گفت دوباره بگو، ساده‌تر. این را از او یاد گرفتم که دقت، با اعتراف به ندانستن شروع می‌شود نه با پنهان کردنش."
			},
			{
				k: "p",
				t: "من متخصص رسمی هیچ دستگاهی نیستم. سرباز دفترم. اما از وقتی پدرم را به خاطر قراردادی که زبانش را کسی برایش ترجمه نکرد از دست دادیم، نسبت به کلمه‌های نفهمیده حساس شده‌ام. داستان پدر را در فصل دوم می‌گویم. اینجا فقط همین قدر: اگر کسی زبان کاغذ یا زبان کد را برای آدم معمولی ترجمه نکند، تصمیم را دیگران برای او می‌گیرند."
			},
			{
				k: "p",
				t: "دکتر از من قانون نخواست. از من خواست ابزار را طوری شرح دهم که بشود درباره‌اش حکم فکری داد. من هم هر جا وسوسه شدم ماده بخوانم، یادم ماند که ماده مالِ اوست. سهم من این بود که جعبه را باز کنم، نه اینکه به جای قاضی بنشینم."
			},
			{
				k: "h",
				t: "قراری که با خواننده داریم"
			},
			{
				k: "p",
				t: "کتاب از یک رابطه اداری آغاز می‌شود و عمد دارد به یک گفت‌وگوی ملی برسد: مشاهده، پرسش، اختلاف، فهم متقابل، و پیشنهاد. دکتر فقط سؤال نمی‌کند و محمود فقط جواب نمی‌دهد. تجربه قضاوت، پیشنهاد فنی را به چالش می‌کشد. شناخت فناوری، امکان تازه‌ای برای اجرای عدالت نشان می‌دهد. هیچ فصلی با یک شعار تمام نمی‌شود."
			}
		]
	}
];
var ch0104 = [
	{
		id: "c1",
		part: "فصل اول",
		title: "وقتی عدالت با الگوریتم روبه‌رو می‌شود",
		blocks: [
			{
				k: "h",
				t: "عددی روی میز"
			},
			{
				k: "p",
				t: "ساعت از هشت و نیم گذشته بود. محمود پرونده‌های روز را مرتب می‌کرد که صدای بحث از راهرو آمد. وکیلی جوان، لپ‌تاپ به دست، می‌خواست فوری به اتاق رئیس برود. موکلش متهم به کلاهبرداری بود و شرکتی خارجی گزارشی داده بود: با توجه به پرونده‌های مشابه، احتمال محکومیت ۸۷ درصد. قاضی پرونده نمی‌دانست این کاغذ را کجا بگذارد. محمود برگه را آورد بالا."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، این عدد از کجا آمده؟ یک ماشین گفته این آدم هشتادوهفت درصد مجرم است؟"
			},
			{
				k: "d",
				who: "soldier",
				t: "نه دقیقاً، دکتر. گفته در پرونده‌هایی که این ویژگی‌ها را داشته‌اند، در این حدود حکم محکومیت صادر شده. این پیش‌بینیِ صدور حکم است، نه اعلام مجرمیت."
			},
			{
				k: "d",
				who: "doctor",
				t: "فرق همین‌جاست که اگر گم شود، عدالت گم می‌شود. احتمالِ تکرار یک رویه، با اثبات جرم یکی نیست. بنشین و از اول بگو این ماشین چه می‌کند. قانونش با من."
			},
			{
				k: "h",
				t: "ماشین چه یاد می‌گیرد"
			},
			{
				k: "d",
				who: "soldier",
				t: "شما بعد از سال‌ها رسیدگی، ناخودآگاه الگو می‌بینید. اگر سابقه باشد، مبلغ بالا باشد، گواه قابل اعتماد باشد، احتمال محکومیت در ذهن‌تان بالا می‌رود. این تجربه است. الگوریتم یادگیری ماشین همین کار را با ریاضی می‌کند؛ اغلب روی داده‌ای بسیار بیشتر از حافظه یک قاضی. می‌گوید در این درصد از نمونه‌های گذشته، این خروجی ثبت شده. تجربه شما را می‌شود توضیح داد. بعضی مدل‌های پیچیده را نه. به آن‌ها می‌گویند جعبه سیاه: عدد می‌دهند، مسیر رسیدن به عدد را به زبانی که دادگاه بفهمد پس نمی‌دهند."
			},
			{
				k: "d",
				who: "doctor",
				t: "در تمام این سال‌ها از یک اصل کوتاه نیامدم. حکم باید مستدل باشد. متهم حق دارد بداند چرا. این حق دفاع است و کرامت است. اگر قاضی بگوید «چون الگوریتم ۸۷ گفته»، متهم به چه چیزی حمله کند؟ به کدام پرونده مشابه؟ به کدام داده؟ به کدام وزن؟"
			},
			{
				k: "d",
				who: "soldier",
				t: "به همین دلیل این کاغذ، اگر به کاری بیاید، از جنس اطلاعات است نه از جنس حکم. مثل نظر پزشکی که می‌گوید زخم با چه چیزی سازگارتر است. کمک می‌کند. جانشین وجدان دادرس نمی‌شود. و اگر کارشناس نتواند بگوید چرا، دیگر کارشناس نیست؛ فقط یک عدد است با لباس دقت."
			},
			{
				k: "h",
				t: "قانون چه جایی برای این کاغذ گذاشته است"
			},
			{
				k: "p",
				t: "دکتر خوشنویس قانون را باز کرد، نه برای اینکه بحث را تمام کند، برای اینکه مرز را نشان دهد."
			},
			{
				k: "q",
				t: "ماده ۱۹۴ قانون آیین دادرسی مدنی: دلیل عبارت از امری است که اصحاب دعوا برای اثبات یا دفاع از دعوا به آن استناد می‌نمایند."
			},
			{
				k: "d",
				who: "doctor",
				t: "این ماده فهرست ادله نیست. تعریف دلیل است. فهرست را قانون مدنی داده است. ماده ۱۲۵۸ دلایل اثبات دعوی را اقرار، اسناد کتبی، شهادت، امارات و قسم می‌شمارد. در آیین دادرسی مدنی، کارشناسی و معاینه و تحقیق محلی هم راه تحصیل اماره و ارزیابی دلیل‌اند. خروجی خام یک مدل، در هیچ‌کدام از این عنوان‌ها به صراحت ننشسته است."
			},
			{
				k: "d",
				who: "doctor",
				t: "نزدیک‌ترین مسیر، کارشناسی است. ماده ۲۵۷ همان قانون به دادگاه اجازه می‌دهد رأساً یا به درخواست طرفین قرار کارشناسی صادر کند. اما کارشناس انسان است؛ منصوب است، مسئول است، و اگر نظرش با اوضاع معلوم نخواند دادگاه به آن ترتیب اثر نمی‌دهد. این را ماده ۲۶۵ گفته است. ماشینی که نمی‌شود از او پرسید، کارشناس نیست. می‌تواند موضوعِ کارشناسی باشد: یک انسان متخصص بگوید این مدل چه دیده، داده آموزشش از کجا بوده، و عددش به درد این پرونده می‌خورد یا نه."
			},
			{
				k: "d",
				who: "soldier",
				t: "دکتر، یک مشکل فنی هم هست که حقوقی می‌شود. اگر مدل با پرونده‌های کشور دیگری آموزش دیده باشد، الگوی او الگوی دادگاه ما نیست. جمعیت، رویه، حتی تعریف جرم فرق دارد. عددِ دقیق روی داده بیگانه، دقت نیست؛ انتقالِ بی‌اجازه یک تجربه دیگر است."
			},
			{
				k: "d",
				who: "doctor",
				t: "همین را می‌خواستم بشنوم. و قانون تجارت الکترونیکی هم این جای خالی را پر نمی‌کند. آن قانون دادهپیام و سند الکترونیکی را، با شرایط، قابل استناد می‌داند. پیش‌بینی آماری، دادهپیامِ یک واقعه نیست. گزارش یک احتمال است. ایران، تا جایی که من در نص دیده‌ام، قانون خاصی برای «ادله الگوریتمی» ندارد. این را به‌عنوان خلأ می‌گویم، نه به‌عنوان ممنوعیت پنهان."
			},
			{
				k: "h",
				t: "دو گزارش، یک قاضی"
			},
			{
				k: "p",
				t: "دکتر فرض را عوض کرد. وکیل مدافع گزارش می‌آورد که احتمال بی‌گناهی ۷۳ درصد است. دادستان گزارش دیگری می‌آورد که احتمال محکومیت ۶۸ درصد است. هر دو براق، هر دو عددی، هر دو بی‌توضیح."
			},
			{
				k: "d",
				who: "doctor",
				t: "نادیده گرفتن از سر ترس، محروم کردن دادگاه از ابزار است. پذیرفتن هر دو به‌عنوان دلیل مستقل، جمع اضداد است. راه میانه این است که هر دو، اگر اصلاً پذیرفته شوند، ماده خام کارشناسی باشند و انسان پاسخ‌گو نظر بدهد. چنین کارشناسی در تشکیلات ما هنوز رشته رسمی و فراگیر نیست. این را باید ساخت، نه اینکه تا آن روز عدد را به جای دلیل بنشانیم."
			},
			{
				k: "d",
				who: "soldier",
				t: "در آمریکا سامانه‌ای به نام کامپس برای پیش‌بینی تکرار جرم به کار رفت. گزارش پروپابلیکا در ۲۰۱۶ نشان داد این سامانه متهمان سیاه‌پوست را بسیار بیشتر «پرخطر» علامت می‌زده، حتی در مقایسه جرم‌های مشابه. شرکت سازنده معیار سنجش را نپذیرفت. مناقشه سر جایش ماند. اما رسوایی، سؤال را عمومی کرد: عددی که تاریخ تبعیض را بلعیده، تبعیض را با لحن علم پس می‌دهد."
			},
			{
				k: "d",
				who: "doctor",
				t: "و مقرره هوش مصنوعی اتحادیه اروپا در ۲۰۲۴ کاربرد قضایی را در طبقه پرخطر نشانده و تصمیم کاملاً خودکار درباره حق مردم را با قید نظارت انسانی و شفافیت محدود کرده است. من این مقرره را قانون ایران نمی‌دانم. درس منفی‌اش برای من کافی است: هیچ نظام معتبری الگوریتم را قاضی نکرده است. ابزار کمکی‌اند، آن هم با افسار."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، سه چیز امروز برایم قطعی شد و چهارمی را از تو شنیدم. الگوریتم ابزار است نه قاضی. ابزاری که توضیح ندارد در دادگاه جای دلیل را نمی‌گیرد. ما نه نص آماده داریم نه کارشناس رسمی این فن. و اگر خودمان قاعده ننویسیم، کاغذِ شرکت‌های دیگران قاعده را به میز ما تحمیل می‌کند."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"خروجی مدل، پیش‌بینی الگوی گذشته است نه حکم مجرمیت.",
					"جعبه سیاه یعنی ناتوانی در توضیح مسیر رسیدن به عدد.",
					"ماده ۱۹۴ آیین دادرسی مدنی دلیل را تعریف می‌کند؛ فهرست ادله در ماده ۱۲۵۸ قانون مدنی است.",
					"نزدیک‌ترین قالب، کارشناسی انسانیِ موضوعِ الگوریتم است نه خودِ الگوریتم.",
					"داده آموزشی غیربومی، دقت ظاهری را به دادگاه ایران منتقل نمی‌کند."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود تعریف قانونی برای استناد به تحلیل الگوریتمی به‌عنوان اماره یا نظر کارشناسی.",
					"نبود رشته فراگیر کارشناسی رسمی در ارزیابی سامانه هوشمند قضایی.",
					"نبود معیار قانونی برای قابلیت توضیح و تناسب داده آموزشی با نظام ایران."
				]
			},
			{
				k: "box",
				kind: "risk",
				title: "مخاطرات فنی",
				items: [
					"سوگیری داده و بازتولید تبعیض تاریخی.",
					"اتکای قاضی به عدد به‌جای ارزیابی مستقل دلیل.",
					"تعارض دو مدل با دو عدد، بی‌روش حل تعارض."
				]
			},
			{
				k: "box",
				kind: "exec",
				title: "پیشنهاد اجرایی",
				items: [
					"دستورالعمل موقت: خروجی مدل در دادرسی فقط به‌عنوان ماده کارشناسی و با افشای روش و محدوده داده قابل طرح باشد.",
					"آموزش کوتاه قضات برای خواندن نقادانه گزارش الگوریتمی، نه آموزش برنامه‌نویسی.",
					"آزمایش هر ابزار، پیش از استفاده داخل قوه، در محیطی که رأی واقعی صادر نمی‌شود."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"الحاق قاعده‌ای که تحلیل الگوریتمی را، به‌خودی‌خود، دلیل مستقل نداند و تنها در چارچوب کارشناسی قابل ارزیابی بشناسد.",
					"الزام به قابلیت توضیح متناسب با اهمیت حقِ در معرض خطر.",
					"تأسیس صلاحیت کارشناسی رسمی «ارزیابی سامانه الگوریتمی» با شرط دانش حقوق و فن، هر دو."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اساسی، اصول ۳۲، ۳۴ و ۱۶۶.",
					"قانون مدنی، ماده ۱۲۵۸.",
					"قانون آیین دادرسی مدنی، مواد ۱۹۴، ۲۵۷ و ۲۶۵.",
					"قانون تجارت الکترونیکی، مصوب ۱۳۸۲، به‌ویژه قواعد دادهپیام.",
					"مقرره هوش مصنوعی اتحادیه اروپا، ۲۰۲۴/۱۶۸۹.",
					"Julia Angwin et al., Machine Bias, ProPublica, 2016."
				]
			},
			{
				k: "box",
				kind: "ask",
				title: "نیازمند تأیید دکتر خوشنویس و محمود",
				items: ["آیا تاکنون گزارش احتمال‌محور از این جنس واقعاً به دفتر رسیده است؟", "نمونه بومی از ابزار امتیازدهی قضایی در ایران، اگر وجود دارد، باید با اجازه و بدون افشای پرونده اضافه شود."]
			}
		]
	},
	{
		id: "c2",
		part: "فصل دوم",
		title: "دو زبان که یک کلمه را دو جور می‌فهمند",
		blocks: [
			{
				k: "h",
				t: "نامه زیر باران"
			},
			{
				k: "p",
				t: "چهارشنبه باران می‌آمد. روی میز دکتر نامه‌ای بود با سربرگ یک شرکت فناوری. فارسی بود و در عین حال انگار از زبان دیگری آمده بود: توکن، کیف‌پول، قرارداد هوشمند، لایه دوم. دکتر سه بار خوانده بود و هنوز نمی‌دانست واقعه چیست."
			},
			{
				k: "d",
				who: "soldier",
				t: "دکتر، تا جایی که از متن برمی‌آید می‌گویند طرف مقابل یک قرارداد هوشمند را دستکاری کرده یا از حفره‌اش استفاده کرده."
			},
			{
				k: "d",
				who: "doctor",
				t: "قرارداد هوشمند نمی‌شود. قرارداد، به ماده ۱۸۳ قانون مدنی، تعهد یک یا چند نفر در برابر یک یا چند نفر دیگر است که مورد قبول قرار گیرد. سند اراده است، نه برنامه."
			},
			{
				k: "d",
				who: "soldier",
				t: "در زبان برنامه‌نویس، «قرارداد» اغلب یعنی کدی روی بلاک‌چین که اگر شرط داخلش برقرار شود، عمل را خودش انجام می‌دهد. بدون بانک، بدون دستور تازه، بدون اینکه کسی دکمه اجرا را بزند. مثل دستگاه فروش خودکار: سکه می‌افتد، کالا می‌آید. اگر کد غلط باشد، غلط هم اجرا می‌شود و متوقف کردنش ساده نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس ما یک لفظ داریم و دو مصداق. تا این دو مصداق از هم جدا نشوند، هر رأیی که بنویسم یا لغو است یا خطرناک. سرباز، بلاک‌چین را هم از صفر بگو. فرض کن برای کسی می‌گویی که جز دفتر دادگاه، دفتری ندیده."
			},
			{
				k: "h",
				t: "دفتری که یک نسخه ندارد"
			},
			{
				k: "d",
				who: "soldier",
				t: "دفتر ثبت را تصور کنید که به‌جای یک جلد در بایگانی، نسخه‌های هم‌خوان نزد شمار زیادی از رایانه‌هاست. هر ثبت تازه باید با قاعده شبکه سازگار باشد تا در نسخه‌ها بنشیند. دست بردن در یک نسخه کافی نیست؛ باید تاریخ زنجیره را چنان عوض کرد که بقیه شبکه‌ آن را نپذیرند. این کار در شبکه‌های بزرگ عملاً بسیار دشوار است. به همین دلیل می‌گویند ثبت، پس از تثبیت، جعل‌کردنش آسان نیست. این قدرتِ تمامیت است. معنای عدالت نیست و معنای هویت طرفین هم نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "جمله آخرت را قانون باید قاب بگیرد. تمامیتِ ثبت با انتساب به یک انسان یکی نیست. اگر فقط یک نشانی کیف‌پول داشته باشیم، دفتر ممکن است بگوید این نشانی منتقل کرده است. نمی‌گوید این نشانی مالِ کیست."
			},
			{
				k: "h",
				t: "پدر محمود"
			},
			{
				k: "p",
				t: "دکتر پرسید آن قراردادی که یک بار گفتی پدرت درست نخواند چه بود. محمود کمی سکوت کرد. این بخش را خودش اجازه داده بود در کتاب بیاید، بی‌نام طرفِ دیگر."
			},
			{
				k: "d",
				who: "soldier",
				t: "مغازه‌ای داشت. شریکی پیشنهاد شد با قراردادی بلند و ریز. پدر سواد داشت، اما سواد آن کاغذ را نه. بندی بود که شریک می‌توانست سهم او را به قیمت روز اول بخرد، نه قیمت روز فروش. چند سال بعد مغازه چند برابر شده بود و همان بند اجرا شد. کسی متن را برایش ترجمه نکرده بود. بعد از آن، دیگر آن پدر قبلی نبود."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، این داستان برای گریاندن کتاب نیست. برای این است که یادمان بماند زبانِ نفهمیده، ابزار سلب حق است. کد هم اگر ترجمه نشود همان کاغذ ریز است؛ فقط سریع‌تر اجرا می‌شود و دیرتر پشیمان."
			},
			{
				k: "h",
				t: "اصطکاک با قانون مدنی"
			},
			{
				k: "d",
				who: "doctor",
				t: "ماده ۱۹۰ شرایط اساسی صحت معامله را قصد و رضا، اهلیت، موضوع معین و مشروعیت جهت می‌داند. ماده ۱۹۱ می‌گوید عقد با قصد انشا واقع می‌شود، به شرط آنکه چیزی بر آن دلالت کند. در قرارداد هوشمند، قصد ممکن است در لحظه استقرار کد موجود باشد. بعد از آن، کد منتظر قصد تازه نمی‌ماند. آیا اجرای بعدی هنوز «انشا» است یا فقط جبر یک برنامه؟ این سؤال را قانون ما صریح جواب نداده. تحلیل ما این است که اراده باید در لحظه تعهد احراز شود و کد، اگر ابزار بیان آن اراده باشد، تابع اراده می‌ماند نه جانشین آن."
			},
			{
				k: "d",
				who: "doctor",
				t: "ماده ۱۹۹ رضای حاصل از اشتباه یا اکراه را موجب نفوذ معامله نمی‌داند. ماده ۲۲۷ متعهد را، اگر ثابت کند عدم انجام از علت خارجی غیرقابل انتساب بوده، از خسارت تخلف معاف می‌کند. ماده ۲۲۹ حادثه‌ای را که دفعش بیرون از اقتدار متعهد است موجب محکومیت به خسارت نمی‌داند. کد هیچ‌کدام از این معاذیر را نمی‌فهمد. سیل برای کد فقط یک تاریخِ گذشته است."
			},
			{
				k: "d",
				who: "soldier",
				t: "از نظر فنی هم پس از ثبت، «فسخ» به معنایی که شما می‌گویید دکمه آماده‌ای نیست. می‌شود از اول در کد راه توقف یا داوری گذاشت. اگر نگذارند، برگرداندن مالِ منتقل‌شده گاهی ناممکن است، حتی اگر دادگاه حق را به زیان‌دیده بدهد."
			},
			{
				k: "d",
				who: "doctor",
				t: "قانون تجارت الکترونیکی اسناد و قرارداد الکترونیکی را، با قیود خودش، معتبر می‌شناسد. آن قانون برای دادهپیام و امضا نوشته شده، نه برای برنامه‌ای که روی شبکه بی‌مرکز جهانی خودش را اجرا می‌کند. استفاده از روح آن قانون ممکن است. ادعا اینکه «قرارداد هوشمند عیناً در آن تعریف شده» درست نیست. این فرق را نگه دارید."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس اگر امروز کسی از این مسیر ضرر ببیند به همین دادگستری می‌آید، و ما ابزار مفهومی کم داریم: تعریف نداریم، دادگاه صالح را برای شبکه بی‌مرکز روشن نکرده‌ایم، کارشناس رسمی این کد فراگیر نیست. مردم در این فاصله بی‌دفاع می‌مانند. مثل پدر تو. مثل هر کسی که کاغذ را امضا می‌کند چون ترجمه ندارد."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"«قرارداد» در حقوق تعهد ناشی از اراده است و در نرم‌افزار اغلب کد خوداجرا.",
					"بلاک‌چین تمامیت ثبت را سخت می‌کند؛ هویت انسان و عدالت ماهوی را تضمین نمی‌کند.",
					"قوه قاهره و اشتباه در قانون مدنی هست و در کد، مگر از قبل نوشته شود، نیست.",
					"قانون تجارت الکترونیکی را نباید بیش از نصش به قرارداد هوشمند تعمیم داد."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود تعریف قانونی قرارداد هوشمند و حدود اعتبار آن.",
					"ابهام صلاحیت وقتی شبکه در یک سرزمین معین «واقع» نشده است.",
					"نبود قاعده صریح برای اعمال معاذیر قانونی پس از اجرای خودکار."
				]
			},
			{
				k: "box",
				kind: "risk",
				title: "مخاطرات فنی",
				items: [
					"خطای کد، پس از استقرار، با همان قطعیتِ کد درست اجرا می‌شود.",
					"نشانی کیف‌پول با هویت قابل احضار یکی نیست.",
					"نبود راه توقف، اجرای ناعادلانه را عملی می‌کند حتی اگر بعداً باطل اعلام شود."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"تعریف قرارداد خودکار دیجیتال به‌عنوان ابزار بیان اراده، نه منبع مستقل تعهد خارج از قانون مدنی.",
					"تصریح به اینکه مواد مربوط به اشتباه، اکراه و قوه قاهره پس از اجرا هم قابل استنادند و دادگاه می‌تواند حکم به اعاده دهد، هرچند کد اعاده را نشناسد.",
					"الزام سکوهایی که با عموم قرارداد خودکار می‌بندند به وجود راه حل اختلاف انسانی."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون مدنی، مواد ۱۸۳، ۱۹۰، ۱۹۱، ۱۹۹، ۲۲۴، ۲۲۷ و ۲۲۹.",
					"قانون تجارت الکترونیکی، مصوب ۱۳۸۲.",
					"UK Law Commission, Smart Legal Contracts, 2021؛ فقط به‌عنوان مطالعه تطبیقی."
				]
			}
		]
	},
	{
		id: "c3",
		part: "فصل سوم",
		title: "ماشینی که یاد می‌گیرد",
		blocks: [
			{
				k: "p",
				t: "دکتر خوشنویس پیش از بقیه می‌آمد. آن صبح مقاله‌ای روی میز بود درباره پیش‌بینی رأی دادگاه اروپایی حقوق بشر با دقتی نزدیک به هشتاد درصد. عینک را برداشت و مقاله را به سمت محمود هل داد."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، اگر این عدد راست باشد، من این‌جا چه کاره‌ام؟ اول کارِ ماشین را بگو. بعد با هم ببینیم چرا حتی عدد درست هم جای قاضی را نمی‌گیرد."
			},
			{
				k: "d",
				who: "soldier",
				t: "سه دوره را قاطی نکنیم. دوره اول، قواعد را انسان می‌نوشت: اگر سابقه باشد، خطر را بالا فرض کن. دنیا از آن قاعده‌ها بزرگ‌تر بود و آن نسل شکست خورد. دوره دوم، به‌جای نوشتن قاعده، نمونه می‌دهند و مدل خودش الگو استخراج می‌کند. دوره سوم، شبکه‌های چندلایه است که زبان و تصویر را هم می‌فهمد؛ همان نسلی که گفت‌وگوهای امروز با مدل‌های مولد از آن آمده. مقاله روی میز شما از جنس پیدا کردن الگو در متن رأی‌های گذشته است."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس ماشین از رأیِ ما یاد می‌گیرد. اگر ما سال‌ها با تهی‌دست سخت‌تر برخورد کرده باشیم، ماشین همان سخت‌گیری را یاد می‌گیرد و بعد به آن نمودار می‌چسباند. ظلم، وقتی عدد شود، به‌نظر بعضی‌ها از ظلمِ بی‌عدد محترم‌تر است. این خطرناک‌تر از اشتباه آشکار است، چون اشتباه آشکار را می‌شود خجالت کشید."
			},
			{
				k: "d",
				who: "soldier",
				t: "کامپس دقیقاً همین بود. عدد می‌داد: خطر بالا یا پایین. قاضی مسیر را نمی‌دید. تحقیق ۲۰۱۶ نشان داد خطا به زیان سیاه‌پوستان اریب دارد. سازنده پذیرفت که بحث روش اندازه‌گیری باز است. برای من درس فنی‌اش این است که معیار «دقت» اگر فقط یک عدد باشد، می‌تواند بی‌عدالتی را قایم کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "اشتباه من را وکیل می‌تواند بزند زیر ذره‌بین. تجدیدنظر هست. اصل ۱۶۶ قانون اساسی می‌گوید احکام دادگاه‌ها باید مستدل و مستند به مواد قانون و اصولی باشد که بر اساس آن حکم صادر شده است. «مدل گفت» استناد به ماده نیست. ماده ۲۵۷ آیین دادرسی مدنی کارشناس را به دادگاه راه می‌دهد، اما کارشناس باید بتوان جواب داد. مدل نه سوگند می‌خورد نه مسئول است."
			},
			{
				k: "d",
				who: "doctor",
				t: "قانون ایران، در نصی که من می‌شناسم، هوش مصنوعی را تعریف نکرده است. نه در مدنی، نه در مجازات، نه در آیین دادرسی. در این سکوت دو کار بد ممکن است: یکی اینکه از ابزار مفید هیچ استفاده نشود، یکی اینکه بی‌قاعده استفاده شود. هر دو بد است. راه سوم نوشتن حدود است، نه بت ساختن از ماشین و نه ترس از اسمش."
			},
			{
				k: "d",
				who: "soldier",
				t: "اروپا در مقرره ۲۰۲۴ سامانه قضایی را پرخطر دانسته: شفافیت، نظارت انسان، و ممنوعیت سپردنِ تنها به ماشین در جاهایی که حق مردم جدی است. کانادا هم برای تصمیم خودکار دولتی توضیح، اعتراض و بازبینی انسانی خواسته. این‌ها قانون ما نیست. الگوی سؤال است."
			},
			{
				k: "p",
				t: "آخر وقت دکتر سؤالی پرسید که محمود آماده نبود."
			},
			{
				k: "d",
				who: "doctor",
				t: "اگر سامانه‌ای از من سریع‌تر و بی‌خسته‌تر الگو را ببیند، باید صندلی مرا بگیرد؟"
			},
			{
				k: "d",
				who: "soldier",
				t: "الگو را بهتر می‌بیند. آدم را نه. من در حد سواد خودم می‌گویم: ماشین وزن یک نگاه را ندارد. تشخیص اینکه قانون در این پرونده هست ولی انصاف جای دیگری است، کار مدل نیست. به درد این می‌خورد که شما کمتر در کاغذ گم شوید، نه اینکه به‌جای شما امضا کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "این فرق، فرق اصلی است. نه شیفتگی، نه وحشت. کار با چشم باز، و با قانون."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"یادگیری ماشین از گذشته الگو می‌سازد و گذشته را، با همه اریبش، امتداد می‌دهد.",
					"اصل ۱۶۶ استدلال و استناد می‌خواهد؛ ارجاع به خروجی مدل این استناد نیست.",
					"نبود تعریف قانونی هوش مصنوعی، مجوز استفاده بی‌قاعده نیست و بهانه تعطیلی ابزار هم نیست."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود چارچوب استفاده قاضی از ابزار تحلیلی.",
					"نبود الزام به توضیح‌پذیری متناسب.",
					"نبود مرجع ارزیابی پیش از ورود سامانه به کار قضایی."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"دسته‌بندی کاربردها بر اساس اثر بر حق مردم، با الهام از منطق خطر، نه رونویسی از اروپا.",
					"ممنوعیت تصمیم کاملاً خودکار در قضاوت ماهوی تا وقتی قانون صریحاً و محدود اجازه نداده باشد.",
					"گزارش اثر الگوریتمی پیش از استفاده آزمایشی در قوه قضاییه."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اساسی، اصل ۱۶۶.",
					"قانون آیین دادرسی مدنی، مواد ۱۹۴، ۲۵۷ و ۲۶۵.",
					"Regulation (EU) 2024/1689 (AI Act).",
					"Directive on Automated Decision-Making, Government of Canada, 2019.",
					"Aletras et al., Predicting judicial decisions of the European Court of Human Rights, 2016."
				]
			}
		]
	},
	{
		id: "c4",
		part: "فصل چهارم",
		title: "وقتی ماشین خطا می‌کند، چه کسی جواب می‌دهد؟",
		blocks: [
			{
				k: "p",
				t: "دکتر روزنامه را تا نکرده بود. بیمارستانی سامانه تشخیص تصویر را به کار گرفته بود. سامانه یک توده را کم‌خطر خوانده بود. بیمار ماه‌ها بعد از دست رفته بود. خانواده از بیمارستان، از پزشک و از شرکت سازنده شکایت کرده بودند. هر سه گفته بودند تقصیر آن یکی است."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، تو زنجیره را از حیث فن بشمار. من می‌گویم حقوق مسئولیت ما با این زنجیره چه می‌کند. تشخیص حقوقی مالِ تو نیست و من هم داخل شبکه عصبی را از حفظ نمی‌خوانم."
			},
			{
				k: "d",
				who: "soldier",
				t: "چهار حلقه معمولاً هست. کسی که مدل را می‌سازد. کسی که داده آموزش را می‌دهد. کسی که سامانه را می‌خرد و در کار روزانه می‌گذارد. کسی که خروجی را می‌بیند و تصمیم انسانی را امضا می‌کند. هیچ‌کدام به تنهایی بر همه حلقه‌ها دست ندارند. سازنده همیشه نمی‌داند داده بعدی چیست. پزشک غالباً فقط برچسب را می‌بیند: کم‌خطر یا پرخطر."
			},
			{
				k: "d",
				who: "doctor",
				t: "ماده یک قانون مسئولیت مدنی مصوب ۱۳۳۹، هر کس را که بی‌مجوز قانونی، عمداً یا از بی‌احتیاطی، به جان یا مال یا حیثیت دیگری لطمه بزند مسئول جبران می‌داند. به زبان دادگستری: تقصیر، ضرر، و رابطه سببیت. در این پرونده ضرر روشن است. تقصیر و سببیت میان چهار حلقه گم می‌شود. هر کس می‌تواند بگوید من نبودم، سامانه بود."
			},
			{
				k: "d",
				who: "doctor",
				t: "اتلاف در ماده ۳۲۸ قانون مدنی ضمان مباشرِ تلف است. تسبیب در ماده ۳۳۱ ضمان کسی است که سبب تلف را ایجاد کرده. ماده ۹۵۳ تقصیر را اعم از تعدی و تفریط می‌داند؛ این ماده خودش قاعده تسبیب نیست. پرونده الگوریتم معمولاً به تسبیب شبیه‌تر است تا به دستِ مستقیم. اما تسبیب هم سببیت می‌خواهد. اگر حتی سازنده نتواند بگوید کدام جزء مدل این خروجی را ساخته، زیان‌دیده چگونه سبب را ثابت کند؟ اینجا حقوق ما ابزار آشنا دارد و واقعیت فن آن ابزار را کند کرده است. این کندی را باید نوشت، نه انکار."
			},
			{
				k: "d",
				who: "soldier",
				t: "از حیث فن، گاهی آزمایش پیش از استفاده مهم‌تر از کالبدشکافی بعد از فاجعه است. دارو را پیش از بازار از مسیر مجوز می‌گذرانند. مدلِ پرخطر را هم می‌شود پیش از گذاشتن روی جان مردم آزمود. این پیشنهاد فنی است، دکتر. قالب حقوقی‌اش با شما."
			},
			{
				k: "d",
				who: "doctor",
				t: "قالبش دو بخش است و هر دو هنوز پیشنهاد ماست نه نص موجود. یکی، اماره سببیت در سامانه‌های پرخطر: اگر زیان‌دیده نشان دهد سامانه از نوع حساس بوده و رفتار متعارف نداشته، بار توضیح بر عهده کسی باشد که سامانه را ساخته یا به کار گرفته، نه بر عهده بیمار. دیگری، تصریح اینکه نرم‌افزار معیوب هم بتواند مشمول تکالیف عرضه‌کننده باشد. قانون حمایت از مصرف‌کننده تکالیفی دارد، اما تسری صریح و بی‌گفت‌وگوی آن به مدل تشخیص پزشکی را من از نص موجود درنمی‌آورم. باید قانون بگوید، نه قیاسِ شتاب‌زده."
			},
			{
				k: "p",
				t: "دکتر مثال تمپی را خودش آورد، کوتاه و بی‌افسانه. در ۲۰۱۸ خودروی آزمایشی خودران در آریزونا عابری را کشت. تعقیب کیفری به سمت انسانِ پشت فرمان رفت؛ کسی که باید مداخله می‌کرد. الگوریتم به بازپرسی احضار نشد. شرکت با خانواده مصالحه کرد. درس دکتر این نبود که همیشه راننده مقصر است. درس این بود که نظام‌ها هنوز بلد نیستند مسئولیت را در زنجیره تقسیم کنند، پس نزدیک‌ترین انسان را می‌گیرند. این عدالت نیست؛ این عادت است."
			},
			{
				k: "d",
				who: "doctor",
				t: "کمیسیون اروپا در ۲۰۲۲ پیشنهادی برای تطبیق مسئولیت مدنی با هوش مصنوعی داد، از جمله سبک‌کردن بار اثبات. این پیشنهاد را قانون ایران ندانید و حتی قانون قطعی اروپا ندانید تا وضعیت نهایی‌اش جداگانه گزارش شود. در عوض، دستور بازنگری‌شده مسئولیت کالای معیوب در اتحادیه، نرم‌افزار را به قلمرو محصول نزدیک کرده است. برای ما الگوست، متن لازم‌الاجرا نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "سؤال آخر امروز فنی نیست. اگر هیچ انسانی نتواند بگوید چرا سامانه این تصمیم را گرفت، حق داریم آن را بر جان و آزادی مردم مسلط کنیم؟ نظر من: پیشنهاد و هشدار آری، امضای نهایی نه. آخرین امضا باید مالِ کسی باشد که بشود از او پرسید چرا، و او بتواند به زبانی غیر از ابهام جواب دهد."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"چهار حلقه سازنده، داده، بهره‌بردار و کاربر نهایی معمولاً هم‌زمان در میان‌اند.",
					"مسئولیت مدنی ایران بر تقصیر و سببیت تکیه دارد و جعبه سیاه اثبات را دشوار می‌کند.",
					"ماده ۹۵۳ تعریف تقصیر است؛ اتلاف و تسبیب در مواد ۳۲۸ و ۳۳۱ است.",
					"مسئولیت محضِ نرم‌افزار در ایران هنوز نیازمند نص است، نه خلاقیت شعاری."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود قاعده تقسیم مسئولیت در زنجیره سامانه هوشمند.",
					"نبود اماره سببیت برای سامانه‌های پرخطر.",
					"نبود مجوز اجباری پیش از استفاده در پزشکی و قضا و اعتبار."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"تصریح بر مسئولیت نهایی انسانی در تصمیم مؤثر بر جان، آزادی و مال.",
					"اماره سببیت قابل رد، فقط برای سامانه‌های طبقه‌بندی‌شده پرخطر.",
					"نظام تأیید پیش از بهره‌برداری، جدا از مسئولیت پس از وقوع خسارت."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون مسئولیت مدنی، مصوب ۱۳۳۹، ماده ۱.",
					"قانون مدنی، مواد ۳۲۸، ۳۳۱ و ۹۵۳.",
					"قانون مجازات اسلامی، مواد ۱۴۳ تا ۱۴۵؛ برای مرز مسئولیت کیفری که در فصل بعد می‌آید.",
					"Proposal for an AI Liability Directive, European Commission, 2022.",
					"Directive (EU) 2024/2853 on liability for defective products.",
					"NTSB, collision of an automated driving system test vehicle, Tempe, 2018."
				]
			}
		]
	}
];
var ch0508 = [
	{
		id: "c5",
		part: "فصل پنجم",
		title: "وقتی کد جای قاضی می‌نشیند",
		blocks: [
			{
				k: "p",
				t: "پرونده‌ای که برای دکتر فرستاده بودند از جنس سیل بود، نه از جنس شعر فناوری. شرکت ساختمانی و پیمانکار شرط گذاشته بودند هر روز تأخیر، یک درصد از مبلغ به‌عنوان خسارت کسر شود. شرط را در قرارداد هوشمند گذاشته بودند. پیمانکار سه روز دیر کرد، چون سیل جاده را بسته بود. کد همان شب سه درصد را برداشت. دادگاهی در میان نبود."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، اعتراض را به که بنویسد؟ به کد؟ کد ابلاغ را نمی‌گیرد. تو بگو این برنامه دقیقاً چه صفتی دارد که جلویش را نمی‌شود گرفت."
			},
			{
				k: "d",
				who: "soldier",
				t: "به آن می‌گویند تغییرناپذیری پس از استقرار. وقتی کد روی شبکه تثبیت شد، سازنده هم دکمه پشیمانی ندارد، مگر آنکه از اول راه توقف، چندامضایی یا ارجاع به داور را در همان کد نوشته باشد. اگر حفره باشد، حفره هم با همان جدیت اجرا می‌شود."
			},
			{
				k: "d",
				who: "doctor",
				t: "قاضی می‌تواند بگوید اشتباه کردم. کد نمی‌تواند. و قانون ما برای همین لحظه نوشته شده است. ماده ۲۲۷ و ماده ۲۲۹ قانون مدنی قوه قاهره را می‌شناسند. سیل اگر دفعش بیرون از اقتدار متعهد باشد، خسارت تخلف را توجیه نمی‌کند. کدی که فقط تاریخ را می‌بیند، این اصل را دور می‌زند. دور زدن اصل، با گفتن اینکه «طرفین قبول کرده‌اند» تمام نمی‌شود. طرفین قبول کرده‌اند که شرط ضمن عقد باشد، نه اینکه حادثه خارجی را از عالم حذف کنند."
			},
			{
				k: "d",
				who: "doctor",
				t: "اعتماد در قرارداد فقط اعتماد به طرف مقابل نیست. اعتماد به این است که اگر واقع از متن فاصله گرفت، مرجعی حرف طرفین را بشنود. قرارداد هوشمند این اعتماد را از نهاد به کد منتقل می‌کند. کد قاعده ازپیش‌نوشته را اجرا می‌کند. انصاف، شنیدن عذر، و تفسیر عرفیِ ماده ۲۲۴ وقتی لفظ مبهم است، کار کد نیست. ماده ۲۲۴ می‌گوید الفاظ عقود بر معانی عرفی حمل می‌شود. کد ابهام عرفی ندارد؛ یا نوشته شده یا نشده. هر چه نوشته نشده، وجود ندارد. هیچ قراردادی همه آینده را پیش‌بینی نمی‌کند. پس قرارداد خوداجرا ذاتاً ناقص است، نه از بی‌دقتی نویسنده، از کوچکی زبان کد در برابر واقعیت."
			},
			{
				k: "d",
				who: "soldier",
				t: "سال ۲۰۱۶ در شبکه‌ای به نام اتریوم، صندوقی مردمی با کد اداره می‌شد. کسی از اشکال کد استفاده کرد و مبلغ هنگفتی را بیرون کشید. از نظر اجرای کد، برنامه اجازه داده بود. از نظر عرف، این برداشتن مال دیگران بود. دادگاهی که همه او را صالح بدانند در کار نبود. جامعه فنی با انشعاب شبکه، آن نقل‌وانتقال را در زنجیره جدید بی‌اثر کرد. یعنی وقتی کد از عدالت دور شد، انسان دخالت کرد؛ اما از درِ اجماع فنی، نه از درِ قانون."
			},
			{
				k: "d",
				who: "doctor",
				t: "این دخالت را من پیروزی حقوق نمی‌نامم. نشان می‌دهد قدرت نزد کسانی جمع می‌شود که پروتکل را در دست دارند. برای ایران سه لایه پیشنهاد می‌کنم و هر سه پیشنهاد نویسندگان است. لایه اول: در قراردادهای خوداجرای حوزه مالی و ساختمانی و درمانی، راه اضطراری الزامی باشد که با اعتراض، اجرا بایستد و به داور یا دادگاه برود. لایه دوم: نص بگوید معاذیر قانون مدنی حتی پس از کسر خودکار قابل استناد است و حکم به استرداد ممکن است، ولو کد استرداد را بلد نباشد. لایه سوم: پیش از استقرار عمومی، کدِ مؤثر بر حق مردم را متخصص مسئول ببیند. نه اینکه هر برنامه خانگی مجوز بگیرد؛ آن‌جا که با عموم طرف است."
			},
			{
				k: "d",
				who: "soldier",
				t: "از نظر فنی لایه اول شدنی است. بعضی سامانه‌ها همین حالا داوری را به اجرا گره می‌زنند. الزامش حقوقی است."
			},
			{
				k: "d",
				who: "doctor",
				t: "وایومینگ در آمریکا قرارداد هوشمند را در کنار حقوق تجاری‌اش به رسمیت شناخت، نه به‌جای آن. کمیسیون حقوقی انگلستان در ۲۰۲۱ گفت کد را باید بیان اراده تفسیر کرد و اگر با اراده واقعی بجنگد، اراده مقدم است. مشکل باقی‌مانده عملی است: پول که رفت، تقدم اراده را چگونه به مال برمی‌گردانید؟ پرونده پیمانکار ما دقیقاً همین‌جاست."
			},
			{
				k: "d",
				who: "doctor",
				t: "نگرانی عمیق‌تر من ضعف فنی نیست. این است که مردم کم‌کم به کد اعتماد کنند و به دادگاه نه. فناوری نهاد را عوض کرده، حذف نکرده. اگر قانون‌گذار چارچوب بسازد، کد ابزار می‌ماند. اگر نسازد، کد عادت می‌شود و عادت بعداً خودش را حق جا می‌زند."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"خوداجرایی بدون راه توقف، قوه قاهره را عملاً بی‌اثر می‌کند.",
					"کد بیان اراده است اگر قانون چنین بگوید؛ منبع مستقل عدالت نیست.",
					"تجربه دائو نشان داد دخالت انسانی ناگزیر است و بهتر است از مسیر حقوق باشد تا انشعاب فنی."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود الزام به سازوکار توقف و حل اختلاف در قرارداد خوداجرا.",
					"نبود قاعده صلاحیت برای شبکه فرامرزی.",
					"نبود نهاد ممیزی کد در قراردادهای همگانی."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"اصلاح یا الحاق به قانون تجارت الکترونیکی برای تعریف قرارداد خودکار و تابعیت آن از قواعد عمومی معاملات.",
					"تصریح قابلیت استناد قوه قاهره پس از اجرای کد.",
					"الزام راه حل اختلاف انسانی در حوزه‌های پرخطر."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون مدنی، مواد ۱۹۰، ۲۲۴، ۲۲۷ و ۲۲۹.",
					"قانون تجارت الکترونیکی، مصوب ۱۳۸۲.",
					"UK Law Commission, Smart Legal Contracts: Advice to Government, 2021.",
					"گزارش‌های عمومی درباره رخنه The DAO و انشعاب اتریوم، ۲۰۱۶."
				]
			}
		]
	},
	{
		id: "c6",
		part: "فصل ششم",
		title: "داده‌ها و سایه‌ای که نمی‌بینیم",
		blocks: [
			{
				k: "p",
				t: "پاکت را دبیرخانه فوری زده بود. شرکت بیمه نوشته بود بیمه‌نامه‌ای را به‌خاطر «ارزیابی ریسک بالا بر اساس داده‌های رفتاری» قطع کرده است. مشتری می‌گفت هیچ توضیحی نشنیده. دکتر دو بار خواند و محمود را نشاند."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، داده رفتاری یعنی چه؟ من به‌عنوان قاضی می‌پرسم این اطلاعات مال کیست، از کجا آمده، و چرا صاحبش حق ندارد بداند بر اساس چه چیزی از یک حق محروم شده."
			},
			{
				k: "d",
				who: "soldier",
				t: "چهار جور را قاطی نکنیم. چیزی که خود آدم می‌دهد: نام و نشانی. چیزی که از رفتارش ثبت می‌شود: ساعت ورود، مسیر کلیک، ماندن روی یک صفحه. چیزی که از ترکیب این‌ها استنتاج می‌شود: برآورد درآمد، احتمال بیماری، احتمال نکول. و داده حساس: سلامت، عقیده، مذهب، قومیت. خطرناک‌ترین برای من همان سومی است، چون صاحب داده هرگز آن جمله را ننوشته؛ کس دیگری ساخته و بعد علیه او به کار برده."
			},
			{
				k: "d",
				who: "doctor",
				t: "اصل ۲۲ قانون اساسی حیثیت و مال و حقوق اشخاص را از تعرض مصون می‌دارد مگر به تجویز قانون. اصل ۲۵ تجسس و افشای مخابرات را جز به حکم قانون ممنوع کرده است. این اصول عصر نامه و تلفن نوشته شده‌اند، اما روح‌شان به ردپای دیجیتال بی‌ربط نیست. مشکل این است که روح، به تنهایی، تکلیف شرکت بیمه را معین نمی‌کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "قانون تجارت الکترونیکی در مواد مربوط به حمایت از داده شخصی، پردازش داده حساس را بدون رضایت صریح ممنوع کرده است. این گامِ سال ۱۳۸۲ است. قانون جرایم رایانه‌ای دسترسی غیرمجاز را جرم می‌داند؛ یعنی بعد از تجاوز وارد می‌شود، نه اینکه از اول معماری جمع‌آوری را تنظیم کند. قانون جامع حمایت از داده شخصی، با نهاد ناظر مستقل و حق دسترسی و اصلاح و حذف، در نظام ما به‌صورت یک نص منسجم و لازم‌الاجرا مستقر نیست. اگر پیش‌نویسی در راهروهای سیاست بوده، تا وقتی تصویب و اجرا نشود سند لازم‌الاجرا نیست. این را صریح می‌گویم تا کسی گمان نکند خلأ را انکار می‌کنیم یا پیش‌نویس را قانون می‌خوانیم."
			},
			{
				k: "d",
				who: "doctor",
				t: "حالا رضایت. ماده ۱۹۰ قانون مدنی رضا را رکن معامله می‌داند. رضا باید آزاد و آگاه باشد. تو بگو مردم با آن صفحه بلند «شرایط را می‌پذیرم» چه می‌کنند."
			},
			{
				k: "d",
				who: "soldier",
				t: "دکتر، صادقانه: بیشترشان نمی‌خوانند. خود من هم بسیاری وقت‌ها نخوانده رد می‌شوم. اگر تنها راه استفاده از یک خدمت ضروری همین دکمه باشد، رضا شبیه قرارداد الحاقی است؛ تشریفات است نه انتخاب. از نظر فنی هم طراحی صفحه می‌تواند طوری باشد که رد کردن سخت‌تر از قبول کردن باشد. به این‌ها الگوی فریب طراحی می‌گویند."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس رضای صوری را من رضای ماده ۱۹۰ نمی‌دانم، هرچند دادگاه‌های ما هنوز قاعده واحدی برای کلیک اعلام نکرده‌اند. این موضع تحلیلی است. علاوه بر این، خیلی از خدمت‌های به‌ظاهر رایگان، بها را از داده می‌گیرند. جمله معروف صنعت این است که اگر کالا رایگانی، خودت کالا هستی. از حیث حقوق، سؤال این است که صاحب داده در سود فروش پروفایلش سهم دارد یا نه، و می‌تواند حذف را بخواهد یا نه. نص ایران به این سؤال‌ها جواب صریح و قابل اجرا نداده است."
			},
			{
				k: "d",
				who: "soldier",
				t: "مقررات عمومی حفاظت از داده اروپا، معروف به جی‌دی‌پی‌آر، از ۲۰۱۸ حق دسترسی، اصلاح، حذف در شرایط معین، انتقال و اعتراض به تصمیم صرفاً خودکار را شناخته است. ماده ۲۲ آن می‌گوید شخص نباید تنها موضوع تصمیمی خودکار باشد که اثر حقوقی جدی دارد، مگر در استثناهای خودش، و در آن استثناها هم حق دخالت انسان و اعتراض هست. ماده ۳۳ اطلاع نقض داده به مرجع ناظر را در حدود ۷۲ ساعت خواسته. این قانون ما نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "برای مقایسه چهار خلأ را می‌نویسم. نهاد ناظر مستقل نداریم. حق فراموش‌شدن به‌صورت قابل اجرا تصریح نشده. الزام زمان‌دار به اطلاع نقض داده نداریم. ارزیابی اثر بر حریم خصوصی، پیش از پروژه‌های پرخطر، تکلیف قانونی نیست. پرونده کمبریج آنالیتیکا نشان داد داده شبکه اجتماعی می‌تواند ابزار اثرگذاری سیاسی شود. اسم پرونده را برای ترس نمی‌آورم؛ برای اینکه داده فقط موضوع تبلیغ کفش نیست."
			},
			{
				k: "d",
				who: "soldier",
				t: "یک نکته فنی که حقوقی می‌شود: حتی اگر فایل خام پاک شود، مدلی که با آن آموزش دیده ممکن است اثر داده را در وزن‌هایش نگه دارد. حذف کامل همیشه به معنای پاک شدن یک پوشه نیست. اگر تصمیم بیمه از چنین مدلی آمده باشد، مشتری هم داده را نمی‌شناسد هم منطق محرومیت را."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس حق توضیح، در تصمیم مؤثر بر بیمه و وام و شغل، پیشنهاد جدی ماست. نه توضیح فرمول برای متخصص، توضیح قابل فهم برای انسان معمولی: کدام دسته داده، کدام اثر، و راه اعتراض انسانی. نامه امروز را دوباره می‌بینم. یک نفر بی‌آنکه بداند چه تصویری از او ساخته‌اند از پوششی محروم شده. نه با رأی قاضی. با برچسب. قانون نباید فناوری را خاموش کند. باید مطمئن شود فناوری بی‌پاسخ حق را قطع نمی‌کند."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"داده استنتاجی را صاحب داده «داده» نداده؛ ساخته شده است.",
					"کلیک نخوانده، رضای آگاه ماده ۱۹۰ نیست؛ این تحلیل است نه هنوز رویه متحد.",
					"مواد داده در قانون تجارت الکترونیکی لازم‌اند و کافی نیستند.",
					"حق توضیح وقتی معنا دارد که انسان بتواند تصمیم را برگرداند."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود قانون جامع حمایت از داده با ضمانت اجرای مؤثر.",
					"نبود مرجع مستقل نظارت.",
					"نبود تکلیف اطلاع‌رسانی نقض و ارزیابی اثر حریم.",
					"نبود حق اعتراض به تصمیم صرفاً خودکار در بیمه، اعتبار و استخدام."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"قانون مستقل: حداقل‌سازی داده، هدف مشخص، رضای قابل پس‌گرفتن، دسترسی، اصلاح، حذف مشروط.",
					"نهاد ناظر با استقلال واقعی و اختیار جریمه.",
					"حق توضیح و بازبینی انسانی برای تصمیم الگوریتمی مؤثر بر حق."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اساسی، اصول ۲۲ و ۲۵.",
					"قانون مدنی، ماده ۱۹۰.",
					"قانون تجارت الکترونیکی، مصوب ۱۳۸۲، فصل حمایت از داده شخصی.",
					"قانون جرایم رایانه‌ای، مصوب ۱۳۸۸.",
					"Regulation (EU) 2016/679، مواد ۵، ۱۷، ۲۲ و ۳۳.",
					"گزارش‌های مقام حفاظت از داده بریتانیا درباره Cambridge Analytica، ۲۰۱۸."
				]
			}
		]
	},
	{
		id: "c7",
		part: "فصل هفتم",
		title: "وقتی نتیجه را ماشین رقم می‌زند، جرم مال کیست؟",
		blocks: [
			{
				k: "p",
				t: "دکتر ایستاده بود. هر وقت پای مجازات و ابزار به هم می‌رسید همین‌طور می‌ایستاد، انگار اگر بنشیند مسئولیت جایی بلغزد. گزارش دادسرا را به محمود داد. متهم با صدای ساخته‌شده، خود را کارمند بانک جا زده و زن سالمندی را به انتقال پول واداشته بود. در بازجویی گفته بود: «من فقط برنامه را باز کردم. حرف را ماشین زد.»"
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، اصل سی‌وششم قانون اساسی می‌گوید حکم به مجازات و اجرای آن تنها از راه دادگاه صالح و به موجب قانون است. ماده ۲ قانون مجازات اسلامی هم هر رفتاری را جرم می‌داند که قانون برایش مجازات تعیین کرده باشد، فعل باشد یا ترک فعل. اگر این اصل بلرزد، ماشین بهانه بی‌مجازات شدن انسان می‌شود. تو بگو برنامه چه می‌کند. انتساب جرم با من."
			},
			{
				k: "d",
				who: "soldier",
				t: "مدل از روی نمونه کوتاه، صدایی شبیه دیگری می‌سازد. نیت ندارد. نمی‌داند کلاهبرداری چیست. متن فریب را کاربر می‌دهد. خروجی، محصول تابع است. اگر کاربر بداند این صدا برای فریب به کار می‌رود، فریب از او آمده است."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس این جمله را زمین بگذاریم: خروجی ماشین، رفتارِ قابل مجازاتِ ماشین نیست. ماده ۱۴۴ می‌گوید در جرم عمدی علاوه بر علم به موضوع، قصد رفتار باید احراز شود و در جرایم مقید، قصد نتیجه یا علم به وقوع آن. مدل علم و قصد ندارد. رکن روانی روی معادله نمی‌نشیند. نرم‌افزار شرمنده نمی‌شود و عبرت نمی‌گیرد. مجازات کردنش، در واقع مجازات نکردن است."
			},
			{
				k: "d",
				who: "soldier",
				t: "بعضی‌ها فوراً می‌گویند پس شرکت را مجازات کنید."
			},
			{
				k: "d",
				who: "doctor",
				t: "زود می‌گویند. ماده ۱۴۳ اصل را بر مسئولیت شخص حقیقی گذاشته و شخص حقوقی را وقتی مسئول می‌داند که نماینده قانونی‌اش به نام یا در راستای منافع آن مرتکب جرم شود. مسئولیت شخص حقوقی، مسئولیت مرتکب انسانی را پاک نمی‌کند. ساختن ابزار عمومی، مثل دوربین یا قلم، به‌خودی‌خود جرم نیست. مرز را معاونت می‌کشد. ماده ۱۲۶ از جمله تهیه وسایل ارتکاب جرم و تسهیل وقوع جرم را، با علم، معاونت می‌شمارد. ماده ۱۴۲ هم مسئولیت به‌سبب رفتار دیگری را محدود کرده به جایی که شخص قانوناً مسئول اعمال دیگری است، یا درباره نتیجه مرتکب تقصیر شده است."
			},
			{
				k: "d",
				who: "soldier",
				t: "اگر سازنده بداند یک پیکربندی فقط به کار فریب می‌آید و مانع را عمداً بردارد، دیگر ابزار خنثی نیست. این را از منطق فن می‌گویم."
			},
			{
				k: "d",
				who: "doctor",
				t: "و منطق تو با ساختار قانون ناسازگار نیست. مصداق را دادگاه ثابت می‌کند: علم بوده یا نه، تقصیر بوده یا نه، رابطه با نتیجه هست یا نه. برای خطای غیرعمد، ماده ۱۴۵ تحقق جرم غیرعمدی را منوط به تقصیر کرده و تبصره‌اش تقصیر را بی‌احتیاطی و بی‌مبالاتی می‌داند؛ مسامحه، غفلت، عدم مهارت، عدم رعایت نظامات. اگر سامانه تشخیص چهره بی‌گناهی را به اشتباه «همان متهم» بخواند و مأمور بی‌بررسی بازداشت کند، سؤال این نیست که مدل زندانی شود. سؤال این است کدام انسان تکلیف مراقبت را ترک کرده. اصل ۳۲ هم اصل را بر ممنوعیت دستگیری گذاشته مگر به ترتیبی که قانون معین کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "قانون جرایم رایانه‌ای جعل و کلاهبرداری رایانه‌ای را جرم‌انگاری کرده است. مخاطب آن مواد انسان است؛ کسی که داده را به‌طور متقلبانه ایجاد یا وارد می‌کند یا با سامانه مال به دست می‌آورد. «داده خودش» مرتکب نیست."
			},
			{
				k: "p",
				t: "دکتر سه فرض نوشت. اول: همین متهم که متن فریب را داده و تماس گرفته. اگر ارکان ثابت شود جرم مال اوست و ماشین وسیله است. دوم: شرکتی که الگوی سوءاستفاده را می‌بیند و هشدار را برای حفظ فروش خاموش می‌کند. اینجا بی‌طرفی ابزار تمام شده و تقصیر یا معاونت قابل بررسی است. سوم: خطای سامانه پلیسی بی‌قصد فریب. تا تقصیر اثبات نشود از جنس مجازات نیست؛ از جنس ابطال اقدام و جبران است."
			},
			{
				k: "d",
				who: "doctor",
				t: "در تمپی تعقیب کیفری سراغ انسان رفت. این را الگوی مقدس نمی‌دانم. فقط نشان می‌دهد بهانه «ماشین انجام داد» در نظام‌های جلوتر هم دفاع تمام نیست. اگر ما صریح‌تر بنویسیم که موضوع مجازات انسان است و زنجیره تقصیر باید شکافته شود، از آن‌ها عقب نیستیم."
			},
			{
				k: "d",
				who: "soldier",
				t: "پس آن جمله متهم دفاع نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "بهانه است. مگر ثابت کند خود علم و قصد نداشته و حلقه بی‌تقصیر بوده. ماشین شهادت نمی‌دهد."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"اصل قانونی بودن جرم اجازه نمی‌دهد برچسب «مجرم بودن الگوریتم» جای نص را بگیرد.",
					"رکن روانی بر انسان بار می‌شود نه بر مدل.",
					"شخص حقوقی در چارچوب ماده ۱۴۳ مسئول است، نه به‌جای مرتکب.",
					"ابزار خنثی با ابزارِ طراحی‌شده برای جرم یکی نیست."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود قاعده ویژه برای توزیع تقصیر کیفری در زنجیره سامانه خودمختار.",
					"نبود تکلیف روشن مراقبت برای بهره‌بردار سامانه پرخطر.",
					"نبود معیار اینکه چه میزان علم به سوءاستفاده محتمل، معاونت یا تقصیر می‌سازد."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"تصریح اینکه سامانه هوشمند فاقد مسئولیت کیفری مستقل است.",
					"تکلیف مراقبت حرفه‌ای برای عرضه‌کننده و بهره‌بردار سامانه پرخطر، با ضمانت اجرای متناسب.",
					"ممنوعیت بنای تصمیم سالب آزادی صرفاً بر خروجی توضیح‌ناپذیر."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اساسی، اصول ۳۲ و ۳۶.",
					"قانون مجازات اسلامی، مواد ۲، ۱۲۶، ۱۴۲، ۱۴۳، ۱۴۴ و ۱۴۵.",
					"قانون جرایم رایانه‌ای، مصوب ۱۳۸۸."
				]
			}
		]
	},
	{
		id: "c8",
		part: "فصل هشتم",
		title: "رمزارز، رمزپول و مالی که در جیب نیست",
		blocks: [
			{
				k: "p",
				t: "ورثه آمده بودند، نه با سند خانه، با تکه‌کاغذی که دوازده کلمه روی آن بود. می‌گفتند پدر این را «کلید پول اینترنتی» می‌نامیده. هیچ بانکی آن کلمات را به رسمیت نمی‌شناخت. خواهر می‌گفت کلاهبرداری است و اصلاً مال نیست. برادر می‌گفت اگر مال نباشد، چرا بازار برایش قیمت می‌گذارد."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، پیش از هر ماده، بگو این دوازده کلمه از نظر فنی چیست. من بعد می‌گویم مال هست یا نیست. این دو را قاطی نکن."
			},
			{
				k: "d",
				who: "soldier",
				t: "آن کلمات معمولاً راه بازسازی کلید خصوصی‌اند. هر کس کلید را داشته باشد، در شبکه می‌تواند انتقال را امضا کند. شبکه نمی‌پرسد وارث هستید یا سارق. صرافی متمرکز فرق دارد: آنجا شرکت حساب را نگه می‌دارد و می‌تواند، اگر بخواهد و اگر قانون مجبورش کند، موجودی را قفل کند. کیف شخصی این شرکت را ندارد. قیمت هم در بازار بالا و پایین می‌شود؛ خودِ ثبت شبکه قیمت را تضمین نمی‌کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "حقوق ما «رمزپول» را با قانون بانک مرکزی جمهوری اسلامی ایران، مصوب خرداد ۱۴۰۲، وارد ادبیات رسمی کرد. بند مربوط در ماده یک، رمزپول را تعریف کرده است. تبصره یک ماده چهار، تصمیم درباره جواز نگهداری و مبادله انواع رمزپول را به هیئت عالی بانک مرکزی سپرده. ماده ۵۹ فعالان این عرصه را شخص تحت نظارت بانک مرکزی دانسته است. در بهمن ۱۴۰۳ نیز رئیس‌جمهور، با استناد به همین مواد، بانک مرکزی را متولی انحصاری ساماندهی بازار رمزپول و مرجع مجوز دانسته است. این‌ها را قانون و سند لازم‌الاتباعِ همان سطح خودشان بدانید، نه سلیقه کتاب."
			},
			{
				k: "d",
				who: "doctor",
				t: "اما مواظب کلمه باشیم. معاون حقوقی بانک مرکزی در مرداد ۱۴۰۴ نوشته است که صلاحیت این بانک به رمزدارایی‌هایی که رمزپول نیستند نمی‌رسد. یعنی «هر چیزی روی بلاک‌چین» لزوماً موضوع آن قانون نیست. توکنی که نمایندگی یک ادعا یا یک دارایی دیگر است ممکن است ذیل قواعد دیگری برود: بیع، سهام، مال کلی، یا حتی چیزی که هنوز اسم حقوقی ندارد. این مرز را اگر روزنامه‌ها قاطی کنند، دادگاه نباید قاطی کند."
			},
			{
				k: "d",
				who: "soldier",
				t: "یک واقعیت اجرایی را هم بگویم، چون مردم با آن زندگی می‌کنند. تا دی ۱۴۰۴ مقام رسمی بانک مرکزی گفته دستورالعمل فعالیت این حوزه تصویب شده اما هنوز مجوزی برای سکوهای تبادل صادر نشده و مردم با ریسک خود وارد می‌شوند. این خبرِ یک مقام است. اگر تا زمان چاپ کتاب وضعیت عوض شده باشد، باید به‌روز شود. از نظر فنی، نبود مجوز، وجود بازار را منتفی نمی‌کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "پیش از قانون بانک مرکزی، تصویب‌نامه هیئت وزیران در سیزدهم مرداد ۱۳۹۸ استخراج را به‌عنوان صنعت شناخت و استفاده از رمزارز را برای پرداخت داخل کشور نپذیرفت. بخشنامه‌های بانکی نیز بانک‌ها را از معامله این دارایی‌ها دور کردند. پس امروز با یک پشته مواجه‌ایم: مصوبه دولت، قانون بانک مرکزی، نامه سیاستی رئیس‌جمهور، و بازاری که بخش بزرگی‌اش هنوز بیرون از مجوز ایستاده. قاضی حق ندارد این پشته را یک جمله کند: «قانونی است» یا «نیست»."
			},
			{
				k: "d",
				who: "doctor",
				t: "آیا مال است؟ قانون مدنی در ماده ۱۴۰ اسباب تملک را شمرده، اما تعریف فلسفی مال را در یک ماده کوتاه حبس نکرده. در فقه و در عرف حقوق ما، مال آن است که منفعت عقلایی داشته باشد و بشود آن را اختصاص داد. اگر چیزی در عرف قیمت دارد و قابل نقل است، گرایش قوی این است که مال محسوب شود حتی اگر پول رسمی کشور نباشد. این گرایش، تحلیل است. رأی وحدت رویه‌ای که این کتاب بخواهد به آن تکیه کند در دست ما نیست و نباید جعل شود. نتیجه عملی تحلیل: اگر مال باشد، داخل ترکه است و ارث به آن می‌رسد؛ اگر فقط یک امتیاز قراردادی نزد یک شرکت خارجی باشد، موضوع حق دینی است و باز هم بی‌حکم نمی‌ماند."
			},
			{
				k: "d",
				who: "soldier",
				t: "مشکل اجرا این است که وراث ممکن است کلمات را داشته باشند و ندانند موجودی کدام شبکه است، یا موجودی نزد سکویی باشد که نه در ایران است نه جواب نامه را می‌دهد. کلید گم شود، از نظر شبکه مال هست و از نظر خانواده نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "کلاهبرداری و پول‌شویی هم با گفتن اینکه دارایی «جدید» است معلق نمی‌مانند. اگر فریب و بردن مال صدق کند، عنوان کلاسیک کلاهبرداری یا عنوان رایانه‌ای‌اش قابل بررسی است. اگر مال از جرم باشد، تکالیف مبارزه با پول‌شویی سرجایش است. آنچه نداریم قواعد روشن مالیات، ارث عملی، و تفکیک رمزپول از دیگر رمزدارایی‌ها در زبان دادنامه است. مردم در این مه دو ضرر می‌بینند: یکی از کلاهبردار، یکی از نهادی که اسم مالشان را بلد نیست."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"کلید خصوصی کنترل است نه لزوماً سند رسمی مالکیت.",
					"رمزپول در قانون بانک مرکزی تعریف دارد؛ هر رمزدارایی لزوماً رمزپول نیست.",
					"ممنوعیت پرداخت داخلی با رمزارز، به‌معنای معدوم بودن مال نیست.",
					"ورود به ترکه، اگر وصف مال پذیرفته شود، نتیجه قواعد ارث است نه لطف سکو."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود رویه پایدار درباره وصف مال بودن انواع رمزدارایی.",
					"نبود آیین ارث و انحصار وراثت برای کلید و حساب سکو.",
					"فاصله میان تکلیف مجوز و بازاری که بدون مجوز کار می‌کند.",
					"ابهام مالیات و تفکیک صلاحیت بانک مرکزی از سایر اموال دیجیتال."
				]
			},
			{
				k: "box",
				kind: "risk",
				title: "مخاطرات",
				items: [
					"از دست رفتن کلید و ناپدید شدن عملی دارایی.",
					"سکوهای بی‌مجوز و نبود پاسخگو هنگام اختلاف.",
					"نوسان ارزش میان تاریخ صدور حکم و تاریخ اجرا."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"تعریف لایه‌لایه: رمزپول، رمزدارایی، توکن نمایندگی حق، و توکن بی‌پشتوانه.",
					"قاعده ارث: تکلیف افشا به وراث، حفظ کلید نزد امین، و اثر گم‌شدن کلید.",
					"روش محاسبه ارزش برای مهریه، خسارت و دیون، با تاریخ معین و کارشناس."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون بانک مرکزی جمهوری اسلامی ایران، مصوب ۱۴۰۲/۳/۳۰، از جمله ماده ۱، تبصره ۱ ماده ۴ و ماده ۵۹.",
					"نامه رئیس‌جمهور به رئیس‌کل بانک مرکزی، ۱۵ بهمن ۱۴۰۳.",
					"یادداشت معاون حقوقی بانک مرکزی درباره حدود صلاحیت نسبت به رمزدارایی، مرداد ۱۴۰۴.",
					"تصویب‌نامه هیئت وزیران درباره استخراج رمزارز، ۱۳ مرداد ۱۳۹۸.",
					"اظهارات معاون نظام‌های پرداخت بانک مرکزی درباره وضعیت مجوز سکوها، دی ۱۴۰۴؛ نیازمند به‌روزرسانی.",
					"قانون مدنی، ماده ۱۴۰ و کتاب ارث."
				]
			},
			{
				k: "box",
				kind: "ask",
				title: "نیازمند به‌روزرسانی",
				items: ["وضعیت نهایی دستورالعمل هیئت عالی و شمار مجوزهای صادرشده در زمان چاپ.", "هر رأی منتشرشده هیئت عمومی که وصف مال یا صلاحیت را روشن کرده باشد."]
			}
		]
	}
];
var ch0914 = [
	{
		id: "c9",
		part: "فصل نهم",
		title: "توقیف مالی که دست نمی‌آید",
		blocks: [
			{
				k: "p",
				t: "محکوم‌له در راهرو ایستاده بود و برگه اجرا را تا کرده بود. می‌گفت محکوم‌علیه خانه و حساب بانکی ندارد، اما در یک سکو «تتر» دارد. مأمور اجرا پرسیده بود تتر را از کدام قفسه برداریم. کسی جواب نداده بود."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، قانون اجرای احکام مدنی مصوب ۱۳۵۶ برای توقیف مال منقول و غیرمنقول و طلب نوشته شده است. اسم کلید خصوصی و نشانی کیف و حساب سکو در آن نیست. این سکوت، به‌معنای مصونیت بدهکارِ فناوری‌دان نیست. قاعده این است که محکوم‌علیه باید مدلول حکم را بدهد و اگر ندهد از مالش برداشته می‌شود. سؤال امروز شیوه برداشتن است. تو شیوه‌های بودنِ دارایی را بشمار."
			},
			{
				k: "d",
				who: "soldier",
				t: "سه جا. یک: حساب نزد سکوی متمرکز. شرکت می‌تواند موجودی را ببیند و اگر در قلمرو مأمور باشد، دستور مسدودسازی را اجرا کند. دو: کیف روی تلفن محکوم‌علیه. اگر دستگاه توقیف شود و رمزش دانسته شود، دسترسی ممکن است؛ اگر نه، دستگاه یک جعبه بسته است. سه: کیف سرد یا کلمات بازیابی که فقط در حافظه اوست. شبکه به حکم دادگاه کاری ندارد. تنها اهرم، خود شخص است."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس اجرا را باید به همین سه تا بشکنیم، وگرنه یک دستور کلی می‌نویسیم که هیچ مأموری نمی‌تواند انجام دهد. برای سکوی داخل کشور، اگر روزی مجوز بگیرد و شخص تحت نظارت بانک مرکزی باشد، دستور به سکو از جنس توقیف طلب و موجودی نزد ثالث است. برای سکوی بی‌مجوز یا بیرون از کشور، نباید به مردم وعده دروغ بدهیم. نامه ممکن است بی‌جواب بماند. آن‌وقت مسیر، شناسایی اموال دیگر و در موارد قانونی، تکلیف محکوم‌علیه به معرفی مال است نه نمایشِ توقیف ناممکن."
			},
			{
				k: "d",
				who: "soldier",
				t: "حتی اگر سکو قفل کند، ارزش تا روز فروش ثابت نیست. اگر حکم به ریال است و دارایی نوسان دارد، فردا ممکن است کمتر یا بیشتر از محکوم‌به باشد. فروش هم خودش تخصص می‌خواهد. دکمه «تبدیل به ریال» در دادگستری نداریم."
			},
			{
				k: "d",
				who: "doctor",
				t: "پیشنهاد اجرایی ما، که نص نیست، این ترتیب است. اول، پرسش استاندارد در اجرای احکام: آیا حساب سکو، کیف، یا کلمه بازیابی دارید. دروغ در معرفی مال، همان آثار معرفی‌نکردن مال را دارد؛ فناوری عنوان تازه برای کتمان نیست. دوم، توقیف فوری حساب سکوهای در دسترس، پیش از آنکه منتقل شود. سوم، اگر فقط کلید در اختیار محکوم‌علیه است، انتقال به کیفِ تحت کنترل اجرا با حضور کارشناس و صورت‌جلسه، نه ضبط نمایشی تلفن بدون دسترسی. چهارم، نگهداری کوتاه و فروش از مسیر کارگزاری مجاز، با ثبت ساعت و نرخ. پنجم، اگر کلید غیب شد، توقف خیال‌بافانه و رفتن به سوی سایر اموال و ضمانت‌های قانونی امتناع."
			},
			{
				k: "d",
				who: "doctor",
				t: "یک هشدار: مأمور و کارشناس نباید کلید را روی کاغذ شخصی یادداشت کنند. کلید، خودِ مال است. افشای بی‌جهت، خیانت است نه زرنگی. زنجیره نگهداری باید مثل توقیف وجه نقد سخت‌گیر باشد؛ سخت‌گیرتر، چون کپی کلید هم به اندازه اصل کار می‌کند."
			},
			{
				k: "d",
				who: "soldier",
				t: "از نظر فنی کپی یعنی اگر یک بار روی رایانه ناامن دیده شود، توقیف شما دیگر انحصاری نیست. باید دستگاه مطمئن، حداقل افراد، و امحای نسخه موقت در صورت‌جلسه باشد."
			},
			{
				k: "d",
				who: "doctor",
				t: "حقوق تطبیقی هم معجزه واحدی ندارد. بعضی کشورها دستور افشا به صرافی می‌دهند و بعضی برای خودداری از تحویل کلید ضمانت اجرا می‌گذارند. ما حق نداریم شکنجه یا اجبار خارج از قانون را پشت «اجرای حکم» پنهان کنیم. اجبار فقط در قالب همان ضمانت‌هایی است که قانون اجرا و قانون مجازات برای امتناع و کتمان شناخته‌اند. اگر آن قالب‌ها برای کلید نارسایند، باید اصلاح شوند نه اینکه مأمور ابتکار خطرناک کند."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"توقیف بسته به این است که دارایی نزد ثالث است یا فقط نزد کلید.",
					"شبکه غیرمتمرکز دستور دادگاه را اجرا نمی‌کند؛ شخص یا سکو اجرا می‌کند.",
					"کپی کلید به‌منزله از دست رفتن انحصار توقیف است.",
					"نوسان ارزش باید در زمان‌بندی فروش دیده شود."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود آیین‌نامه اجرای احکام درباره کیف پول و حساب سکو.",
					"نبود مسیر رسمی فروش و تبدیل با نرخ قابل اعتراض.",
					"نبود قاعده نگهداری امن کلید در طول عملیات اجرا."
				]
			},
			{
				k: "box",
				kind: "exec",
				title: "پیشنهاد اجرایی",
				items: [
					"فرم شناسایی دارایی دیجیتال در واحد اجرا.",
					"آموزش محدود مأموران؛ نه اینکه همه مأموران متخصص کلید شوند.",
					"فهرست سکوهای قابل ابلاغ، به‌محض مجوزدار شدن، از سوی بانک مرکزی به قوه قضاییه."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: ["الحاق فصل کوتاه به قانون اجرای احکام: تعریف، توقیف نزد سکو، انتقال کلید، کارشناسی نرخ، و ممنوعیت افشای کلید.", "ضمانت اجرای کتمان کلید، هم‌تراز کتمان مال، بدون گسترش اجبارهای خلاف کرامت."]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اجرای احکام مدنی، مصوب ۱۳۵۶.",
					"قانون بانک مرکزی، مصوب ۱۴۰۲، درباره اشخاص تحت نظارت در حوزه رمزپول.",
					"قانون مدنی، قواعد تلف و ضمان؛ برای دوره میان توقیف و فروش."
				]
			}
		]
	},
	{
		id: "c10",
		part: "فصل دهم",
		title: "وقتی دفتر زنجیره‌ای به دادگاه می‌آید",
		blocks: [
			{
				k: "p",
				t: "همان زنِ روز اول، ماه‌ها بعد، برگشته بود. این بار پسرش صفحه‌ای چاپ کرده بود: شناسه یک تراکنش. محمود نگاه کرد و چیزی نگفت تا دکتر بپرسد. قرارشان این بود که هیجان فن، جای دلیل را نگیرد."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، سه کلمه را جدا کن: تمامیت، اصالت، انتساب. من باید بدانم این صفحه کدام را ثابت می‌کند و کدام را فقط ادعا می‌کند."
			},
			{
				k: "d",
				who: "soldier",
				t: "شناسه تراکنش، اگر واقعاً مال یک شبکه شناخته‌شده باشد و گرههای زیاد آن را دیده باشند، نشان می‌دهد آن نقل در آن زمان در دفتر ثبت شده و عوض کردنش سخت است. این به تمامیت نزدیک است. اصالت به‌معنای اینکه محتوا از اول دروغ نبوده، خودکار ثابت نمی‌شود؛ شبکه همان دروغ را هم وفادارانه نگه می‌دارد. انتساب به این شخص حقیقی هم از خود شناسه درنمی‌آید. نشانی، اسم و کد ملی ندارد. باید پل زده شود: واریز از حساب بانکی به سکو، احراز هویت سکو، اقرار، یا اماره دیگر."
			},
			{
				k: "d",
				who: "doctor",
				t: "این تفکیک، قلب فصل است. ماده ۱۲ قانون تجارت الکترونیکی می‌گوید اسناد و ادله می‌توانند به‌صورت دادهپیام باشند و نمی‌توان ارزش اثباتی را تنها به دلیل شکل الکترونیکی رد کرد. ماده ۶ در مواردی دادهپیام را در حکم نوشته می‌داند و استثناهایی مثل سند مالکیت غیرمنقول دارد. ماده مربوط به دادهپیام مطمئن، داده را از حیث محتوا و امضا معتبر می‌شمارد اگر به طریق مطمئن ایجاد و نگهداری شده باشد. بلاک‌چین ممکن است به «مطمئن بودنِ نگهداری» کمک کند. جایگزینِ همه شرایط سند رسمی نمی‌شود و هویت امضاکننده را جادو نمی‌کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "پس در پرونده این زن، صفحه چاپ‌شده به‌تنهایی سند رسمی نیست. می‌تواند آغاز کارشناسی باشد. کارشناس باید بگوید این شناسه در کدام شبکه است، آیا تثبیت شده، با چه ابزاری خوانده شده، و آیا به حساب یا دستگاهی که در اختیار طرف است می‌رسد یا نه. نظر کارشناس اگر با اوضاع معلوم نخواند، به ماده ۲۶۵ آیین دادرسی مدنی، برای دادگاه الزام‌آور نیست. وجدان دادرس هنوز اینجاست."
			},
			{
				k: "d",
				who: "soldier",
				t: "یک خطر فنی: تصویر صفحه را می‌شود ساخت. استناد باید به خود دفتر، از مسیر قابل بازبینی، باشد نه به عکس تلفن. ابزار مشاهده هم مهم است؛ سرویس‌های کاوشگر شخص ثالث خودشان محل اعتمادند و باید در گزارش بیایند."
			},
			{
				k: "d",
				who: "doctor",
				t: "و خطر حقوقیِ مقابلش این است که چون اسم فناوری جدید است، قاضی دلیل را یکجا دور بریزد و صاحب حق را به بهانه کهنگی قانون ناامید کند. ماده ۱۹۴ دلیل را امری می‌داند که برای اثبات یا دفاع به آن استناد می‌شود. اگر قانون شکل الکترونیکی را به‌خودی‌خود بی‌اعتبار نکرده، بی‌اعتباری باید دلیل داشته باشد نه عادت."
			},
			{
				k: "p",
				t: "جمع‌بندی‌شان کوتاه بود. دفتر زنجیره‌ای حافظه سرسخت است. حافظه سرسخت، شاهد عادل نیست. شاهد وقتی ساخته می‌شود که حافظه به یک انسان گره بخورد و آن گره را بشود در دادگاه آزمود."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"تمامیت ثبت غیر از صدق محتوا و غیر از هویت فاعل است.",
					"دادهپیام در قانون تجارت الکترونیکی قابل رد صرفاً به دلیل الکترونیکی بودن نیست.",
					"چاپ صفحه، بدون امکان بازبینی در دفتر، دلیل ضعیف است.",
					"کارشناس پل می‌زند؛ رأی را امضا نمی‌کند."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود استاندارد شکلی گزارش کارشناسی بلاک‌چین.",
					"نبود اماره قانونی برای پیوند نشانی به شخص؛ هر پیوند باید اثبات شود.",
					"ابهام در اینکه کدام شبکه و کدام درجه تثبیت، «طریق مطمئن» است."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: ["آیین‌نامه استناد به دفتر توزیع‌شده: حداقل‌های گزارش، ابزار مشاهده، و تفکیک سه وصف تمامیت و اصالت و انتساب.", "آموزش و صلاحیت کارشناسی رسمی در این رشته."]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون تجارت الکترونیکی، مواد ۶، ۱۲ و قواعد دادهپیام و امضای مطمئن.",
					"قانون آیین دادرسی مدنی، مواد ۱۹۴، ۲۵۷ و ۲۶۵.",
					"قانون مدنی، ماده ۱۲۵۸."
				]
			}
		]
	},
	{
		id: "c11",
		part: "فصل یازدهم",
		title: "هوش مصنوعی در دادگستری، نه به‌جای دادگستری",
		blocks: [
			{
				k: "p",
				t: "پیشنهاد روی میز دکتر از یک شرکت داخلی بود. سه وعده: خلاصه پرونده در یک صفحه، پیشنهاد وقت رسیدگی، و پیش‌نویس رأی. کلمه سوم را دکتر با مداد خط زد پیش از آنکه محمود بنشیند."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، با دو وعده اول دشمن نیستم. با سومی دشمنم تا وقتی قانون صریح نگفته باشد، و حتی بعد از آن هم با سپردنِ ماهیتی که اصل ۱۶۶ به گردن قاضی گذاشته. حکم باید مستدل و مستند باشد. پیش‌نویس اگر از زبان ماشین بیاید و قاضی فقط امضا کند، استدلال مالِ ماشین است و مسئولیت نمایشاً مالِ قاضی. این تقسیم، دروغ اداری است."
			},
			{
				k: "d",
				who: "soldier",
				t: "از نظر فنی خلاصه‌ساز هم بی‌خطر نیست. مدل ممکن است جمله‌ای را که در پرونده نیست روان و قانع‌کننده بسازد. به این می‌گویند توهم. اگر خلاصه مبنای تصمیم شود و کسی متن اصلی را نخواند، خطا وارد رأی می‌شود. پس خلاصه فقط فهرست ورود به متن است، با نشان صفحه و بند. هر جمله‌ای که ارجاع ندارد باید فرض شود که نیست."
			},
			{
				k: "d",
				who: "doctor",
				t: "همین قاعده را می‌پسندم و باید در دستورالعمل بیاید نه در امید به خوش‌قولی نرم‌افزار. کاربردهای قابل دفاع، به نظر من، این‌هاست: جست‌وجوی متن قانون و رأی، با ذکر منبع؛ نوبت‌دهی و مکاتبه تکراری؛ کشف نقص پرونده مثل نبود نشانی؛ هشدار تعارض علنی میان دو بخش پیش‌نویسِ خودِ قاضی. کاربرد ممنوع تا اطلاع ثانوی: تشخیص مجرمیت، تعیین مجازات، رد یا قبول خواسته، و هر امتیازدهی پنهان به طرفین."
			},
			{
				k: "d",
				who: "soldier",
				t: "اگر مدل را با داده پرونده‌های واقعی آموزش دهند، حریم مردمی که رضای پردازش نداده‌اند وسط می‌آید. داده قضایی سوخت رایگان شرکت‌ها نیست. می‌شود سامانه را در محیط بسته قوه گذاشت، بی‌آنکه متن پرونده از ساختمان خارج شود."
			},
			{
				k: "d",
				who: "doctor",
				t: "این شرط برای من مقدم بر دقت مدل است. اصل ۲۵ و راز حرفه‌ای قضاء اجازه نمی‌دهد پرونده به بهانه نوآوری به سرور ناشناس برود. سامانه‌هایی که امروز برای ابلاغ و اطلاع‌رسانی داریم، مثل زیرساخت الکترونیک قضایی، نشان می‌دهد فناوری در دادگستری بیگانه نیست. بیگانه، سپردن قضاوت است. تفاوت این دو را بازاریابی عمداً محو می‌کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "حق دفاع هم باید دیده شود. اگر ابزاری به قاضی چیزی نشان می‌دهد که در پرونده نیست، طرفین باید بتوانند به آن چیز حمله کنند. ابزار پنهان، دلیل پنهان است و دلیل پنهان با ترافع نمی‌خواند. پیشنهاد ما: هر استفاده مؤثر در پرونده، در صورت‌مجلس بیاید؛ نام ابزار، محدوده کار، و اینکه قاضی متن اصلی را دیده است."
			},
			{
				k: "p",
				t: "محمود گفت می‌توان کاری کرد که مدل اصلاً رأی پیشنهاد نکند و فقط سؤال بپرسد: کدام دلیل هنوز ارزیابی نشده، کدام مهلت رد شده. دکتر این را از پیش‌نویس رأی شریف‌تر دانست. ماشینی که سؤال خوب بپرسد به عدالت نزدیک‌تر است از ماشینی که جواب شیک بدهد."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"خلاصه بدون ارجاع به بند پرونده قابل اعتماد نیست.",
					"پیش‌نویس رأیِ آماده امضا، مسئولیت را نمایشی می‌کند.",
					"داده پرونده نباید برای آموزش تجاری از قوه خارج شود.",
					"ابزار مؤثر بر پرونده باید برای طرفین قابل مشاهده و قابل اعتراض باشد."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود دستورالعمل حدود استفاده قاضی از مدل زبانی.",
					"نبود ممنوعیت صریح امتیازدهی پنهان به اصحاب دعوا.",
					"نبود تکلیف صورت‌جلسه‌کردن استفاده از ابزار."
				]
			},
			{
				k: "box",
				kind: "exec",
				title: "پیشنهاد اجرایی",
				items: [
					"آزمایش ابزار فقط روی جست‌وجو و نقص پرونده، در یک حوزه قضایی، با ارزیابی مستقل.",
					"فهرست سیاه کاربردها تا تصویب چارچوب.",
					"قرارداد پردازش داده که خروج پرونده از زیرساخت قوه را نقض اساسی بداند."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"تصریح اصل ۱۶۶ در عصر ابزار: استناد به خروجی مدل، استناد قانونی نیست.",
					"ممنوعیت تصمیم ماهوی کاملاً خودکار.",
					"حق طرفین بر آگاهی از ابزار مؤثر در پرونده."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اساسی، اصول ۲۵، ۳۴ و ۱۶۶.",
					"قانون آیین دادرسی مدنی، قواعد ترافع و کارشناسی.",
					"Regulation (EU) 2024/1689، طبقه پرخطر و نظارت انسانی؛ مطالعه تطبیقی."
				]
			}
		]
	},
	{
		id: "c12",
		part: "فصل دوازدهم",
		title: "عدالت دیجیتال و اعتمادی که نباید گم شود",
		blocks: [
			{
				k: "p",
				t: "مرد از روستا آمده بود و ابلاغ الکترونیک را ندیده بود. تلفن هوشمند نداشت. پسرش گاهی برای او پیام را می‌خواند و آن ماه پسر شهر نبود. حکم غیابی صادر شده بود. مرد فکر می‌کرد دستگاه عمداً او را کنار گذاشته. دکتر نگفت دستگاه عمد دارد. گفت دستگاه بی‌اعتناست و بی‌اعتنایی نهاد، از عمدِ شخص خطرناک‌تر است چون کسی عذرخواهی نمی‌کند."
			},
			{
				k: "d",
				who: "doctor",
				t: "اصل ۳۴ دادخواهی را حق مسلم هر فرد می‌داند. اصل ۱۹ رنگ و زبان و مانند این‌ها را سبب امتیاز نمی‌داند. اگر راه رسیدن به دادگاه فقط از یک برنامه بگذرد، کسانی که برنامه ندارند عملاً از حقی که قانون اساسی به آن‌ها داده عقب می‌مانند. سرعت برای بقیه، تعطیلی حق برای این‌هاست."
			},
			{
				k: "d",
				who: "soldier",
				t: "فناوری می‌تواند مسیر کاغذی موازی را گران و شرم‌آور جلوه دهد. طراحی خوب عکس این است: مسیر الکترونیک برای کسی که می‌خواهد، و مسیر باجه و کاغذ و مهلت واقعی برای کسی که نمی‌تواند. همچنین رابط کاربری اگر فقط برای جوانِ شهر طراحی شود، خودش یک نوع سوگیری است، بی‌آنکه کسی نژاد یا طبقه را در کد بنویسد."
			},
			{
				k: "d",
				who: "doctor",
				t: "اعتماد عمومی هم با یک رسوایی الگوریتمی فرو می‌ریزد. مردم فرق جعبه سیاه و کارشناس را نمی‌گذارند. اگر یک بار بشنوند عدد پنهان، نوبت یا قرار را جابه‌جا کرده، همه ابلاغ درست را هم توطئه می‌بینند. برای همین شفافیت فقط خواسته متخصصان نیست؛ ابزار حفظ دادگاه است. شفافیت یعنی شخص بفهمد چه داده‌ای اثر گذاشته، بتواند اعتراض کند، و انسان مسئول جواب بدهد."
			},
			{
				k: "d",
				who: "doctor",
				t: "محرومیت دیجیتال فقط مال روستایی بی‌تلفن نیست. مال سالمند است، مال کسی که سواد خواندن متن حقوقی ندارد، مال کسی که خطِ رابط برای او ناخوانا است. اگر حق اعتراض به تصمیم خودکار را فقط داخل همان سامانه‌ای بگذاریم که شخص را رد کرده، اعتراض را نمایشی کرده‌ایم."
			},
			{
				k: "d",
				who: "soldier",
				t: "از نظر فن، می‌شود توضیح ساده تولید کرد. خطر این است که توضیحِ ساده دروغ باشد؛ جمله‌ای روان که مسیر واقعی مدل نیست. توضیح باید صادق باشد حتی اگر ناقص بگوید «این بخش قابل شرح کامل نیست، پس اینجا انسان تصمیم را باز می‌کند»."
			},
			{
				k: "d",
				who: "doctor",
				t: "همین جمله باید در آیین‌نامه بیاید. ناتوانی از توضیح، مجوز اعتماد بیشتر نیست؛ مجوز محدود کردن اثر ابزار است. عدالت دیجیتال به معنای دادگاهی بدون کاغذ نیست. به معنای دادگاهی است که کاغذ و کد، هیچ‌کدام بهانه بی‌دفاع ماندن کسی نشوند."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"الزام عملی به ابزار دیجیتال، اگر جایگزین نداشته باشد، با اصل ۳۴ اصطکاک دارد.",
					"اعتماد عمومی شکننده است و خطای پنهان آن را یکجا می‌سوزاند.",
					"توضیح نادرستِ ساده، از اعتراف به توضیح‌ناپذیری بدتر است.",
					"حق اعتراض باید بیرون از سامانه خاطی هم ممکن باشد."
				]
			},
			{
				k: "box",
				kind: "gap",
				title: "خلأهای حقوقی",
				items: [
					"نبود تضمین قانونی مسیر غیردیجیتال هم‌عرض برای اعمال مهم.",
					"نبود شاخص علنی برای سنجش محرومیت دیجیتال در خدمات قضایی.",
					"نبود حق مستقل «توضیح قابل فهم» در تصمیمات الگوریتمی بخش عمومی و خصوصیِ مؤثر بر حق."
				]
			},
			{
				k: "box",
				kind: "exec",
				title: "پیشنهاد اجرایی",
				items: [
					"مهلت و باجه انسانی وقتی ابلاغ الکترونیک خوانده‌نشده مانده است.",
					"آزمون سادگی نامه‌های قضایی با حضور کسانی که کاربر حرفه‌ای نیستند.",
					"گزارش سالانه موارد عدم دسترسی، بی‌آنکه امنیت سامانه فدا شود."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "پیشنهاد تقنینی",
				items: [
					"شناسایی حق بر مسیر جایگزین در ابلاغ و دادخواهی.",
					"شناسایی حق اعتراض مؤثر و بازبینی انسانی در تصمیم خودکارِ مؤثر بر حق.",
					"ممنوعیت شرط کردنِ حق، به دسترسی انحصاری به یک سکو خصوصی."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع",
				items: [
					"قانون اساسی، اصول ۱۹، ۲۲، ۲۵ و ۳۴.",
					"قواعد ابلاغ در قوانین آیین دادرسی؛ جزئیات سامانه باید با مقررات روز قوه قضاییه تطبیق شود.",
					"Regulation (EU) 2016/679، ماده ۲۲؛ فقط به‌عنوان مقایسه."
				]
			}
		]
	},
	{
		id: "c13",
		part: "فصل سیزدهم",
		title: "تجربه دیگران، بی‌آنکه الگوی آماده باشد",
		blocks: [
			{
				k: "p",
				t: "محمود پوشه‌ای از خلاصه خبر آورده بود، پر از نام کشور. دکتر پوشه را بست."
			},
			{
				k: "d",
				who: "doctor",
				t: "سرباز، مطالعه تطبیقی اگر به رونویسی برسد خیانت به هر دو سو است. هم به مردمی که قانونشان مالِ زمین دیگری است، هم به ایده‌ای که در زمین خودش معنا داشت. امروز فقط چیزی را برمی‌داریم که سؤال ما را دقیق‌تر کند. قانون آن‌ها را قانون خودمان اعلام نمی‌کنیم."
			},
			{
				k: "d",
				who: "soldier",
				t: "اروپا سامانه قضایی را در مقرره هوش مصنوعی پرخطر کرده: داده و شفافیت و انسان در حلقه. همان اتحادیه برای داده شخصی نهاد ناظر و حقوق صاحب داده دارد. برای دارایی رمزنگاری‌شده، مقرره بازارهای دارایی رمزنگاری‌شده چارچوب انتشار و نظارت ساخته، که باز هم متن آن‌هاست نه ما. انگلستان کد را بیان اراده دانسته. وایومینگ قرارداد هوشمند را در کنار حقوق قرارداد نگه داشته نه به‌جایش."
			},
			{
				k: "d",
				who: "doctor",
				t: "سه درس مشترک هست و یک تفاوت که درس‌ها را محدود می‌کند. درس‌ها: انسان در تصمیمِ سالب حق بماند؛ توضیح و اعتراض ممکن باشد؛ ابزار پیش از ورود به حوزه حساس ارزیابی شود. تفاوت: دادگستری ما زیر قانون اساسی و فقه و قانون مدنی و مجازات اسلامی کار می‌کند، نه زیر منشور اتحادیه. بانک و پرداخت و تحریم و زیرساخت احراز هویت ما شبیه آن کشورها نیست. هر ماده‌ای که از آن‌جا خوشمان آمد باید از این صافی رد شود: آیا با اصول خودمان می‌خواند، آیا قابل اجراست، آیا نهاد مجری داریم."
			},
			{
				k: "d",
				who: "doctor",
				t: "درباره آزمایش‌های کوچک، مثل ایده‌هایی که برای دعاوی کم‌ارزش در استونی مطرح شد، احتیاط می‌کنم. میان اعلام یک طرح و دادگاهِ در حال کار فاصله است. این کتاب طرح را به‌جای واقعیت جا نمی‌زند. جایی هم که انسان حق نقض تصمیم ماشین را برای خود نگه داشته، همان قید مهم‌تر از خودِ آزمایش است."
			},
			{
				k: "d",
				who: "soldier",
				t: "کامپس را هم دوباره کامل بگوییم. هم اریب گزارش شد، هم سازنده روش را رد کرد. درس علمی این است که یک تحقیق، حتی تحقیق مهم، پایان بحث فنی نیست. درس حقوقی این است که تا مناقشه روش باز است، عدد نباید مبنای آزادی انسان باشد."
			},
			{
				k: "d",
				who: "doctor",
				t: "بومی‌سازی یعنی انتخاب سؤال، نه وارد کردن جواب. سؤال قابل حمل است: چه کسی مسئول است، حق دفاع کجاست، داده مال کیست. جواب باید با نهاد موجود نوشته شود. اگر نهاد نداریم، اول نهاد را در قانون بسازیم بعد ابزار را وارد راهرو کنیم. عکس این ترتیب، همان چیزی است که پدر تو با قرارداد تجربه کرد: امضا اول، فهمیدن بعد، وقتی دیگر دیر است."
			},
			{
				k: "box",
				kind: "key",
				title: "نکات کلیدی",
				items: [
					"مقایسه برای دقت سؤال است نه برای اقتباس ماده.",
					"قید نظارت انسانی، قابل‌حمل‌ترین بخش تجربه‌های خارجی است.",
					"اعلام آزمایش با استقرار نظام یکی نیست.",
					"صافی اجرا: اصل قانون اساسی، نهاد مجری، زیرساخت واقعی."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "منابع تطبیقی",
				items: [
					"Regulation (EU) 2024/1689.",
					"Regulation (EU) 2016/679.",
					"Regulation (EU) 2023/1114 (MiCA).",
					"UK Law Commission, Smart Legal Contracts, 2021.",
					"قوانین بلاک‌چین ایالت وایومینگ از ۲۰۱۹؛ بدون ادعای برابری با حقوق ایران.",
					"ProPublica, Machine Bias, 2016، به همراه پاسخ شرکت سازنده."
				]
			}
		]
	},
	{
		id: "c14",
		part: "فصل چهاردهم",
		title: "نقشه راه؛ از راهرو تا ماده قانون",
		blocks: [
			{
				k: "p",
				t: "آخرین نشست را دکتر عمداً بدون پرونده گذاشت. فقط کاغذ سفید. گفت اگر امروز هم به یک داستان پناه ببریم، پیشنهادها پراکنده می‌مانند. محمود ساعت را نگاه نکرد."
			},
			{
				k: "d",
				who: "doctor",
				t: "نقشه را اولویت‌بندی می‌کنم، نه فهرست آرزو. اولویت یعنی چیزی که اگر نباشد خطر فوری است، و چیزی که با نهاد موجود شدنی است. ممنوعیت کلی فناوری در این نقشه نیست. سپردن قضاوت به مدل هم نیست."
			},
			{
				k: "h",
				t: "پله یک. تعریف‌ها"
			},
			{
				k: "d",
				who: "doctor",
				t: "تا وقتی هوش مصنوعی، تصمیم خودکار، قرارداد خوداجرا، رمزپول و رمزدارایی در قانون یا دست‌کم در یک آیین‌نامه روشن تعریف نشوند، هر دادگاهی یک اصطلاح می‌سازد. تعریف، محدودیت دانش نیست؛ شرط گفت‌وگوی دو حرفه است. تعریف‌ها باید کوتاه، لایه‌لایه و قابل اصلاح باشند."
			},
			{
				k: "h",
				t: "پله دو. مسئولیت انسانی"
			},
			{
				k: "d",
				who: "doctor",
				t: "یک ماده اصولی کافی است تا فرهنگ عوض شود: هر تصمیم مؤثر بر جان، آزادی، مال یا حیثیت که با کمک سامانه گرفته می‌شود باید به یک شخص حقیقی یا حقوقی معین قابل انتساب باشد و آن شخص بتواند اساس تصمیم را توضیح دهد. مدل، موضوع این انتساب نیست."
			},
			{
				k: "h",
				t: "پله سه. دادگستری"
			},
			{
				k: "d",
				who: "doctor",
				t: "دستورالعمل داخلی، زودتر از قانون جامع، می‌تواند سه چیز را ممنوع و سه چیز را مجاز کند. ممنوع: رأی خودکار، امتیاز پنهان، خروج داده پرونده. مجاز: جست‌وجوی مستند، کشف نقص، هشدار تعارض در پیش‌نویس انسان. آموزش قضات باید همین سواد انتقادی باشد، نه دوره تبلیغاتی محصول."
			},
			{
				k: "h",
				t: "پله چهار. دلیل و اجرا"
			},
			{
				k: "d",
				who: "soldier",
				t: "استاندارد گزارش کارشناسی برای الگوریتم و برای دفتر زنجیره‌ای را می‌شود با همین کانون کارشناسان شروع کرد، اگر قوه و کانون با هم بنشینند. در اجرا، فرم شناسایی دارایی دیجیتال و روش توقیف نزد سکو را هم می‌شود آیین‌نامه‌ای نوشت تا قانون اجرای احکام اصلاح شود."
			},
			{
				k: "d",
				who: "doctor",
				t: "آیین‌نامه جای قانون را در جرم و مجازات نمی‌گیرد. اصل ۳۶ همان‌جا ایستاده. اما در شیوه اجرا و در شکل گزارش کارشناسی، آیین‌نامه راه را باز می‌کند تا قانون‌گذار با دست پر بنویسد."
			},
			{
				k: "h",
				t: "پله پنج. داده و مردم"
			},
			{
				k: "d",
				who: "doctor",
				t: "قانون حمایت از داده را نباید پشت سامانه‌های قضایی معطل کرد. بیمه و وام و سکو همین حالا تصمیم می‌گیرند. حداقلِ فوری: حق اطلاع، حق اعتراض انسانی، و ممنوعیت داده حساسِ بی‌رضای صریح که روح قانون تجارت الکترونیکی هست و ضمانت اجرایش ضعیف است. مسیر غیردیجیتال برای ابلاغ و دادخواهی هم باید هم‌زمان حفظ شود وگرنه عدالت سریع، عدالت نابرابر است."
			},
			{
				k: "h",
				t: "پله شش. آزمون، نه شتاب"
			},
			{
				k: "d",
				who: "soldier",
				t: "محیط آزمون تنظیم‌گری یعنی یک ابزار، در محدوده کوچک، با معیار شکستِ ازپیش‌معلوم، بدون اینکه شکست به مردم عادی آسیب بزند. اگر معیار شکست نداشته باشیم، آزمون فقط تبلیغ است."
			},
			{
				k: "d",
				who: "doctor",
				t: "می‌پذیرم. شرطش خروج‌ندادن داده واقعیِ غیرضرور و حق خاموش کردن آزمایش است. هیچ آزمایشی مجوز دائمی نمی‌آورد."
			},
			{
				k: "h",
				t: "آنچه در این کتاب نگفتیم که قطعی است"
			},
			{
				k: "d",
				who: "doctor",
				t: "نگفتیم فناوری دشمن است. نگفتیم مدل از قاضی عادل‌تر است. نگفتیم هر خلأ را می‌شود با قیاس پر کرد. گفتیم سؤال‌ها رسیده‌اند، نص در خیلی جاها نرسیده، و تا نص برسد انسان مسئول باید سر جایش بماند. سرباز، اگر یک صفحه از این کتاب بماند، بماند این: ترجمه میان دو زبان کار لطف نیست؛ زیرساخت عدالت است. پدر تو زبان کاغذ را نداشت. نسل بعد ممکن است زبان کد را نداشته باشد. دادگستری اگر ترجمه نکند، فقط تماشاچیِ سلب حق می‌شود."
			},
			{
				k: "d",
				who: "soldier",
				t: "دکتر، من هنوز سرباز دفترم. اما دیگر فکر نمی‌کنم سؤال نابجا باشد."
			},
			{
				k: "d",
				who: "doctor",
				t: "سؤال نابجا نبود. بی‌سؤالی نابجا بود. فردا هم چای را بیاور. اگر نامه تازه‌ای آمد که زبانش را نفهمیدم، همان‌جا می‌ایستی و ترجمه می‌کنی. کتاب که تمام شود، راهرو تمام نمی‌شود."
			},
			{
				k: "box",
				kind: "key",
				title: "اولویت‌های نقشه راه",
				items: [
					"تعریف مفاهیم پایه در متن رسمی قابل اصلاح.",
					"انتساب تصمیم مؤثر به انسان پاسخ‌گو.",
					"دستورالعمل فوری حدود استفاده از ابزار در قوه قضاییه.",
					"استاندارد کارشناسی الگوریتم و دفتر زنجیره‌ای.",
					"آیین اجرای احکام برای دارایی دیجیتال.",
					"حقوق داده و مسیر غیردیجیتال دادخواهی.",
					"محیط آزمون با معیار توقف."
				]
			},
			{
				k: "box",
				kind: "bill",
				title: "بسته تقنینی پیشنهادی",
				items: [
					"موادی در آیین دادرسی: ارزش محدود خروجی الگوریتم و حق اطلاع طرفین.",
					"موادی در مسئولیت مدنی: اماره سببیت فقط برای سامانه پرخطر و مسئولیت نهایی انسانی.",
					"موادی در مجازات: نبود مسئولیت کیفری برای خودِ سامانه و تکلیف مراقبت عرضه‌کننده.",
					"فصل قرارداد خودکار در قانون تجارت الکترونیکی، تابع قواعد عمومی معاملات.",
					"فصل دارایی دیجیتال در اجرای احکام.",
					"قانون حمایت از داده شخصی و تصمیم خودکار."
				]
			},
			{
				k: "box",
				kind: "ask",
				title: "پیش از چاپ رسمی",
				items: [
					"تطبیق دوباره وضعیت مجوز رمزپول و هر آیین‌نامه تازه بانک مرکزی.",
					"تأیید دکتر خوشنویس بر حدود اختیاراتی که در روایت به جایگاه او نسبت داده شده.",
					"حذف یا اصلاح هر خاطره‌ای که محمود یا دکتر نخواهند با همین جزئیات بماند.",
					"افزودن آرای واقعی فقط با ناشناس‌سازی و رضایت صاحب تجربه."
				]
			},
			{
				k: "box",
				kind: "src",
				title: "تکیه‌گاه همین فصل",
				items: [
					"اصول ۳۲، ۳۴، ۳۶ و ۱۶۶ قانون اساسی.",
					"قانون مدنی، قانون مجازات اسلامی، قانون مسئولیت مدنی، قوانین آیین دادرسی و اجرای احکام، قانون تجارت الکترونیکی، قانون بانک مرکزی مصوب ۱۴۰۲.",
					"اسناد تطبیقی ذکرشده در فصل سیزدهم، صرفاً به‌عنوان پرسش نه منبع الزام."
				]
			}
		]
	},
	{
		id: "end",
		part: "سخن آخر",
		title: "راهرو هنوز باز است",
		blocks: [{
			k: "p",
			t: "این کتاب ادعا نمی‌کند آینده عدالت را پیش‌بینی کرده است. ادعا می‌کند آینده، در شکل پرونده و نامه و ابلاغ، همین حالا روی میز است. دکتر خوشنویس نماینده تردید مسئول است و سرباز محمود نماینده کنجکاویِ بی‌ادعای تخصص حقوقی. رابطه آن‌ها از چای و پوشه شروع شد و به پیشنهادی برای قانون رسید. اگر خواننده فقط یک تکلیف از این گفت‌وگو بردارد، این است که پیش از امضای حکم، پیش از امضای کد، و پیش از امضای لایحه، بپرسد تصمیم به کدام انسان برمی‌گردد و آن انسان چگونه جواب می‌دهد."
		}, {
			k: "p",
			t: "بقیه کار، کار راهرو است. راهرو با کتاب عوض نمی‌شود. با آدم‌هایی عوض می‌شود که قبول کنند دو زبان بلد باشند، یا دست‌کم قبول کنند زبان دیگری را تحقیر نکنند."
		}]
	}
];
var bookTitle = "از دادگستری تا دنیای دیجیتال";
var bookSubtitle = "گفت‌وگوی رئیس دادگستری و یک سرباز درباره حقوق، هوش مصنوعی، بلاک‌چین و آینده عدالت در ایران";
var chapters = [
	...front,
	...ch0104,
	...ch0508,
	...ch0914
];
function chapterPlain(ch) {
	return ch.blocks.map((b) => b.k === "box" ? `${b.title} ${b.items.join(" ")}` : b.t).join("\n");
}
function readingMinutes(ch) {
	const words = chapterPlain(ch).trim().split(/\s+/).length;
	return Math.max(3, Math.round(words / 180));
}
var $$splitComponentImporter = () => import("./routes-fP7-BgSI.mjs");
var Route = createFileRoute("/")({
	validateSearch: (search) => {
		const c = typeof search.c === "string" ? search.c : "cover";
		if (c !== "cover" && !chapters.some((ch) => ch.id === c)) return { c: "cover" };
		return { c };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = { IndexRoute: Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { chapterPlain as a, bookTitle as i, Route as n, chapters as o, bookSubtitle as r, readingMinutes as s, router_exports as t };
