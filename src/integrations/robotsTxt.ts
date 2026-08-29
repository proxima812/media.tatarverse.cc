import type { AstroIntegration } from "astro";
import { emitFile } from "./shared/dist";

export interface RobotsTxtOptions {
	/** Базовый URL сайта. */
	readonly site: URL;
	/** Правила краулинга. По умолчанию - открыть весь сайт. */
	readonly rules?: string;
	/** Добавить строку со ссылкой на `/ai.txt`. */
	readonly aiPolicy?: boolean;
	/** Добавить строку со ссылкой на `/llms.txt`. */
	readonly llms?: boolean;
}

const DEFAULT_RULES = "User-agent: *\nAllow: /";

export function renderRobotsTxt(options: RobotsTxtOptions): string {
	const {
		site,
		rules = DEFAULT_RULES,
		aiPolicy = false,
		llms = false,
	} = options;

	const lines = [
		rules,
		"",
		`Sitemap: ${new URL("sitemap-index.xml", site).href}`,
	];

	// Ссылаемся только на то, что действительно сгенерировано
	if (aiPolicy) lines.push(`AI usage policy: ${new URL("ai.txt", site).href}`);
	if (llms) lines.push(`LLMs: ${new URL("llms.txt", site).href}`);

	return `${lines.join("\n")}\n`;
}

export default function robotsTxt(options: RobotsTxtOptions): AstroIntegration {
	return {
		name: "starter:robots-txt",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const file = await emitFile(
					dir,
					"robots.txt",
					renderRobotsTxt(options),
				);
				logger.info(`${file} создан`);
			},
		},
	};
}
