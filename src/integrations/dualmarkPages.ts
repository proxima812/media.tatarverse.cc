import type { LocaleCode } from "../config/types";

/**
 * Markdown-двойники статических страниц для `@dualmark/astro` (`staticPages`).
 *
 * `render` в конфиге пакета обязан вернуть готовый строковый литерал, а не
 * выполнять импорты или замыкания: пакет сериализует функцию через
 * `render.toString()` в отдельный модуль уже после того, как `astro.config.mjs`
 * прошел через Vite - замыкания и `import()` внутри теряются и роняют сборку.
 * Поэтому текст собирается здесь, обычным Node, на этапе чтения конфига,
 * а в `astro.config.mjs` оборачивается в
 * `new Function(\`return ${JSON.stringify(markdown)};\`)`.
 */

export interface IndexMarkdownOptions {
	readonly siteUrl: string;
	readonly locale: LocaleCode;
	readonly title: string;
	readonly description: string;
	/** Абсолютный путь другой локали для перелинковки, например `/en/`. */
	readonly localePath: string;
}

export function buildIndexMarkdown(options: IndexMarkdownOptions): string {
	const { siteUrl, title, description, localePath } = options;
	const base = siteUrl.replace(/\/$/, "");

	return `# ${title}

> ${description}

- **URL**: ${base}${localePath}
- **Config**: \`main.config.ts\`

## Machine-readable

- [/llms.txt](${base}/llms.txt)
- [/sitemap-index.xml](${base}/sitemap-index.xml)
`;
}
