import type { AstroIntegration } from "astro";
import { emitFile } from "./shared/dist";

export interface WebManifestOptions {
	readonly name: string;
	readonly description: string;
	readonly locale: string;
	readonly themeColor: string;
	readonly backgroundColor: string;
}

export function renderWebManifest(options: WebManifestOptions): string {
	return JSON.stringify(
		{
			name: options.name,
			short_name: options.name,
			description: options.description,
			lang: options.locale,
			start_url: "/",
			scope: "/",
			display: "standalone",
			background_color: options.backgroundColor,
			theme_color: options.themeColor,
			icons: [
				{
					src: "/favicon.svg",
					sizes: "any",
					type: "image/svg+xml",
					purpose: "any",
				},
				{
					src: "/apple-touch-icon.png",
					sizes: "180x180",
					type: "image/png",
					purpose: "maskable",
				},
			],
		},
		null,
		2,
	).concat("\n");
}

export default function webManifest(
	options: WebManifestOptions,
): AstroIntegration {
	return {
		name: "starter:web-manifest",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const file = await emitFile(
					dir,
					"site.webmanifest",
					renderWebManifest(options),
				);
				logger.info(`${file} создан`);
			},
		},
	};
}
