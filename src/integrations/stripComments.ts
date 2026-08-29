/**
 * Вычистка комментариев из готовой сборки.
 *
 * Комментарии в исходниках нужны - они объясняют решения тем, кто будет
 * править код. Посетителю сайта они не нужны: это лишние байты и рассказ
 * о том, как устроен проект, в открытом виде.
 *
 * Разделение проходит по границе сборки, а не по исходникам: `src/` и dev
 * остаются с комментариями, вычищается только то, что уезжает в `dist/`.
 *
 * Скрипты, которые Astro собирает сам (`<script>` без `is:inline`), уже
 * приходят минифицированными - у них комментариев нет. Остаются два места:
 * HTML-комментарии из разметки и тело `is:inline` скриптов, которые Astro
 * отдает как есть.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { transform } from "esbuild";

const HTML_COMMENT = /<!--[\s\S]*?-->/g;

/**
 * Содержимое `<script>` и `<style>` - сырой текст, а не разметка: `<!--`
 * внутри них может быть частью строки или регулярного выражения. Поэтому
 * они вырезаются из потока до того, как по нему пройдет `HTML_COMMENT`.
 */
const RAW_TEXT_ELEMENT = /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi;

const HAS_TYPE = /\stype\s*=/i;
const JS_TYPE = /\stype\s*=\s*["']?(module|text\/javascript|application\/javascript)["']?/i;

/**
 * `<script>` без `type` или с JS-типом - это код. Все остальное
 * (`application/ld+json`, шаблоны) отдается как есть: там нет комментариев,
 * а разбор такого тела как JavaScript только сломает его.
 */
const isScriptCode = (attrs: string): boolean =>
	!HAS_TYPE.test(attrs) || JS_TYPE.test(attrs);

/**
 * Только пробелы и комментарии: имена и синтаксис не трогаем. Скрипт может
 * объявлять что-то в глобальной области, и переименование сломало бы
 * обращение к нему из другого скрипта на той же странице.
 */
async function stripScriptComments(
	code: string,
	logger: AstroIntegrationLogger,
): Promise<string> {
	// Нечего вычищать - не трогаем: собранные Astro скрипты уже прошли
	// минификацию, и повторный разбор им ничего не дает.
	if (!code.includes("//") && !code.includes("/*")) return code;

	try {
		const result = await transform(code, {
			loader: "js",
			minifyWhitespace: true,
			legalComments: "none",
			charset: "utf8",
		});

		return result.code.trimEnd();
	} catch (error) {
		// Разобрать скрипт не вышло - оставляем как есть: комментарий в
		// разметке безобиднее сломанного кода на странице.
		logger.warn(`скрипт не разобран, оставлен без изменений: ${error}`);
		return code;
	}
}

export async function stripCommentsFromHtml(
	html: string,
	logger: AstroIntegrationLogger,
): Promise<string> {
	const parts: string[] = [];
	let cursor = 0;

	for (const match of html.matchAll(RAW_TEXT_ELEMENT)) {
		const [full, tag, attrs, body] = match;
		if (attrs === undefined || body === undefined) continue;

		parts.push(html.slice(cursor, match.index).replace(HTML_COMMENT, ""));
		cursor = match.index + full.length;

		if (tag?.toLowerCase() === "script" && isScriptCode(attrs) && body.trim()) {
			parts.push(`<script${attrs}>${await stripScriptComments(body, logger)}</script>`);
		} else {
			parts.push(full);
		}
	}

	parts.push(html.slice(cursor).replace(HTML_COMMENT, ""));

	return parts.join("");
}

async function* htmlFiles(dir: string): AsyncGenerator<string> {
	for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) yield* htmlFiles(full);
		else if (entry.name.endsWith(".html")) yield full;
	}
}

export default function stripComments(): AstroIntegration {
	return {
		name: "starter:strip-comments",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				let touched = 0;
				let saved = 0;

				for await (const file of htmlFiles(fileURLToPath(dir))) {
					const html = await fs.readFile(file, "utf-8");
					const cleaned = await stripCommentsFromHtml(html, logger);
					if (cleaned === html) continue;

					await fs.writeFile(file, cleaned, "utf-8");
					touched += 1;
					saved += html.length - cleaned.length;
				}

				logger.info(
					`комментарии вычищены: ${touched} страниц, -${Math.round(saved / 1024)} КБ`,
				);
			},
		},
	};
}
