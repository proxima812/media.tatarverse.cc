---
name: starter-architecture
description: Архитектура Astro-стартера - где лежит конфигурация, как устроен поток данных, когда писать страницу, а когда интеграцию, границы build-time и runtime. Использовать перед любой правкой astro.config.mjs, main.config.ts, src/config/** или src/integrations/**.
---

# Архитектура стартера

Astro 7, статическая сборка (`output: "static"`), Tailwind v4, TypeScript strict, Bun.

## Поток данных - запомнить в первую очередь

```
main.config.ts                 значения (единственный файл под правку)
  └─ src/config/types.ts       контракт: невалидное состояние невыразимо
  └─ src/config/validate.ts    fail-fast на старте dev/build
       │
       ├─→ astro.config.mjs    передает конфиг интеграциям ЯВНО, аргументами
       │     ├─ src/integrations/*      генерируют файлы в dist/
       │     ├─ i18n / sitemap          нативный роутинг Astro + @astrojs/sitemap i18n
       │     └─ dualmark                markdown-двойники + llms.txt (staticPages)
       │
       ├─→ src/i18n/            локали, словари, useTranslations/buildAlternates
       │
       └─→ src/layouts/Layout.astro → src/components/SEO/SEO.astro  (теги в <head>)
```

Все, что видно в браузере, приходит из двух мест: `Layout.astro` (HTML) и
`src/integrations/*` (сгенерированные файлы). Больше конфигурацию никто не читает.

## Файлы

| Путь | Ответственность |
|---|---|
| `main.config.ts` | Значения проекта. Единственное, что правят под новый сайт. |
| `src/config/types.ts` | Контракт конфигурации. Типы, а не значения. |
| `src/config/validate.ts` | Проверки, которые не выражаются типами (формат, наличие файлов). |
| `astro.config.mjs` | Сборка интеграций. Читает `config`, раздает аргументы. Нативный i18n-роутинг, `@astrojs/sitemap` с i18n, `dualmark` (markdown-двойники, `llms.txt`). |
| `src/integrations/*.ts` | Генерация артефактов в `dist/`. |
| `src/integrations/shared/dist.ts` | Запись в `dist/` (`emitFile`, `distFileExists`). |
| `src/integrations/dualmarkPages.ts` | Markdown-двойники статических страниц для `dualmark`. |
| `src/integrations/stripComments.ts` | Вычистка HTML-комментариев и комментариев `is:inline`-скриптов из `dist/` после сборки. |
| `src/content.config.ts` | Content Layer: коллекции `cards`/`cardsEn`, `pages`/`pagesEn` (см. ниже). |
| `src/i18n/` | `locales/*.ts` - словари; `index.ts` - `useTranslations`, `getLocaleFromUrl`, `buildAlternates`. |
| `src/layouts/Layout.astro` | Каркас страницы, `<head>`, аналитика. |
| `src/components/SEO/SEO.astro` | Все мета-теги и JSON-LD. |
| `scripts/validate-seo.mjs` | Постбилд-проверка `dist/`. |

## Страница или интеграция?

**Страница** (`src/pages/*.astro`, `src/pages/*.ts`) - если маршрут существует всегда
и его содержимое зависит от запроса/параметров.

**Интеграция** (`src/integrations/*.ts`) - если артефакт:

- условный (зависит от feature flag) - страницу нельзя «не создать»;
- собирается из результата сборки (нужны все страницы разом);
- это не HTML-страница, а служебный файл.

Так сделаны `robots.txt`, `ai.txt`, `site.webmanifest` и ключ IndexNow.
`llms.txt` и markdown-двойники - исключение: их генерирует сторонний пакет
`@dualmark/astro` прямо из `astro.config.mjs`, а не `src/integrations/*.ts`
(см. `starter-seo`).

## Правила для интеграций

1. **Конфигурация приходит аргументами.** Интеграция не импортирует `main.config.ts`.
2. **Никакого module-level mutable state.** Все живет в замыкании фабрики.
3. **Генерация - на `astro:build:done`.** Через `emitFile()` из `shared/dist.ts`.
4. **Никакого `injectRoute` для конфигурируемых артефактов.**
   Astro грузит injected route отдельным инстансом модуля через Vite: состояние,
   записанное в `astro:config:setup`, до роут-модуля **не доходит**. Опции молча
   теряются. Это уже ломалось - не возвращать этот паттерн.
5. **Не зависеть от порядка интеграций.** Читать `dist/`, а не выхлоп соседа.

Шаблон:

```ts
export interface FooOptions {
  readonly site: URL;
  readonly title: string;
}

export function renderFoo(options: FooOptions): string { /* чистая функция */ }

export default function foo(options: FooOptions): AstroIntegration {
  return {
    name: "starter:foo",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const file = await emitFile(dir, "foo.txt", renderFoo(options));
        logger.info(`${file} создан`);
      },
    },
  };
}
```

Рендер вынесен в чистую функцию - ее можно вызвать и проверить без сборки.

## Build-time и runtime

- `astro.config.mjs`, `src/config/validate.ts`, `src/integrations/**` - **только Node**,
  выполняются на сборке. `node:fs` здесь разрешен.
- `src/components/**`, `src/layouts/**` - фронтматтер выполняется на сборке,
  результат - статический HTML. Браузерного JS по умолчанию нет.
- Клиентский код - только в `<script>` внутри `.astro`. Сейчас такой код есть
  лишь в аналитике.

Следствие: артефакты с `astro:build:done` **отсутствуют в `astro dev`**.
Проверять их через `bun run build && bun run preview`, а не через `bun dev`.

## Content Layer

Коллекции живут в `src/content.config.ts`, все с настоящим `glob`-loader'ом
(коллекция без `loader` - legacy-режим, не создавать). Сейчас их четыре:

| Коллекция | Источник | Что это |
|---|---|---|
| `cards` | `src/data/cards/` | Карточки каталога (ru, источник истины). |
| `cardsEn` | `src/data/cards-en/` | Перевод карточек: **только переводимые поля** (`name`, `description`, `facts`). `localizeCards` в `src/components/Catalog/localize.ts` докладывает их поверх русской карточки; нет файла с тем же id - карточка на `/en/` остается русской. |
| `pages` | `src/data/markdown/` | Цельные текстовые страницы (ru). |
| `pagesEn` | `src/data/markdown-en/` | Полноценная зеркальная коллекция с целиком переведенным телом - слияние как у `cardsEn` тут не подходит (см. `starter-mdx`). |

Русский текст - источник истины: id файла в переводной коллекции обязан
совпадать с id в исходной.

## Astro 7

- Node >= 22.12.
- `output: "static"`. Адаптер не подключен - стартер разворачивается как статика.
- View Transitions - это `<ClientRouter />` из `astro:transitions`. Его **нет** в
  `Layout.astro`. Событие `astro:page-load` без него не срабатывает: если код
  на него завязан, нужен явный фолбэк (так сделано в `YandexMetrika.astro`).
- Алиас `@/*` → `src/*`. `main.config` резолвится через `baseUrl`.
