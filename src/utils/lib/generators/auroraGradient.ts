import {
	between,
	createRandom,
	declaration,
	hashString,
	oklch,
	PALETTES,
	pick,
} from "@/utils/lib/generators/shared";

/**
 * Полярное сияние: несколько вытянутых лент, сдвинутых по общей оси.
 *
 * Лента - это эллиптический `radial-gradient` с сильно разными радиусами:
 * такой градиент растягивается вдоль одной оси и мягко гаснет поперек, то
 * есть ведет себя как полоса света, а не как пятно. Все ленты повернуты
 * примерно одинаково (`DRIFT` задает допустимое расхождение) - именно общее
 * направление и читается как сияние, разнонаправленные полосы выглядят
 * случайным мусором.
 */

/** Сколько лент накладывается друг на друга. */
const BANDS = 4;
/** Допустимое расхождение ленты от общей оси, градусы. */
const DRIFT = 18;
/** Длина и толщина ленты, % от размера плашки. */
const LENGTH: readonly [number, number] = [80, 140];
const THICKNESS: readonly [number, number] = [14, 34];

export function auroraGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [deepHue, mainHue, lightHue] = palette.hues;

	const axis = random() * 360;
	const layers: string[] = [];

	for (let i = 0; i < BANDS; i++) {
		const ratio = i / (BANDS - 1);
		/* Ближние к зрителю ленты светлее и тоньше - так набирается глубина. */
		const hue = ratio < 0.34 ? lightHue : ratio < 0.67 ? mainHue : deepHue;
		const lightness = 0.85 - ratio * 0.4;
		const chroma = 0.13 + ratio * 0.06;
		const alpha = 0.75 - ratio * 0.25;

		const angle = axis + between(random, -DRIFT, DRIFT);
		const length = between(random, LENGTH[0], LENGTH[1]);
		const thickness = between(random, THICKNESS[0], THICKNESS[1]);

		/*
		 * Ленты расставлены поперек оси с шагом, а не случайно: случайные
		 * смещения регулярно клали две ленты одна на другую, и вместо сияния
		 * получалась одна широкая полоса.
		 */
		const shift = (ratio - 0.5) * 70;
		const x = Math.round(50 + Math.cos(((angle + 90) * Math.PI) / 180) * shift);
		const y = Math.round(50 + Math.sin(((angle + 90) * Math.PI) / 180) * shift);

		const color = oklch(lightness, chroma, hue, alpha);
		const fade = oklch(lightness, chroma, hue, 0);

		layers.push(
			`radial-gradient(${length.toFixed(1)}% ${thickness.toFixed(1)}% at ${x}% ${y}%, ${color} 0%, ${fade} 100%)`,
		);
	}

	/* Холодная подложка снизу - сияние всегда видно на темном небе. */
	return declaration(oklch(0.3, 0.09, deepHue), layers);
}
