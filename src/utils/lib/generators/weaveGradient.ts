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
 * Плетение: две системы полос под разными углами, наложенные друг на друга.
 *
 * Верхний слой полупрозрачный - на пересечениях цвета смешиваются, и вместо
 * решетки получается ткань с клетками разной плотности. Углы всегда разведены
 * минимум на `MIN_ANGLE_GAP`: при близких углах слои совпадают и рисунок
 * вырождается в обычную полоску.
 */

/** Минимальный разворот между системами полос, градусы. */
const MIN_ANGLE_GAP = 40;
/** Ширина шага полосы, % от размера плашки. */
const STEP: readonly [number, number] = [7, 18];

function stripes(
	angle: number,
	hue: number,
	lightness: number,
	chroma: number,
	step: number,
	alpha: number,
	random: () => number,
): string {
	const color = oklch(lightness, chroma, hue, alpha);
	const gap = oklch(lightness, chroma, hue, 0);
	/* Доля шага, занятая самой полосой: 0.3 - редкая сетка, 0.7 - плотная. */
	const fill = between(random, 0.3, 0.7) * step;

	return `repeating-linear-gradient(${angle.toFixed(1)}deg, ${color} 0 ${fill.toFixed(2)}%, ${gap} ${fill.toFixed(2)}% ${step.toFixed(2)}%)`;
}

export function weaveGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [deepHue, mainHue, lightHue] = palette.hues;

	const warpAngle = random() * 360;
	const weftAngle =
		warpAngle + between(random, MIN_ANGLE_GAP, 180 - MIN_ANGLE_GAP);

	const warpStep = between(random, STEP[0], STEP[1]);
	const weftStep = between(random, STEP[0], STEP[1]);

	/*
	 * Порядок слоев: светлая нить сверху вполсилы, основная под ней почти
	 * непрозрачной, и мягкая подсветка углом - она дает ощущение объема,
	 * иначе ткань выглядит напечатанной.
	 */
	const sheen = oklch(0.86, 0.1, lightHue, 0.35);
	const sheenFade = oklch(0.4, 0.12, deepHue, 0.2);

	return declaration(oklch(0.38, 0.12, deepHue), [
		stripes(weftAngle, lightHue, 0.82, 0.14, weftStep, 0.55, random),
		stripes(warpAngle, mainHue, 0.6, 0.19, warpStep, 0.85, random),
		`linear-gradient(${(warpAngle + 90).toFixed(1)}deg, ${sheen} 0%, ${sheenFade} 100%)`,
	]);
}
