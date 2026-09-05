/**
 * Фоллбэк-логотип карточки без изображения: мэш-градиент вместо плоской
 * заливки. Детерминирован по строке (обычно - имени карточки), чтобы у
 * одной и той же карточки градиент не менялся между сборками.
 *
 * Палитра, хеш, PRNG и кривая светлоты лежат в `gradientBase.ts`; здесь
 * остается только раскладка блобов.
 *
 * Цвета - в OKLCH, как и токены в `src/styles/tailwind.css`. Это не косметика:
 * в HSL светлота номинальная, поэтому «одинаково светлые» синий и желтый на
 * деле различаются вдвое, и тройка блобов расслаивается на «яркое пятно и два
 * грязных». В OKLCH светлота воспринимаемая, а хрому можно держать у границы
 * охвата sRGB - отсюда и насыщенность.
 */

import {
	createRandom,
	hashString,
	hueLift,
	PALETTES,
	pick,
} from "@/utils/lib/gradientBase";

interface Role {
	readonly lightness: number;
	readonly chroma: number;
	/** Прибавка к светлоте на желто-лаймовом участке круга, см. `hueLift`. */
	readonly lift: number;
	/** Радиус затухания блоба, % от размера элемента. */
	readonly size: number;
}

/*
 * Три роли вместо одинаковых `80% 60%` у всех блобов. Хрома взята у верхней
 * границы sRGB для своей светлоты: ниже - блекло, выше - браузер все равно
 * поджимает цвет к охвату, а вместе с ним уезжает и оттенок.
 */

/** Большое глубокое пятно, задает «тень» круга. */
const DEPTH: Role = { lightness: 0.44, chroma: 0.15, lift: 0.1, size: 88 };
/** Самый насыщенный слой - на нем читается палитра. */
const MAIN: Role = { lightness: 0.64, chroma: 0.2, lift: 0.16, size: 72 };
/** Маленький и светлый: дает объем вместо плоской заливки. */
const HIGHLIGHT: Role = { lightness: 0.83, chroma: 0.14, lift: 0.08, size: 56 };

/** Насколько блобы разнесены от центра, % от размера элемента. */
const SPREAD = 30;

/**
 * Спутники блоба: core-лепесток дает базовый круг, спутники - неровные
 * «наросты» по краю, из-за которых пятно читается как органическая клякса,
 * а не идеальная окружность. Число не завязано на роль: и depth, и highlight
 * растут одинаково, разница - только в итоговом размере (`role.size`).
 */
const BLOB_SATELLITES = 3;
/** Насколько спутник может уйти от центра core-лепестка, % от размера элемента. */
const SATELLITE_SPREAD = 12;
/** Диапазон масштаба спутника относительно базового радиуса роли. */
const SATELLITE_SCALE: readonly [number, number] = [0.5, 0.85];

/**
 * Один лепесток (radial-gradient). Затухание идет в тот же цвет с нулевой
 * альфой, а не в `transparent`: ключевое слово раскрывается в прозрачный
 * черный, и на стыке слоев цвет уводит в серый.
 */
function lobe(
	hue: number,
	role: Role,
	x: number,
	y: number,
	size: number,
): string {
	const lightness = (role.lightness + role.lift * hueLift(hue)).toFixed(3);
	const color = `${lightness} ${role.chroma} ${hue}`;

	return `radial-gradient(circle at ${x}% ${y}%, oklch(${color}) 0%, oklch(${color} / 0) ${size}%)`;
}

/**
 * Один блоб = core-лепесток по центру плюс несколько спутников, смещенных и
 * уменьшенных случайно. Идеальный круг читается как штамп, а неровный контур
 * - как органически выросшее пятно, при этом остается одним цветом и одной
 * ролью, так что издалека все еще выглядит как один блоб, а не мусор.
 */
function blob(
	hue: number,
	role: Role,
	angle: number,
	random: () => number,
): string {
	const radians = (angle * Math.PI) / 180;
	const distance = SPREAD * (0.75 + random() * 0.5);
	const x = Math.round(50 + Math.cos(radians) * distance);
	const y = Math.round(50 + Math.sin(radians) * distance);

	const lobes = [lobe(hue, role, x, y, role.size)];

	for (let i = 0; i < BLOB_SATELLITES; i++) {
		const satelliteAngle = (random() * 360 * Math.PI) / 180;
		const satelliteDistance = SATELLITE_SPREAD * random();
		const satelliteX = Math.round(
			x + Math.cos(satelliteAngle) * satelliteDistance,
		);
		const satelliteY = Math.round(
			y + Math.sin(satelliteAngle) * satelliteDistance,
		);
		const [scaleMin, scaleMax] = SATELLITE_SCALE;
		const satelliteSize = Math.round(
			role.size * (scaleMin + random() * (scaleMax - scaleMin)),
		);

		lobes.push(lobe(hue, role, satelliteX, satelliteY, satelliteSize));
	}

	return lobes.join(", ");
}

/**
 * Готовая CSS-декларация (`background-color` + `background-image`).
 * `background-image` принимает только значения-изображения - сплошной цвет
 * туда подмешать нельзя, поэтому подложка идет отдельным свойством.
 */
export function meshGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [depthHue, mainHue, highlightHue] = palette.hues;

	// Блобы стоят по вершинам треугольника, повернутого на общую фазу: покрытие
	// круга гарантировано, а раскладка все равно своя у каждой карточки.
	// Независимые x/y давали и слипшиеся блобы, и пустые углы.
	const phase = random() * 360;

	// Первый слой в `background-image` рисуется сверху: блик над основным
	// цветом, подложка - под ними обоими.
	const layers = [
		blob(highlightHue, HIGHLIGHT, phase + 240, random),
		blob(mainHue, MAIN, phase + 120, random),
		blob(depthHue, DEPTH, phase, random),
	].join(", ");

	// Подложку видно только по краю круга, куда не дотягивается ни один блоб.
	const base = (0.32 + 0.08 * hueLift(depthHue)).toFixed(3);

	return `background-color: oklch(${base} 0.09 ${depthHue}); background-image: ${layers};`;
}
