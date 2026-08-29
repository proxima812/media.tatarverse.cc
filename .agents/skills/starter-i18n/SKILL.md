---
name: starter-i18n
description: Роутинг локалей стартера - main.config.ts → astro.config.mjs, src/i18n/ (словари, useTranslations, buildAlternates), hreflang, как добавить новую локаль. Использовать при правке i18n, src/i18n/**, src/pages/<locale>/** или мультиязычных страниц.
---

# i18n

Нативный роутинг Astro, без сторонних i18n-пакетов. Источник истины - `i18n`
в `main.config.ts`:

```ts
i18n: {
	defaultLocale: "ru",
	locales: ["ru", "en"],
},
```

`astro.config.mjs` читает его в `i18n: { locales, defaultLocale, routing }` и
в `sitemap({ i18n })` - конфигурация не дублируется вручную.

## Роутинг без префикса у дефолтной локали

`routing.prefixDefaultLocale: false` - `defaultLocale` живет без префикса
(`/`, `/about`), остальные локали - с префиксом (`/en/`, `/en/about`).
Дефолтная локаль остается на «родных» URL, если i18n добавляют в уже
существующий проект - маршруты не переезжают.

Страница `src/pages/404.astro` **не** локализуется: статический хостинг отдает
один `dist/404.html` независимо от префикса пути.

## `src/i18n/`

| Файл | Назначение |
|---|---|
| `dictionary.ts` | Тип `Dictionary = Record<string, string>` - вынесен отдельно от `index.ts`, чтобы `locales/*.ts` не создавали циклический импорт. |
| `locales/<locale>.ts` | Словарь одной локали, `satisfies Dictionary`. Ключи одинаковые во всех локалях. |
| `index.ts` | `locales`, `defaultLocale` (реэкспорт из `main.config`), `isLocale()`, `getLocaleFromUrl(url)`, `useTranslations(locale)`, `buildAlternates(pathname)`. |

```astro
---
import { useTranslations, buildAlternates } from "@/i18n";

const t = useTranslations("en");
---
<Layout title={t("meta.title")} alternates={buildAlternates(Astro.url.pathname)}>
	<h1>{t("home.heading")}</h1>
</Layout>
```

`useTranslations` тихо показывает ключ вместо текста, если его нет в словаре -
частичное покрытие переводов не поддерживается: каждая локаль обязана
покрывать все маршруты, где она подключена.

## hreflang

`buildAlternates(pathname)` возвращает ссылку на каждую локаль из `i18n.locales`
плюс `x-default` на дефолтную. Прокидывается пропом `alternates` в `Layout`/`SEO`
(см. `starter-seo`) - рендерится как `<link rel="alternate" hreflang href>`.
Страницы без переключения локали (404) проп не передают.

## Добавить новую локаль

Три места, в этом порядке:

1. `main.config.ts` - добавить код в `i18n.locales` (`LOCALE_CODE` в
   `src/config/validate.ts` матчит `ru`, `en-US` - 2-3 буквы, опциональный регион).
2. `src/i18n/locales/<code>.ts` - новый словарь с теми же ключами, что у
   остальных локалей. `src/i18n/index.ts` подключает словари по имени в
   `dictionaries` - забытый файл упадет на `useTranslations` тихим фолбэком на
   дефолтную локаль, а не ошибкой сборки.
3. `src/pages/<code>/` - страницы новой локали (или `src/pages/` без префикса,
   если это стала новая дефолтная локаль).

Также добавить локаль в `localeDicts` в `astro.config.mjs`, если у нее есть
собственная markdown-страница в `dualmarkStaticPages`/`llmsTxt.sections`
(см. `starter-seo`).

## Проверка

```bash
bun run build
ls dist/en/                                    # локализованный маршрут собрался
grep -o 'hreflang="[^"]*"' dist/index.html      # ru, en, x-default
cat dist/sitemap-0.xml                          # alternate-записи в sitemap
```

Испортить `i18n.defaultLocale` (значение не из `i18n.locales`) - `assertValidConfig`
должен упасть с понятным сообщением.
