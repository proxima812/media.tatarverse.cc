# Astro Starter

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
![Astro](https://img.shields.io/badge/Astro-7-black?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-ready-F9F1E1?logo=bun&logoColor=111111)

Основа для SEO-ориентированных статических сайтов: лендинги, корпоративные
страницы, контентные проекты.

Идея простая: вся конфигурация проекта - в одном файле, все опциональные
возможности честно включаются и выключаются, а сборка проверяет себя сама.

## Быстрый старт

```bash
bun install
bun dev
```

Новый проект:

1. клонировать репозиторий;
2. заменить значения в [`main.config.ts`](./main.config.ts);
3. положить свои `public/favicon.svg` и OG-картинку;
4. добавить страницы в `src/pages/` (и словари в `src/i18n/locales/`, если локалей
   больше одной);
5. `bun run verify` и деплой.

## Конфигурация

Правится **только** [`main.config.ts`](./main.config.ts) - там URL сайта, название,
локаль, Open Graph, цвета темы, подтверждения владения доменом, аналитика и
feature flags.

- контракт и типы - `src/config/types.ts`;
- проверки - `src/config/validate.ts`.

Конфигурация проверяется на старте `dev` и `build`: некорректный URL, неверный
формат GTM ID, отсутствующая OG-картинка, короткий ключ IndexNow - сборка падает
сразу и перечисляет все проблемы разом.

Часть некорректных состояний не выражается в типах: включить аналитику без ID или
IndexNow без ключа не даст TypeScript.

## Возможности

| Фича | Конфиг | Что появляется в `dist/` |
|---|---|---|
| SEO-метатеги, Open Graph, JSON-LD | всегда | теги в `<head>` каждой страницы |
| `robots.txt` | всегда | `robots.txt` |
| Sitemap | всегда | `sitemap-index.xml`, `sitemap-0.xml` |
| Favicon pipeline | всегда | `favicon.*`, `apple-touch-icon.png` |
| Web App Manifest | `features.manifest` | `site.webmanifest` + `<link rel="manifest">` |
| `ai.txt` | `features.ai` | `ai.txt` + строка в `robots.txt` |
| `llms.txt` + markdown-двойники страниц | `features.llms` | `llms.txt`, `/index.md`, `/en.md`, строка в `robots.txt` |
| IndexNow | `indexNow.enabled` | `<key>.txt` + отправка измененных URL |
| Google Tag Manager | `analytics.googleTagManager` | скрипт GTM |
| Yandex Metrika | `analytics.yandexMetrika` | скрипт счетчика |
| i18n | `i18n.locales` | маршруты по локалям, hreflang, sitemap с alternate-ссылками |

Выключенная фича не оставляет ничего: ни файла, ни тега, ни ссылки на себя
из `robots.txt`.

По умолчанию все опциональное выключено.

### i18n

Роутинг - нативный i18n Astro, без пакетов. Дефолтная локаль (`i18n.defaultLocale`
в `main.config.ts`) не получает префикс в URL: `/`, а не `/ru/`. Остальные локали -
`/en/`. Словари строк - `src/i18n/locales/<locale>.ts`, доступ через
`useTranslations(locale)` из `src/i18n`. hreflang-ссылки (включая `x-default`) и
sitemap с alternate-записями собираются автоматически из `i18n.locales`.

Добавить локаль - три места: `i18n.locales` в `main.config.ts`, новый файл в
`src/i18n/locales/`, страница в `src/pages/<locale>/`.

### llms.txt и markdown-двойники

Генерирует [`@dualmark/astro`](https://dualmark.dev/docs/integrations/astro):
каждая статическая страница из `staticPages` (в `astro.config.mjs`) получает
markdown-версию (`/index.md`, `/en.md`), а `llms.txt` собирается из явно заданных
`sections` - не парсится из HTML и не обновляется сам при добавлении страницы,
как было раньше. Появилась новая статическая страница - добавить ее в
`dualmarkStaticPages` и в `llmsTxt.sections` в `astro.config.mjs`. Появится первая
content collection - замапить ее в `dualmark({ collections })` там же.

Alternate-ссылка на markdown отдается тегом `<link rel="alternate" type="text/markdown">`
в `<head>` (проп `markdownURL` у `Layout`/`SEO`), не HTTP-заголовком: сайт
статический, рантайм-middleware пакета на проде не выполняется.

### IndexNow

Файл верификации `/<key>.txt` стартер создает сам - руками класть его в `public/`
не нужно. Ключ получают на [bing.com/indexnow/getstarted](https://www.bing.com/indexnow/getstarted).

Чтобы прогнать пайплайн без реальной отправки: `{ enabled: true, key: "...", dryRun: true }`.

## Команды

```bash
bun dev             # дев-сервер
bun run build       # сборка в dist/
bun run preview     # локальный просмотр собранного
bun run lint        # biome check . - линт и порядок импортов
bun run lint:fix    # biome check --write .
bun run format      # biome format --write .
bun run check       # astro check - типы
bun run check:seo   # build + проверка dist/
bun run verify      # lint + check + check:seo
```

`bun run check:seo` проверяет каждую страницу сборки: `<title>`, description,
canonical, набор Open Graph, валидность JSON-LD, `<html lang>`, количество `<h1>`,
`noindex` на 404 - и что все локальные ссылки на ассеты действительно
существуют в `dist/`.

Фавиконы генерируются из `public/favicon.svg` перед `bun dev`
(или вручную: `bun run generate:favicons`).

## Структура

```
main.config.ts            значения проекта - единственный файл под правку
astro.config.mjs          сборка интеграций, i18n-роутинг, dualmark
biome.json                линт и форматирование (bun run lint)
src/
  config/                 контракт конфигурации и ее валидация
  i18n/                   локали, словари, useTranslations/buildAlternates
  integrations/           генерация robots.txt, ai.txt, manifest, IndexNow, dualmark-двойники
  components/SEO/         метатеги, JSON-LD, аналитика
  layouts/Layout.astro    каркас страницы
  pages/                  маршруты (en/ - вторая локаль)
  styles/tailwind.css     тема и семантические токены
scripts/                  favicon pipeline, SEO-валидатор
```

Артефакты интеграций генерируются на этапе `astro:build:done`, поэтому в
`astro dev` их нет - смотреть после `bun run build`.

## Деплой

`output: "static"` - подходит любой статический хостинг: Vercel, Cloudflare Pages,
Netlify, nginx. Команда сборки `bun run build`, каталог `dist`.
Адаптер не подключен; он нужен только при переходе на SSR.

## Работа с AI-агентами

Правила репозитория - в [`AGENTS.md`](./AGENTS.md), специализированные скиллы -
в `.agents/skills/starter-*/`. Они едут вместе с репозиторием, поэтому клон сразу
получает контекст: архитектуру, правила фич, SEO, Tailwind, TypeScript и
definition of done.
