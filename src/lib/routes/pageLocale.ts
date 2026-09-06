import { config } from "main.config";
import type { LocaleCode } from "@/config/types";

/**
 * Локаль страницы. Приходит пропом в модули из `src/components/pages/`: тело
 * страницы написано один раз, а маршруты `src/pages/X.astro` и
 * `src/pages/en/X.astro` - две тонкие обертки, каждая со своей локалью.
 *
 * Русские адреса живут в корне (`prefixDefaultLocale: false` в
 * `astro.config.mjs`), поэтому пары маршрутов нельзя заменить одним
 * `[locale]`-маршрутом: он дал бы `/ru/saved` вместо `/saved`.
 */
export type PageLocale = LocaleCode;

/**
 * Значение og:locale. Русские страницы до слияния маршрутов не передавали
 * `locale` вовсе, и `SEO.astro` подставлял `config.site.og.locale` - здесь
 * возвращается ровно оно же, поэтому разметка не меняется.
 */
export function ogLocale(locale: PageLocale): string {
	return locale === "en" ? "en-US" : config.site.og.locale;
}
