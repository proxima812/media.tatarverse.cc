/**
 * Типы конфигурации стартера.
 *
 * Значения живут в `main.config.ts` — это единственный файл, который правят
 * под новый проект. Здесь только контракт.
 *
 * Принцип: невалидное состояние должно быть невыразимо в типах.
 * Поэтому фичи, которым нужны креды (analytics, IndexNow), описаны
 * discriminated union'ами — включить их без ID/ключа нельзя.
 */

/** Абсолютный URL сайта с завершающим слэшем: `https://example.com/` */
export type SiteUrl = `https://${string}/`;

/** BCP-47 локаль: `ru-KZ`, `en-US` */
export type Locale = `${string}-${string}`;

/**
 * Короткий код маршрутизации i18n: `ru`, `en`. Не путать с {@link Locale} —
 * тот полный BCP-47 для `site.language`/`og.locale`, этот — сегмент URL и
 * ключ словаря в `src/i18n/locales/`.
 */
export type LocaleCode = string;

/** HEX-цвет: `#0f172a` */
export type HexColor = `#${string}`;

/** Container ID Google Tag Manager: `GTM-XXXXXXX` */
export type GtmId = `GTM-${string}`;

/** Ключ IndexNow: 8–128 символов `[A-Za-z0-9-]` */
export type IndexNowKey = string;

export type SeoPageType = "website" | "article";
export type SeoKeywords = string | string[];
export type TwitterCard = "summary" | "summary_large_image";

/**
 * Фичи, которым не нужны дополнительные данные — только вкл/выкл.
 * Всё, что требует ключей, вынесено в отдельные union-блоки ниже.
 */
export interface FeatureFlags {
	/** `/site.webmanifest` + `<link rel="manifest">` */
	readonly manifest: boolean;
	/** `/ai.txt` + `<link rel="alternate">` + строка в `robots.txt` */
	readonly ai: boolean;
	/** `/llms.txt` + `<link rel="alternate">` + строка в `robots.txt` */
	readonly llms: boolean;
}

/** Провайдер аналитики: включённый вариант обязан нести свой ID. */
export type AnalyticsProvider<TId> =
	| { readonly enabled: false }
	| { readonly enabled: true; readonly id: TId };

export type GoogleTagManagerConfig = AnalyticsProvider<GtmId>;
export type YandexMetrikaConfig = AnalyticsProvider<number>;

export interface AnalyticsConfig {
	readonly googleTagManager: GoogleTagManagerConfig;
	readonly yandexMetrika: YandexMetrikaConfig;
}

/**
 * IndexNow. Включённый вариант обязан нести ключ — стартер сам отдаст
 * `/<key>.txt` для верификации, руками файл создавать не нужно.
 *
 * Ключ получают тут: https://www.bing.com/indexnow/getstarted
 */
export type IndexNowConfig =
	| { readonly enabled: false }
	| {
			readonly enabled: true;
			readonly key: IndexNowKey;
			/** Собрать список и залогировать, но ничего не отправлять. */
			readonly dryRun?: boolean;
	  };

/**
 * Маршрутизация i18n. `defaultLocale` обязан входить в `locales`.
 * Дефолтная локаль не получает префикс в URL (`prefixDefaultLocale: false` в
 * `astro.config.mjs`) — `/about`, а не `/ru/about`; остальные — `/en/about`.
 */
export interface I18nConfig {
	readonly defaultLocale: LocaleCode;
	readonly locales: readonly LocaleCode[];
}

/** Мета-тег подтверждения владения доменом. */
export interface SiteVerification {
	readonly name: string;
	readonly content: string;
}

export interface OpenGraphConfig {
	readonly title: string;
	readonly description: string;
	readonly author: string;
	readonly locale: Locale;
	readonly siteName: string;
	/** Путь внутри `public/`. Наличие файла проверяется на билде. */
	readonly defaultImage: string;
	readonly imageAlt: string;
	readonly keywords: SeoKeywords;
	readonly titleSeparator: string;
	readonly twitterCard: TwitterCard;
	readonly twitterSite: string;
	readonly twitterCreator: string;
	readonly organizationName: string;
	/** Путь внутри `public/` либо пустая строка. */
	readonly logo: string;
}

export interface ThemeColors {
	readonly maskIcon: HexColor;
	readonly tile: HexColor;
	readonly theme: HexColor;
	readonly background: HexColor;
}

export interface SiteConfig {
	readonly url: SiteUrl;
	readonly language: Locale;
	readonly og: OpenGraphConfig;
	readonly theme: { readonly colors: ThemeColors };
	readonly verifications: readonly SiteVerification[];
	readonly analytics: AnalyticsConfig;
}

export interface AppConfig {
	readonly features: FeatureFlags;
	readonly indexNow: IndexNowConfig;
	readonly i18n: I18nConfig;
	readonly site: SiteConfig;
}
