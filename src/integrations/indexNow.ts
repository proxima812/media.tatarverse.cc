import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { distFileExists, emitFile } from "./shared/dist";

export interface IndexNowOptions {
	readonly site: URL;
	/** Ключ IndexNow: 8-128 символов `[A-Za-z0-9-]`. */
	readonly key: string;
	/** Собрать и залогировать список, но не отправлять. */
	readonly dryRun?: boolean;
	/** Верхняя граница URL в одной отправке. */
	readonly maxUrls?: number;
}

const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;
const ENDPOINT = "https://api.indexnow.org/indexnow";

type Cache = Record<string, string>;

const hash = (contents: Buffer | string) =>
	crypto.createHash("sha1").update(contents).digest("hex");

const extractLocs = (xml: string) =>
	[...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)]
		.map((match) => match[1]?.trim())
		.filter((loc): loc is string => Boolean(loc));

const isSubmittable = (url: string) => {
	const { pathname } = new URL(url);

	return !(
		pathname.includes("/404") ||
		pathname.includes("/500") ||
		pathname.endsWith(".xml") ||
		pathname.endsWith(".txt")
	);
};

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
	try {
		return JSON.parse(await fs.readFile(filePath, "utf-8")) as T;
	} catch {
		return fallback;
	}
}

/** Собирает список URL из sitemap-index либо одиночного sitemap. */
async function readSitemapUrls(outDir: string): Promise<string[]> {
	for (const candidate of ["sitemap-index.xml", "sitemap.xml"]) {
		const fullPath = path.join(outDir, candidate);

		let contents: string;
		try {
			contents = await fs.readFile(fullPath, "utf-8");
		} catch {
			continue;
		}

		if (!contents.includes("<sitemapindex")) return extractLocs(contents);

		const nested = await Promise.all(
			extractLocs(contents).map(async (loc) => {
				const child = path.join(outDir, path.basename(new URL(loc).pathname));

				try {
					return extractLocs(await fs.readFile(child, "utf-8"));
				} catch {
					return [];
				}
			}),
		);

		return nested.flat();
	}

	return [];
}

/** Хеш собранной HTML-страницы, соответствующей URL. */
async function hashPage(url: string, outDir: string): Promise<string | null> {
	const { pathname } = new URL(url);
	const file = path.join(
		outDir,
		pathname === "/" ? "index.html" : pathname,
		"index.html",
	);
	const normalized = pathname === "/" ? path.join(outDir, "index.html") : file;

	try {
		return hash(await fs.readFile(normalized));
	} catch {
		return null;
	}
}

export default function indexNow(options: IndexNowOptions): AstroIntegration {
	// Ключ проверяем сразу: лучше упасть на конфиге, чем молча не проиндексироваться
	if (!KEY_PATTERN.test(options.key)) {
		throw new Error(
			`[indexnow] Некорректный ключ: ожидается 8-128 символов [A-Za-z0-9-], получено ${JSON.stringify(options.key)}`,
		);
	}

	const keyFile = `${options.key}.txt`;
	let cacheFile = "";

	return {
		name: "starter:indexnow",
		hooks: {
			"astro:config:setup": ({ config }) => {
				// Кеш держим вне dist - он не должен уезжать на прод
				cacheFile = path.join(fileURLToPath(config.cacheDir), "indexnow.json");
			},

			"astro:build:done": async ({ dir, logger }) => {
				const outDir = fileURLToPath(dir);

				// Файл верификации: стартер отдает его сам, руками создавать не нужно
				if (await distFileExists(dir, keyFile)) {
					logger.warn(`${keyFile} уже существует - оставляю как есть`);
				} else {
					await emitFile(dir, keyFile, `${options.key}\n`);
					logger.info(`${keyFile} создан (верификация IndexNow)`);
				}

				const urls = (await readSitemapUrls(outDir)).filter(isSubmittable);

				if (!urls.length) {
					logger.warn("sitemap пуст - отправлять нечего");
					return;
				}

				const previous = await readJson<Cache>(cacheFile, {});
				const next: Cache = {};
				const changed: string[] = [];

				for (const url of urls) {
					const pageHash = await hashPage(url, outDir);
					if (!pageHash) continue;

					next[url] = pageHash;
					if (previous[url] !== pageHash) changed.push(url);
				}

				await fs.mkdir(path.dirname(cacheFile), { recursive: true });
				await fs.writeFile(cacheFile, JSON.stringify(next, null, 2), "utf-8");

				if (!changed.length) {
					logger.info("изменений нет");
					return;
				}

				const urlList = changed.slice(0, options.maxUrls ?? 10_000);

				if (options.dryRun) {
					logger.info(`dryRun: изменилось ${urlList.length} URL`);
					return;
				}

				try {
					const response = await fetch(ENDPOINT, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							host: options.site.host,
							key: options.key,
							keyLocation: new URL(keyFile, options.site).href,
							urlList,
						}),
					});

					if (!response.ok) {
						logger.warn(`запрос не прошел: ${response.status}`);
						return;
					}

					logger.info(`отправлено ${urlList.length} URL`);
				} catch (error) {
					logger.warn(
						`сетевая ошибка: ${error instanceof Error ? error.message : error}`,
					);
				}
			},
		},
	};
}
