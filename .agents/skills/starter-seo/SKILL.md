---
name: starter-seo
description: SEO-слой стартера — title, description, canonical, Open Graph, JSON-LD, robots.txt, sitemap, manifest, llms.txt/markdown-двойники (dualmark), ai.txt, IndexNow, hreflang, 404, H1 и команды валидации. Использовать при правке SEO.astro, Layout.astro, интеграций или метаданных страниц.
---

# SEO-слой

Вся мета-разметка живёт в **одном** месте: `src/components/SEO/SEO.astro`.
Страницы не пишут теги руками — они передают пропсы в `Layout`.

```astro
<Layout
  title="Заголовок"
  description="Описание до 160 символов."
  type="article"
  datePublished={date}
  indexRobots={false}
/>
```

Добавлять `<title>` или `<meta>` в страницу напрямую — ошибка: получится дубль.

## Что генерируется

| Артефакт | Источник | Условие |
|---|---|---|
| `<title>`, `description`, `canonical`, OG, Twitter, JSON-LD, hreflang | `SEO.astro` | всегда (hreflang — если передан `alternates`) |
| `robots.txt` | `integrations/robotsTxt.ts` | всегда |
| `sitemap-index.xml` (+ alternate hreflang в записях) | `@astrojs/sitemap` | всегда |
| `llms.txt`, markdown-двойники (`/index.md`, `/en.md`, …) | `@dualmark/astro` (`astro.config.mjs`) | `llms.txt` — `features.llms`; двойники — всегда |
| `ai.txt` | `integrations/aiTxt.ts` | `features.ai` |
| `site.webmanifest` | `integrations/webManifest.ts` | `features.manifest` |
| `<key>.txt` | `integrations/indexNow.ts` | `indexNow.enabled` |

## Правила

- **Один `<h1>` на страницу.** Заголовок страницы, а не логотип.
- **Canonical** — абсолютный, со слэшем на конце. Считается автоматически.
- **404** обязан быть `indexRobots={false}`. Он же исключается из `llms.txt`.
- **hreflang** — проп `alternates` у `Layout`/`SEO`, собирается `buildAlternates()`
  из `src/i18n` (см. `starter-i18n`). Страницы без переключения локали (как 404)
  проп не передают.
- **OG-картинка** — 1200×630, файл в `public/`. Наличие проверяется на билде.
- **title** до ~60 символов, **description** до ~160. Валидатор предупреждает.
- **JSON-LD** — через `schema-dts`, типизированно. `type="article"` даёт
  `BlogPosting`, иначе `WebPage`. Отдельная зависимость для этого не нужна:
  тег пишется инлайном через `set:html={JSON.stringify(schemaItem)}`.

## llms.txt и markdown-двойники: dualmark

Раньше `llms.txt` собирался из отрендеренного HTML собственной интеграцией.
Теперь это `@dualmark/astro`, подключённый в `astro.config.mjs` — он же генерирует
markdown-двойник для каждой статической страницы (`/index.md`, `/en.md`, …).

Это меняет модель: `llms.txt` и список двойников **не выводятся автоматически**
из `src/pages/` — их нужно перечислить явно:

- `dualmarkStaticPages` в `astro.config.mjs` — по одной записи `{ pattern, render }`
  на страницу-двойник. `render` **обязан** вернуть строковый литерал через
  `new Function(\`return ${JSON.stringify(markdown)};\`)`, а не стрелочную функцию —
  пакет сериализует `render.toString()` в отдельный модуль уже после того, как
  `astro.config.mjs` прошёл через Vite, и обычные замыкания/`import()` там ломают
  сборку. Сам markdown собирается в `src/integrations/dualmarkPages.ts`
  (`buildIndexMarkdown`).
- `llmsTxt.sections` там же — `{ title, links: [{ title, href, description }] }`.
  Не собирается из `staticPages` автоматически.
- Появится первая content collection — замапить её в `dualmark({ collections })`
  (см. `starter-architecture` про Content Layer) — тогда её записи попадут
  в `llms.txt` и получат двойники сами.

Путь двойника **не всегда** `<route>/index.md`: для `/` это `/index.md`, но для
`/en/` — `/en.md` (проверено сборкой, не из документации пакета — она неполна).
Проверять фактический путь через `bun run build && ls dist/*.md`, не угадывать.

На статическом выводе (`output: "static"`) собственный middleware пакета
(`injectLinkHeader`) не выполняется в проде — поэтому он выключен
(`middleware.injectLinkHeader: false`), а alternate-ссылка на markdown отдаётся
тегом `<link rel="alternate" type="text/markdown">` через проп `markdownURL` у
`Layout`/`SEO`.

`noindex`-страницы (`indexRobots={false}`) в `llms.txt` не попадают — они и не
добавляются в `dualmarkStaticPages`/`sections` (так сделано для `404.astro`).

## Команды

```bash
bun run check       # astro check — типы
bun run check:seo   # build + проверка dist/
bun run verify      # lint + check + check:seo
```

`scripts/validate-seo.mjs` проверяет по каждой странице `dist/`:
`<title>`, description, canonical, OG-набор, валидность JSON-LD, `<html lang>`,
количество `<h1>`, `noindex` на 404, наличие `robots.txt` и sitemap, и главное —
**что все локальные ассеты из разметки реально существуют в `dist/`**.
Последняя проверка ловит битые пути к OG-картинке и фавиконам.

Ошибка = ненулевой код выхода. Предупреждение = только вывод.
