/**
 * Минимальный i18n-слой стартера: список локалей приходит из `main.config.ts`,
 * словари - из `src/i18n/locales/*.ts`. В отличие от проектов с частичным
 * переводом контента, здесь предполагается, что каждая локаль покрывает все
 * маршруты - иначе `useTranslations` тихо покажет ключ вместо текста.
 */
import { getRelativeLocaleUrl } from "astro:i18n";
import { config } from "main.config";
import type { LocaleCode } from "@/config/types";
import type { Dictionary } from "@/i18n/dictionary";
import en from "@/i18n/locales/en";
import ru from "@/i18n/locales/ru";

export const locales = config.i18n.locales;
export const defaultLocale = config.i18n.defaultLocale;

const dictionaries: Record<LocaleCode, Dictionary> = { ru, en };

export function isLocale(
	value: string | null | undefined,
): value is LocaleCode {
	return Boolean(value) && locales.includes(value as LocaleCode);
}

/** Локаль текущего маршрута по первому сегменту пути, иначе дефолтная. */
export function getLocaleFromUrl(url: URL): LocaleCode {
	const segment = url.pathname.split("/").filter(Boolean)[0];
	return isLocale(segment) ? segment : defaultLocale;
}

export function useTranslations(locale: LocaleCode) {
	const dict = dictionaries[locale] ?? dictionaries[defaultLocale];

	return (key: string) => dict?.[key] ?? key;
}

/** Путь без локального префикса: `/en/projects/foo` → `projects/foo`. */
export function stripLocalePrefix(pathname: string): string {
	const segments = pathname.split("/").filter(Boolean);
	return isLocale(segments[0])
		? segments.slice(1).join("/")
		: segments.join("/");
}

/**
 * hreflang-альтернативы для `<SEO alternates>`: по одной ссылке на каждую
 * локаль плюс `x-default` на дефолтную. `pathname` - без учета текущей
 * локали в префиксе (например `/about`, а не `/en/about`).
 */
export function buildAlternates(
	pathname: string,
): Array<{ hreflang: string; href: string }> {
	const relativePath = stripLocalePrefix(pathname);

	const links = locales.map((locale) => ({
		hreflang: locale,
		href: getRelativeLocaleUrl(locale, relativePath),
	}));

	return [
		...links,
		{
			hreflang: "x-default",
			href: getRelativeLocaleUrl(defaultLocale, relativePath),
		},
	];
}

/**
 * Форма слова под число: к ключу добавляется категория `Intl.PluralRules`
 * (`stats.projects` + `few` → `stats.projects.few`). Категории зависят от
 * языка - в русском их четыре, в английском две, - поэтому склонения лежат
 * в словарях, а не в коде компонента. Нет нужной формы - берется `.other`.
 */
export function usePlural(locale: LocaleCode) {
	const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
	const rules = new Intl.PluralRules(locale);

	return (key: string, count: number) =>
		dict?.[`${key}.${rules.select(count)}`] ?? dict?.[`${key}.other`] ?? key;
}
