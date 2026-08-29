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
 * Лучи из одной точки - веер секторов на `conic-gradient` плюс мягкое
 * свечение в вершине.
 *
 * Границы секторов намеренно резкие: у конического градиента плавные стыки
 * дают ровную «цветовую юлу», в которой пропадает сам мотив луча. Ширины
 * секторов при этом разные, поэтому веер не выглядит расчерченным циркулем.
 */

/** Сколько секторов укладывается в полный круг. */
const BEAMS = 9;
/** Разброс ширины сектора относительно равной доли круга. */
const WIDTH_JITTER: readonly [number, number] = [0.55, 1.45];

export function beamGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [deepHue, mainHue, lightHue] = palette.hues;

	/* Вершина веера у края плашки: из центра лучи выглядят как звезда. */
	const originX = Math.round(between(random, 8, 42));
	const originY = Math.round(between(random, 58, 96));
	const startAngle = Math.round(random() * 360);

	/*
	 * Сначала набираем случайные ширины, потом нормируем их к 360°: иначе
	 * последний сектор добирает остаток и оказывается то нитью, то половиной
	 * круга.
	 */
	const widths = Array.from({ length: BEAMS }, () =>
		between(random, WIDTH_JITTER[0], WIDTH_JITTER[1]),
	);
	const total = widths.reduce((sum, width) => sum + width, 0);

	const stops: string[] = [];
	let angle = 0;

	widths.forEach((width, index) => {
		const end = angle + (width / total) * 360;
		/* Через сектор - темный, между ними по очереди основной и светлый. */
		const hue =
			index % 2 === 0 ? deepHue : index % 4 === 1 ? mainHue : lightHue;
		const lightness = index % 2 === 0 ? 0.38 : index % 4 === 1 ? 0.66 : 0.82;
		const chroma = index % 2 === 0 ? 0.13 : 0.18;

		const color = oklch(lightness, chroma, hue);
		stops.push(`${color} ${angle.toFixed(1)}deg ${end.toFixed(1)}deg`);
		angle = end;
	});

	const glow = oklch(0.9, 0.12, lightHue, 0.55);
	const glowFade = oklch(0.9, 0.12, lightHue, 0);

	return declaration(oklch(0.34, 0.1, deepHue), [
		`radial-gradient(circle at ${originX}% ${originY}%, ${glow} 0%, ${glowFade} 45%)`,
		`conic-gradient(from ${startAngle}deg at ${originX}% ${originY}%, ${stops.join(", ")})`,
	]);
}
