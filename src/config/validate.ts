/**
 * Fail-fast проверка конфигурации на старте dev/build.
 *
 * Здесь только то, что нельзя выразить типами: формат строк, существование
 * файлов, диапазоны значений. Всё остальное ловит TypeScript в `types.ts`.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import type { AppConfig } from "./types";

const LOCALE = /^[a-z]{2,3}-[A-Z]{2}$/;
const LOCALE_CODE = /^[a-z]{2,3}(-[A-Z]{2})?$/;
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const GTM_ID = /^GTM-[A-Z0-9]{4,}$/i;
const INDEXNOW_KEY = /^[A-Za-z0-9-]{8,128}$/;

export interface ValidateOptions {
	/** Абсолютный путь к `public/` — для проверки наличия ассетов. */
	readonly publicDir: string;
}

export function validateConfig(
	config: AppConfig,
	options: ValidateOptions,
): string[] {
	const errors: string[] = [];
	const { site, indexNow, features, i18n } = config;

	const assetExists = (relativePath: string) =>
		existsSync(path.join(options.publicDir, relativePath.replace(/^\/+/, "")));

	// ── site ──────────────────────────────────────────────────────────
	let parsedUrl: URL | null = null;

	try {
		parsedUrl = new URL(site.url);
	} catch {
		errors.push(`site.url — невалидный URL: ${JSON.stringify(site.url)}`);
	}

	if (parsedUrl) {
		if (parsedUrl.protocol !== "https:") {
			errors.push(
				`site.url — должен быть https, получен ${parsedUrl.protocol}`,
			);
		}
		if (!site.url.endsWith("/")) {
			errors.push("site.url — должен заканчиваться слэшем");
		}
	}

	if (!LOCALE.test(site.language)) {
		errors.push(
			`site.language — ожидается BCP-47 (ru-KZ), получено ${site.language}`,
		);
	}

	if (!LOCALE.test(site.og.locale)) {
		errors.push(
			`site.og.locale — ожидается BCP-47 (ru-KZ), получено ${site.og.locale}`,
		);
	}

	// ── Open Graph ────────────────────────────────────────────────────
	if (!site.og.title.trim())
		errors.push("site.og.title — не должен быть пустым");
	if (!site.og.description.trim())
		errors.push("site.og.description — не должен быть пустым");

	if (!site.og.defaultImage.trim()) {
		errors.push("site.og.defaultImage — не должен быть пустым");
	} else if (!assetExists(site.og.defaultImage)) {
		errors.push(
			`site.og.defaultImage — файл public/${site.og.defaultImage} не найден`,
		);
	}

	if (site.og.logo && !assetExists(site.og.logo)) {
		errors.push(`site.og.logo — файл public/${site.og.logo} не найден`);
	}

	// ── Тема ──────────────────────────────────────────────────────────
	for (const [name, value] of Object.entries(site.theme.colors)) {
		if (!HEX_COLOR.test(value)) {
			errors.push(`site.theme.colors.${name} — невалидный HEX: ${value}`);
		}
	}

	// ── Верификации ───────────────────────────────────────────────────
	for (const verification of site.verifications) {
		if (verification.content && !verification.name.trim()) {
			errors.push("site.verifications — есть запись с content, но без name");
		}
	}

	// ── Аналитика ─────────────────────────────────────────────────────
	const { googleTagManager, yandexMetrika } = site.analytics;

	if (googleTagManager.enabled && !GTM_ID.test(googleTagManager.id)) {
		errors.push(
			`analytics.googleTagManager.id — ожидается GTM-XXXXXXX, получено ${googleTagManager.id}`,
		);
	}

	if (yandexMetrika.enabled) {
		const { id } = yandexMetrika;
		if (!Number.isInteger(id) || id <= 0) {
			errors.push(
				`analytics.yandexMetrika.id — ожидается положительное целое, получено ${id}`,
			);
		}
	}

	// ── IndexNow ──────────────────────────────────────────────────────
	if (indexNow.enabled && !INDEXNOW_KEY.test(indexNow.key)) {
		errors.push("indexNow.key — ожидается 8–128 символов [A-Za-z0-9-]");
	}

	// ── i18n ──────────────────────────────────────────────────────────
	if (!i18n.locales.length) {
		errors.push("i18n.locales — не должен быть пустым");
	}

	for (const locale of i18n.locales) {
		if (!LOCALE_CODE.test(locale)) {
			errors.push(`i18n.locales — невалидный код: ${JSON.stringify(locale)}`);
		}
	}

	if (new Set(i18n.locales).size !== i18n.locales.length) {
		errors.push("i18n.locales — есть повторяющиеся коды");
	}

	if (!i18n.locales.includes(i18n.defaultLocale)) {
		errors.push(
			`i18n.defaultLocale — ${JSON.stringify(i18n.defaultLocale)} отсутствует в i18n.locales`,
		);
	}

	// ── Связность фич ─────────────────────────────────────────────────
	if (features.manifest && !assetExists("favicon.svg")) {
		errors.push(
			"features.manifest — включён, но public/favicon.svg отсутствует",
		);
	}

	return errors;
}

/** Бросает агрегированную ошибку, если конфигурация невалидна. */
export function assertValidConfig(
	config: AppConfig,
	options: ValidateOptions,
): void {
	const errors = validateConfig(config, options);

	if (errors.length) {
		throw new Error(
			`Некорректный main.config.ts:\n${errors.map((error) => `  • ${error}`).join("\n")}`,
		);
	}
}
