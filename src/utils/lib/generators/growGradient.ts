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
 * Кольца, расходящиеся от одной точки, - годичные слои, рябь на воде, рост.
 *
 * Строится не через `repeating-radial-gradient`, а списком колец с разной
 * толщиной и прозрачностью: у повторяющегося градиента шаг постоянный, и
 * рисунок сразу читается как техническая мишень. Здесь каждое следующее
 * кольцо шире предыдущего (`GROWTH`), поэтому центр плотный, а к краю
 * рисунок разрежается - так растет все живое.
 */

/** Сколько колец рисуется от центра к краю. */
const RINGS = 7;
/** Во сколько раз каждое следующее кольцо шире предыдущего. */
const GROWTH = 1.28;
/** Толщина первого кольца, % от размера плашки. */
const FIRST_RING = 6;

export function growGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [deepHue, mainHue, lightHue] = palette.hues;

	/*
	 * Центр смещен от середины: кольца из точного центра дают симметричную
	 * мишень, а сдвинутая точка роста читается как срез ствола.
	 */
	const originX = Math.round(between(random, 20, 80));
	const originY = Math.round(between(random, 20, 80));

	const layers: string[] = [];
	let radius = 0;
	let width = FIRST_RING;

	for (let i = 0; i < RINGS; i++) {
		const outer = radius + width;
		/* Оттенок ведем от плотного к светлому по мере удаления от центра. */
		const ratio = i / (RINGS - 1);
		const hue = ratio < 0.5 ? deepHue : ratio < 0.85 ? mainHue : lightHue;
		const lightness = 0.4 + ratio * 0.42;
		const chroma = 0.19 - ratio * 0.06;

		/*
		 * Кольцо - это две жесткие остановки одного цвета: цвет держится до
		 * `radius`, дальше идет прозрачный участок до следующего кольца.
		 * Мягкий переход на таком количестве слоев смазал бы рисунок в пятно.
		 */
		const color = oklch(lightness, chroma, hue, between(random, 0.75, 1));
		const fade = oklch(lightness, chroma, hue, 0);
		const edge = Math.round(outer - width * between(random, 0.15, 0.45));

		layers.push(
			`radial-gradient(circle at ${originX}% ${originY}%, ${color} ${Math.round(radius)}%, ${color} ${edge}%, ${fade} ${edge}%, ${fade} 100%)`,
		);

		radius = outer;
		width *= GROWTH;
	}

	// Кольца рисуются от центра наружу, а первый слой в списке - верхний.
	layers.reverse();

	return declaration(oklch(0.36, 0.1, deepHue), layers);
}
