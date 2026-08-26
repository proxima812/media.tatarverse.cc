---
name: starter-mdx
description: Статические Markdown/MDX-страницы стартера (юридические и прочие текстовые страницы) — content collection в src/content.config.ts, слой i18n по образцу cards/cards-en, layout src/layouts/MDX.astro. Использовать при добавлении или правке страниц из src/data/markdown*/, а также перед тем как класть .md/.mdx в src/pages/.
---

# Markdown/MDX-страницы

Речь не о карточках каталога (`starter-architecture` → Content Layer, `cards`/`cardsEn`)
и не о переводе UI (`starter-i18n`) — это отдельный, третий вид контента:
цельные текстовые страницы (политика конфиденциальности, условия использования,
источники, «О проекте», «Добавить проект» и т.п.), которых мало и которые
меняются редко.

## Почему не «файл в `src/pages/`»

Astro умеет превращать `.md`/`.mdx` прямо в `src/pages/` в страницу через
фронтматтер-проп `layout` ([Individual Markdown pages](https://docs.astro.build/en/guides/markdown-content/#individual-markdown-pages)).
В этом стартере так делать **нельзя**:

- `layout` в фронтматтере — это относительный путь до компонента, который
  получает `Astro.props.frontmatter` без всякой валидации. `starter-typescript`
  требует типизированные данные, а не что попало из YAML.
- Такая страница не проходит через обычный `Layout.astro` → `SEO.astro`
  осознанно: `title`/`description`/`alternates`/`htmlLang` пришлось бы либо
  дублировать в каждом файле, либо протаскивать самодельным способом. `starter-seo`
  прямо запрещает мета-теги в обход `SEO.astro`.
- `layout` во фронтматтере **не поддерживается** content collections (см. доку
  выше — «is not a special property when using content collections») и
  отсутствует единый источник переводимых заголовков/описаний.

Правильный путь — **content collection** + свой layout-компонент (не через
фронтматтер, а через `<Layout>` как везде в проекте) + `render()`.

## Устройство

Тот же паттерн, что у `cards`/`cardsEn` (`starter-architecture`): исходный текст —
русский, перевод — отдельная зеркальная коллекция, id файлов совпадают.

```
src/data/markdown/       pages        (ru, источник истины)
src/data/markdown-en/    pagesEn      (en, перевод)
```

`src/content.config.ts`:

```ts
const pages = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/markdown/" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedDate: z.coerce.date(),
	}),
});

const pagesEn = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/markdown-en/" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedDate: z.coerce.date(),
	}),
});
```

В отличие от `cardsEn` (которая хранит только переводимые *поля* и никогда не
рендерит собственное тело — `CardDetail.astro` читает `facts`, а не markdown-текст),
`pagesEn` — **полноценная** зеркальная коллекция: у каждой записи своё, целиком
переведённое тело документа. Слияние `{...ru.data, ...en.data}`, которым
`localizeCards` докладывает перевод поверх русской карточки, здесь не подходит —
оно подменяет только фронтматтер, а `body`/рендер остаются от русской записи.
Для полнотекстовых страниц на английской версии просто читают `pagesEn`
напрямую, без слияния с `pages`.

## Страница

```astro
---
import { getEntry, render } from "astro:content";
import MDXLayout from "@/layouts/MDX.astro";

const entry = await getEntry("pages", "privacy");
if (!entry) throw new Error("pages/privacy отсутствует в коллекции");

const { Content } = await render(entry);
---

<MDXLayout locale="ru" {...entry.data}>
	<Content />
</MDXLayout>
```

На `/en/privacy` — то же самое, но `getEntry("pagesEn", "privacy")` и `locale="en"`.
Обе версии обязаны существовать: коллекция без `loader` — не наш случай, а вот
запись без перевода здесь **не** заменяется русским текстом молча (в отличие от
`localizeCards`) — постройте страницу, только когда перевод готов.

## `src/layouts/MDX.astro`

Тонкая обёртка вокруг `Layout.astro` — тот же `Header`/`Footer`, тот же
`buildAlternates`, ничего своего в `<head>` (см. `starter-seo`: мета-теги — только
через `SEO.astro`). Пропы — уже провалидированные Zod'ом поля коллекции
(`title`, `description`, `updatedDate`) плюс `locale`, а не сырой `frontmatter`.
Контент приходит через `<slot />`, как и everywhere else в `Layout.astro` —
не через переданный компонентом проп: Astro-компонент как проп технически
работает, но `<slot />` — это то, как уже устроен `Layout.astro`, и лишний
паттерн рядом добавлять незачем.

Типографика — существующий Tailwind `@plugin "@tailwindcss/typography"`
(см. `starter-tailwind`), классы `prose prose-*:` инлайном на обёртке, как уже
делалось раньше в этом файле. Отдельный CSS-файл не нужен.

## `.md` или `.mdx`

`@astrojs/mdx` в `astro.config.mjs` подключён, но текст этих страниц — обычная
проза без интерактивности, поэтому файлы — `.md`. `.mdx` берут, только когда
тексту нужны настоящие компоненты внутри (`import Foo from "@/components/Foo.astro"`
и `<Foo />` посреди абзацев) — обычный Markdown этого не умеет. Не переключать
формат «про запас»: раздутый `.mdx` без единого импортированного компонента —
то же самое, что пустая content collection без loader'а — выглядит как рабочий
код, а функциональности не даёт.

## Частые ошибки (из документации Astro, реально ловятся при правке)

- `compiledContent()` — **асинхронная** функция начиная с Astro 5 (не относится
  к `render()`/`<Content />` из content collections — тот путь и так всегда
  асинхронный; актуально только при прямом `import * as post from "../file.md"`,
  которого в этом слое нет и заводить не нужно).
- Фронтматтер не прошёл Zod-схему коллекции — билд падает на `content.config.ts`
  с понятной ошибкой; частая причина — `updatedDate` не в ISO/`YYYY-MM-DD`
  (`z.coerce.date()` требует парсибельную строку).
- `getEntry()` возвращает `undefined`, если файла с таким `id` нет — `render()`
  на `undefined` упадёт с невнятной ошибкой; проверять и бросать понятное
  исключение до `render()`, как в примере выше.

## Проверка

```bash
bun run build
ls dist/privacy/ dist/terms/ dist/sources/ dist/about/ dist/add/ dist/en/privacy/   # маршруты собрались
bun run check      # Zod-схемы коллекций + типы
bun run check:seo  # title/description/canonical на новых страницах
```
