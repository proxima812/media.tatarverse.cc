# Astro Starter — правила для агентов

Это **стартер**, а не конкретный сайт. Его клонируют под новые проекты.
Любое изменение оценивать вопросом: «станет ли следующий проект на этой базе проще?»

Подробности вынесены в скиллы — `.agents/skills/starter-*/SKILL.md`.
Здесь только то, что действует всегда.

## Скиллы

| Скилл | Когда читать |
|---|---|
| `starter-architecture` | правки `astro.config.mjs`, `main.config.ts`, `src/config/**`, `src/integrations/**` |
| `starter-feature-development` | добавление или изменение фичи с feature flag |
| `starter-seo` | мета-теги, `SEO.astro`, `robots.txt`, `llms.txt`/markdown-двойники (dualmark), `ai.txt`, sitemap |
| `starter-i18n` | роутинг локалей, `src/i18n/**`, добавление новой локали |
| `starter-tailwind` | любые классы, стили, цвета |
| `starter-typescript` | любые `.ts` и фронтматтер `.astro` |
| `starter-code-style` | проектирование модулей, рефакторинг, review |
| `starter-dependencies` | перед `bun add` и при обновлении пакетов |
| `starter-validation` | перед тем, как считать задачу выполненной |

## Всегда

- **Конфигурация — в `main.config.ts`.** Это единственный файл, который правят под
  новый проект. Не разносить настройки по компонентам.
- **`enabled: false` = фичи нет.** Ни маршрута, ни файла в `dist/`, ни тега в HTML.
  Половинчатое состояние — баг.
- **Зависимости передавать явно.** Интеграция получает конфиг аргументами,
  а не импортирует `main.config.ts`.
- **Никакого module-level mutable state** в интеграциях.
- **Tailwind v4, семантические токены.** Vanilla CSS — только если Tailwind не может.
  `tailwind.config.js` не создавать.
- **Проверять `dist/`, а не намерения.** `bun run verify` перед сдачей.

## Safety rules репозитория

- Не затирать брендовые ассеты в `public/`.
- Не расширять `files.includes` в `biome.json` на `public/` и
  `src/components/SEO/Analytics/**` без крайней необходимости: Biome
  переформатирует SVG в `public/` (уже ловили на `favicon.svg`) и не парсит
  инлайн-`<script>` с обычным JS в `.astro` (падает с ошибкой парсинга на
  `GoogleTagManager.astro`/`YandexMetrika.astro`) — поддержка `.astro` в Biome
  экспериментальная.
- Не подставлять в `main.config.ts` значения чужого проекта. Дефолты — нейтральные
  и выключенные.
- Не добавлять UI-фреймворки (React/Vue/Solid) без конкретной задачи.
- Не возвращать удалённые зависимости — список и причины в `starter-dependencies`.
- Тестовые правки конфига откатывать: стартер отдаётся со всеми фичами выключенными.

## Команды

```bash
bun install
bun dev
bun run lint        # biome check .
bun run check       # типы
bun run build
bun run check:seo   # build + проверка dist/
bun run verify      # всё сразу (lint + check + check:seo)
```
