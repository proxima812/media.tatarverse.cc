import type { CategoryTone } from "@/lib/taxonomy";

/**
 * Классы тона категории. Строки записаны целиком, а не собираются из
 * `tone-${name}`: Tailwind находит классы сканированием исходников, и
 * склеенное имя он бы не увидел - класс просто не сгенерировался бы.
 *
 *   tile  иконка в тонированном квадрате: подложка 12%, штрих в цвет тона,
 *         контур 24% - квадрат читается и на белом, и на подложке
 *   dot   точка бейджа категории
 */
export const TONE_CLASSES = {
	blue: {
		tile: "bg-tone-blue/12 text-tone-blue ring-tone-blue/24",
		dot: "bg-tone-blue",
	},
	purple: {
		tile: "bg-tone-purple/12 text-tone-purple ring-tone-purple/24",
		dot: "bg-tone-purple",
	},
	pink: {
		tile: "bg-tone-pink/12 text-tone-pink ring-tone-pink/24",
		dot: "bg-tone-pink",
	},
	teal: {
		tile: "bg-tone-teal/12 text-tone-teal ring-tone-teal/24",
		dot: "bg-tone-teal",
	},
	amber: {
		tile: "bg-tone-amber/12 text-tone-amber ring-tone-amber/24",
		dot: "bg-tone-amber",
	},
	green: {
		tile: "bg-tone-green/12 text-tone-green ring-tone-green/24",
		dot: "bg-tone-green",
	},
	orange: {
		tile: "bg-tone-orange/12 text-tone-orange ring-tone-orange/24",
		dot: "bg-tone-orange",
	},
	indigo: {
		tile: "bg-tone-indigo/12 text-tone-indigo ring-tone-indigo/24",
		dot: "bg-tone-indigo",
	},
} as const satisfies Record<CategoryTone, { tile: string; dot: string }>;
