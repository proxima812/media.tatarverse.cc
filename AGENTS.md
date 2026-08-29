# media.tatarverse.cc - правила для агентов

Подробности вынесены в скиллы - `.agents/skills/starter-*/SKILL.md`.
Здесь только то, что действует всегда.

## О проекте

Каталог карточек: авторы, каналы, медиа и другие проекты, которые ведут татары,
башкиры и крымские татары - языковые проекты, уроки, графика (орнаменты,
татарские и не только узоры) и все, что рассказывает об этих народах.

Open source: новые карточки добавляются через: 
- github; 
- заполняя форму: yandex, google; 
- либо же напрямую по просьбе человека, автора.


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

## Карточки и перевод на EN

Русский текст в `src/data/cards/<id>.md` (`name`, `description`, `facts`) -
источник истины. Перевод живет отдельно, в `src/data/cards-en/<id>.md`
(тот же id, схема - `name`/`description`/`facts`, без `url`/`logo`/`tags`/
`peoples`: они не зависят от языка и берутся из русского файла). Слияние -
`src/components/Catalog/localize.ts`, вызывается на `/en/`-страницах.

- **Новая карточка добавляется сразу с EN-переводом.** `bun run check:i18n`
  (часть `verify`) падает, если у id нет файла в `cards-en/` и его нет в
  `scripts/cards-i18n-baseline.json`.
- `cards-i18n-baseline.json` - список карточек без перевода, заведенных до
  этого правила. Список только сокращается по мере перевода - не добавлять
  туда новые id, чтобы обойти проверку.
- Нет перевода - карточка на `/en/` показывается на русском (полезнее, чем
  падающая страница), но для новых карточек это состояние запрещено линтом.

## Всегда

- **Никаких «е» и длинных тире.** В любом тексте - код, комментарии, контент
  карточек, коммиты, ответы в чате - только «е» вместо «е» и обычный дефис `-`
  вместо `-`, `-`, `-`, `-`. Правило страхует хук
  `scripts/hooks/no-yo-dash.mjs` (см. `.claude/settings.json`): он блокирует запись
  файла, если находит эти символы.

- **Tailwind v4, семантические токены.** Vanilla CSS - только если Tailwind не может.
  `tailwind.config.js` не создавать.

## Safety rules репозитория

- Не затирать брендовые ассеты в `public/`.
- Не расширять `files.includes` в `biome.json` на `public/` и
  `src/components/SEO/Analytics/**` без крайней необходимости: Biome
  переформатирует SVG в `public/` (уже ловили на `favicon.svg`) и не парсит
  инлайн-`<script>` с обычным JS в `.astro` (падает с ошибкой парсинга на
  `GoogleTagManager.astro`/`YandexMetrika.astro`) - поддержка `.astro` в Biome
  экспериментальная.
- Не подставлять в `main.config.ts` значения чужого проекта. Дефолты - нейтральные
  и выключенные.
- Не добавлять UI-фреймворки (React/Vue/Solid) без конкретной задачи.
- Не возвращать удаленные зависимости - список и причины в `starter-dependencies`.
- Тестовые правки конфига откатывать: стартер отдается со всеми фичами выключенными.

## Команды

```bash
bun install
bun dev
bun run lint        # biome check .
bun run check       # типы
bun run build
bun run check:seo   # build + проверка dist/
bun run check:i18n  # у всех новых карточек есть EN-перевод
bun run verify      # все сразу (lint + check + check:seo + check:i18n)
```
