import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import dualmark from "@dualmark/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import { config } from "./main.config";
import { assertValidConfig } from "./src/config/validate";
import en from "./src/i18n/locales/en";
import ru from "./src/i18n/locales/ru";
import aiTxt from "./src/integrations/aiTxt";
import { buildIndexMarkdown } from "./src/integrations/dualmarkPages";
import indexNow from "./src/integrations/indexNow";
import robotsTxt from "./src/integrations/robotsTxt";
import stripComments from "./src/integrations/stripComments";
import webManifest from "./src/integrations/webManifest";

const publicDir = fileURLToPath(new URL("./public", import.meta.url));

// Падаем на старте dev/build, а не на проде
assertValidConfig(config, { publicDir });

const site = new URL(config.site.url);
const { features, indexNow: indexNowConfig, i18n } = config;
const { og } = config.site;

/** Данные о сайте для ai.txt. */
const siteMeta = {
	site,
	siteName: og.siteName,
	description: og.description,
	locale: og.locale,
};

// Дефолтная локаль без префикса в URL (`prefixDefaultLocale: false` ниже) -
// `/`, а не `/ru/`. Остальные локали получают `/<locale>/`.
const localePath = (locale) =>
	locale === i18n.defaultLocale ? "/" : `/${locale}/`;

const localeDicts = { ru, en };

// Markdown-двойник для `staticPages` обязан быть строковым литералом - см.
// комментарий в `src/integrations/dualmarkPages.ts`.
const dualmarkStaticPages = i18n.locales.map((locale) => {
	const dict = localeDicts[locale];

	return {
		pattern: localePath(locale),
		render: new Function(
			`return ${JSON.stringify(
				buildIndexMarkdown({
					siteUrl: config.site.url,
					locale,
					title: dict["meta.title"],
					description: dict["meta.description"],
					localePath: localePath(locale),
				}),
			)};`,
		),
	};
});

export default defineConfig({
	site: config.site.url,

	i18n: {
		locales: i18n.locales,
		defaultLocale: i18n.defaultLocale,
		routing: {
			prefixDefaultLocale: false,
		},
	},

	prefetch: {
		defaultStrategy: "viewport",
		prefetchAll: true,
	},

	// Inter - единственный шрифт сайта (--font-inter → --font-sans в
	// tailwind.css). Каталог собирает проекты о татарах, башкирах и
	// крымских татарах, поэтому cyrillic-ext обязателен: в нем лежат
	// татарские Әә Өө Үү Җҗ Ңң Һһ и башкирские Ғғ Ҙҙ Ҡҡ Ҫҫ - без этого
	// подсета браузер покажет tofu вместо этих букв.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Inter",
			cssVariable: "--font-inter",
			weights: ["100 900"],
			styles: ["normal", "italic"],
			subsets: ["cyrillic", "cyrillic-ext", "latin"],
			fallbacks: [
				"ui-sans-serif",
				"system-ui",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji",
			],
		},
	],

	// Логотипы карточек иногда приходят в виде SVG - растеризуем их наравне
	// с остальными форматами, чтобы `<Image>` мог сгенерировать webp-миниатюры.
	image: {
		dangerouslyProcessSVG: true,
	},

	vite: {
		plugins: [tailwindcss()],
		ssr: {
			// Иначе Vite пытается забандлить пакеты, рассчитанные на выполнение
			// в Node на этапе конфигурации, а не на прохождение через сборщик.
			external: ["@dualmark/astro", "@dualmark/core", "@dualmark/converters"],
		},
	},

	devToolbar: {
		enabled: false,
	},

	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: i18n.defaultLocale,
				locales: Object.fromEntries(
					i18n.locales.map((locale) => [locale, locale]),
				),
			},
		}),
		icon({ include: {} }),
		pagefind(),

		// Каждая интеграция получает конфигурацию явно, аргументами.
		// Артефакты генерируются на `astro:build:done` → смотреть в `dist/`.
		robotsTxt({ site, aiPolicy: features.ai, llms: features.llms }),

		...(features.ai ? [aiTxt({ ...siteMeta, llms: features.llms })] : []),

		// Markdown-двойники страниц + llms.txt. Коллекций контента пока нет -
		// `collections` не указан; когда появится первая, добавить маппинг сюда.
		dualmark({
			siteUrl: config.site.url.replace(/\/$/, ""),
			staticPages: dualmarkStaticPages,
			llmsTxt: {
				enabled: features.llms,
				brandName: og.siteName,
				description: og.description,
				// `sections` не собираются автоматически из `staticPages` -
				// перечислять руками. Появятся коллекции - добавить туда же.
				sections: [
					{
						title: "Pages",
						links: i18n.locales.map((locale) => ({
							title: localeDicts[locale]["meta.title"],
							href: new URL(localePath(locale), site).href,
							description: localeDicts[locale]["meta.description"],
						})),
					},
				],
			},
			// output: "static" - рантайм-middleware пакета не выполняется на
			// проде, alternate на markdown отдается тегом в SEO.astro.
			middleware: { injectLinkHeader: false },
		}),

		...(features.manifest
			? [
					webManifest({
						name: og.siteName,
						description: og.description,
						locale: og.locale,
						themeColor: config.site.theme.colors.theme,
						backgroundColor: config.site.theme.colors.background,
					}),
				]
			: []),

		...(indexNowConfig.enabled
			? [
					indexNow({
						site,
						key: indexNowConfig.key,
						dryRun: indexNowConfig.dryRun ?? false,
					}),
				]
			: []),

		// Последней в списке: чистит уже готовый `dist/`, поэтому должна
		// отработать после всех, кто в него пишет.
		stripComments(),
	],

	output: "static",
});
