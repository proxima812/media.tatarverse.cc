import type { AstroIntegration } from "astro";
import { emitFile } from "./shared/dist";

export interface AiTxtOptions {
	readonly site: URL;
	readonly siteName: string;
	readonly description: string;
	readonly locale: string;
	/** Разрешён ли доступ AI-краулеров. */
	readonly access?: "allowed" | "disallowed";
	/** Пункты политики. Задан — полностью заменяет значения по умолчанию. */
	readonly policy?: readonly string[];
	/** Добавить ссылку на `/llms.txt`. */
	readonly llms?: boolean;
}

const DEFAULT_POLICY = [
	"- Public pages may be accessed and indexed.",
	"- Public content may be summarized with attribution.",
	"- Prefer canonical URLs when referencing pages.",
	"- Do not imply authorship, endorsement, or partnership.",
	"- Do not present transformed content as the official source.",
] as const;

export function renderAiTxt(options: AiTxtOptions): string {
	const {
		site,
		siteName,
		description,
		locale,
		access = "allowed",
		policy = DEFAULT_POLICY,
		llms = false,
	} = options;

	return [
		`Site: ${siteName}`,
		`URL: ${site.href}`,
		`Description: ${description}`,
		`Language: ${locale}`,
		"",
		`AI-Access: ${access}`,
		"AI-Policy:",
		...policy,
		"",
		...(llms ? [`LLMs: ${new URL("llms.txt", site).href}`] : []),
		`Sitemap: ${new URL("sitemap-index.xml", site).href}`,
		"",
	].join("\n");
}

export default function aiTxt(options: AiTxtOptions): AstroIntegration {
	return {
		name: "starter:ai-txt",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const file = await emitFile(dir, "ai.txt", renderAiTxt(options));
				logger.info(`${file} создан`);
			},
		},
	};
}
