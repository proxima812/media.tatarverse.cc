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
 * Крупная органическая клякса: одно доминирующее пятно у края и два меньших
 * рядом, все с рваным контуром из спутников.
 *
 * Отличие от `meshGradient`: там три равноправных блоба по вершинам
 * треугольника и заполнение всей плашки, здесь - выраженный центр тяжести и
 * пустое поле подложки с противоположной стороны. На маленьком квадрате это
 * читается как капля, а не как заливка.
 */

/** Сколько «наростов» получает каждое пятно поверх основного круга. */
const SATELLITES = 4;
/** Насколько далеко спутник уходит от центра пятна, % от размера плашки. */
const SATELLITE_SPREAD = 14;

interface Layer {
	readonly lightness: number;
	readonly chroma: number;
	/** Радиус затухания, % от размера плашки. */
	readonly size: number;
	/** Насколько пятно смещено от центра плашки, % от ее размера. */
	readonly offset: number;
}

const CORE: Layer = { lightness: 0.62, chroma: 0.19, size: 78, offset: 22 };
const SHADOW: Layer = { lightness: 0.42, chroma: 0.15, size: 64, offset: 34 };
const GLINT: Layer = { lightness: 0.84, chroma: 0.13, size: 42, offset: 26 };

function lobe(hue: number, layer: Layer, x: number, y: number, size: number) {
	const color = oklch(layer.lightness, layer.chroma, hue);
	const fade = oklch(layer.lightness, layer.chroma, hue, 0);

	return `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, ${fade} ${size}%)`;
}

function splash(
	hue: number,
	layer: Layer,
	angle: number,
	random: () => number,
): string[] {
	const radians = (angle * Math.PI) / 180;
	const x = Math.round(50 + Math.cos(radians) * layer.offset);
	const y = Math.round(50 + Math.sin(radians) * layer.offset);

	const lobes = [lobe(hue, layer, x, y, layer.size)];

	for (let i = 0; i < SATELLITES; i++) {
		const satelliteAngle = between(random, 0, Math.PI * 2);
		const distance = SATELLITE_SPREAD * random();

		lobes.push(
			lobe(
				hue,
				layer,
				Math.round(x + Math.cos(satelliteAngle) * distance),
				Math.round(y + Math.sin(satelliteAngle) * distance),
				Math.round(layer.size * between(random, 0.45, 0.8)),
			),
		);
	}

	return lobes;
}

export function blobGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [shadowHue, coreHue, glintHue] = palette.hues;

	/*
	 * Общая ось вместо независимых координат: пятна расходятся от одного
	 * направления небольшим веером, поэтому клякса остается цельной. При
	 * независимом размещении они то слипались в диск, то разлетались по углам.
	 */
	const axis = random() * 360;

	// Первый слой рисуется сверху: блик над основным цветом, тень - под ними.
	const layers = [
		...splash(glintHue, GLINT, axis + between(random, -40, 40), random),
		...splash(coreHue, CORE, axis, random),
		...splash(shadowHue, SHADOW, axis + between(random, 130, 230), random),
	];

	return declaration(oklch(0.34, 0.08, shadowHue), layers);
}
