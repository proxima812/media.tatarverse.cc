import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const distDir = path.resolve(process.cwd(), "dist");

const errors = [];
const warnings = [];

const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

async function exists(target) {
	try {
		await stat(target);
		return true;
	} catch {
		return false;
	}
}

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });

	const nested = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) return walk(fullPath);
			if (entry.isFile()) return [fullPath];

			return [];
		}),
	);

	return nested.flat();
}

const attr = (html, selector) => html.match(selector)?.[1]?.trim();

const metaContent = (html, name) =>
	attr(
		html,
		new RegExp(
			`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`,
			"i",
		),
	) ??
	attr(
		html,
		new RegExp(
			`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${name}"`,
			"i",
		),
	);

/** Локальные ссылки на ассеты должны существовать в dist/ */
function collectLocalAssets(html) {
	const urls = new Set();

	for (const match of html.matchAll(
		/<(?:link|meta)[^>]+(?:href|content)="([^"]+)"/gi,
	)) {
		urls.add(match[1]);
	}

	return [...urls];
}

async function validatePage(filePath) {
	const rel = path.relative(distDir, filePath);
	const raw = await readFile(filePath, "utf-8");
	// Закомментированная разметка не должна попадать в проверки
	const html = raw.replace(/<!--[\s\S]*?-->/g, "");
	const is404 = rel === "404.html";

	const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
	if (!title) fail(rel, "missing <title>");
	else if (title.length > 60)
		warn(rel, `<title> is ${title.length} chars (>60)`);

	const description = metaContent(html, "description");
	if (!description) fail(rel, "missing meta description");
	else if (description.length > 160)
		warn(rel, `meta description is ${description.length} chars (>160)`);

	if (!attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)) {
		fail(rel, "missing canonical link");
	}

	for (const property of [
		"og:title",
		"og:description",
		"og:image",
		"og:url",
		"og:type",
	]) {
		if (!metaContent(html, property)) fail(rel, `missing ${property}`);
	}

	if (!/<script[^>]+type="application\/ld\+json"/i.test(html)) {
		fail(rel, "missing JSON-LD structured data");
	} else {
		for (const match of html.matchAll(
			/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
		)) {
			try {
				JSON.parse(match[1]);
			} catch {
				fail(rel, "JSON-LD is not valid JSON");
			}
		}
	}

	const robots = metaContent(html, "robots");
	if (is404 && robots && !robots.includes("noindex")) {
		warn(rel, "404 page is indexable (expected noindex)");
	}

	if (!/<html[^>]+lang="[^"]+"/i.test(html)) fail(rel, "missing <html lang>");

	const h1Count = [...html.matchAll(/<h1[\s>]/gi)].length;
	if (h1Count === 0) warn(rel, "no <h1> on page");
	else if (h1Count > 1) warn(rel, `${h1Count} <h1> elements (expected 1)`);

	// Ссылки на локальные файлы должны реально существовать в сборке
	for (const url of collectLocalAssets(html)) {
		let pathname = url;

		if (/^https?:\/\//i.test(url)) {
			const parsed = new URL(url);
			pathname = parsed.pathname;
		} else if (!url.startsWith("/")) {
			continue;
		}

		if (!path.extname(pathname)) continue;
		if (pathname.endsWith(".html")) continue;

		const target = path.join(distDir, pathname);
		if (!(await exists(target))) {
			fail(rel, `references missing asset ${pathname}`);
		}
	}
}

if (!(await exists(distDir))) {
	console.error("[seo] dist/ not found - run `bun run build` first");
	process.exit(1);
}

const files = await walk(distDir);
const pages = files.filter((file) => file.endsWith(".html"));

if (!pages.length) {
	console.error("[seo] no HTML pages found in dist/");
	process.exit(1);
}

for (const page of pages) {
	await validatePage(page);
}

for (const required of ["robots.txt", "sitemap-index.xml"]) {
	if (!(await exists(path.join(distDir, required)))) {
		fail(required, "not generated");
	}
}

for (const message of warnings) console.warn(`  warn  ${message}`);
for (const message of errors) console.error(`  error ${message}`);

console.log(
	`\n[seo] ${pages.length} page(s) checked - ${errors.length} error(s), ${warnings.length} warning(s)`,
);

process.exit(errors.length ? 1 : 0);
