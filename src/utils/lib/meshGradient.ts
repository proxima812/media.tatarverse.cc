/**
 * Фоллбэк-логотип карточки без изображения: мэш-градиент вместо плоской
 * заливки. Детерминирован по строке (обычно — имени карточки), чтобы у
 * одной и той же карточки градиент не менялся между сборками.
 *
 * Цвета — в OKLCH, как и токены в `src/styles/tailwind.css`. Это не косметика:
 * в HSL светлота номинальная, поэтому «одинаково светлые» синий и жёлтый на
 * деле различаются вдвое, и тройка блобов расслаивается на «яркое пятно и два
 * грязных». В OKLCH светлота воспринимаемая, а хрому можно держать у границы
 * охвата sRGB — отсюда и насыщенность.
 */

interface Palette {
	/** Название — для чтения диффов, в CSS не попадает. */
	readonly name: string;
	/**
	 * Тройка оттенков (OKLCH hue) от глубокого к яркому. Роли назначаются по
	 * позиции: `[подложка, основной, блик]`.
	 */
	readonly hues: readonly [number, number, number];
}

/**
 * Готовые сочетания вместо трёх независимых бросков по общему списку оттенков.
 * Независимый выбор давал и вырожденные тройки (три одинаковых оттенка —
 * плоское пятно), и заведомо грязные (синий + оранжевый + зелёный).
 *
 * Каждое сочетание аналоговое: оттенки идут подряд по кругу с шагом ≈45°, то
 * есть гармоничны по построению, а не по удаче. Разброс внутри тройки ≤ 90° —
 * достаточно, чтобы в круге читался переход цвета, и мало, чтобы соседние тона
 * не смешивались в серое.
 *
 * Каждая тройка проходит через акцентный тон xima-ui
 * (`docs/ui/xima-ui/skills/xima-ui/core/palettes`) или соседствует с ним —
 * фоллбэк остаётся в дизайн-языке материнского проекта, а не в случайных
 * цветах. Якоря в OKLCH: red 25 · orange 56 · green 150 · blue 260 ·
 * violet 298 · pink 356.
 *
 * Центры троек разнесены по кругу примерно равномерно: набор, перекошенный в
 * сине-фиолетовое (а именно туда смотрят сразу два акцента кита), давал
 * каталог из почти одинаковых карточек.
 */
const PALETTES: readonly [Palette, ...Palette[]] = [
	{ name: "aurora", hues: [300, 255, 210] },
	{ name: "cobalt", hues: [235, 280, 325] },
	{ name: "lagoon", hues: [260, 215, 170] },
	{ name: "jade", hues: [200, 155, 110] },
	{ name: "citrus", hues: [160, 115, 70] },
	{ name: "amber", hues: [45, 85, 125] },
	{ name: "ember", hues: [10, 55, 100] },
	{ name: "magma", hues: [320, 355, 35] },
	{ name: "sunset", hues: [345, 20, 65] },
	{ name: "orchid", hues: [265, 305, 345] },
	{ name: "coral", hues: [15, 335, 295] },
	{ name: "tropic", hues: [185, 140, 95] },
];

interface Role {
	readonly lightness: number;
	readonly chroma: number;
	/** Прибавка к светлоте на жёлто-лаймовом участке круга, см. `hueLift`. */
	readonly lift: number;
	/** Радиус затухания блоба, % от размера элемента. */
	readonly size: number;
}

/*
 * Три роли вместо одинаковых `80% 60%` у всех блобов. Хрома взята у верхней
 * границы sRGB для своей светлоты: ниже — блёкло, выше — браузер всё равно
 * поджимает цвет к охвату, а вместе с ним уезжает и оттенок.
 */

/** Большое глубокое пятно, задаёт «тень» круга. */
const DEPTH: Role = { lightness: 0.44, chroma: 0.15, lift: 0.1, size: 88 };
/** Самый насыщенный слой — на нём читается палитра. */
const MAIN: Role = { lightness: 0.64, chroma: 0.2, lift: 0.16, size: 72 };
/** Маленький и светлый: даёт объём вместо плоской заливки. */
const HIGHLIGHT: Role = { lightness: 0.83, chroma: 0.14, lift: 0.08, size: 56 };

/** Насколько блобы разнесены от центра, % от размера элемента. */
const SPREAD = 30;

/**
 * Спутники блоба: core-лепесток даёт базовый круг, спутники — неровные
 * «наросты» по краю, из-за которых пятно читается как органическая клякса,
 * а не идеальная окружность. Число не завязано на роль: и depth, и highlight
 * растут одинаково, разница — только в итоговом размере (`role.size`).
 */
const BLOB_SATELLITES = 3;
/** Насколько спутник может уйти от центра core-лепестка, % от размера элемента. */
const SATELLITE_SPREAD = 12;
/** Диапазон масштаба спутника относительно базового радиуса роли. */
const SATELLITE_SCALE: readonly [number, number] = [0.5, 0.85];

/** Оттенок чистого жёлтого в OKLCH — вершина кривой светлоты. */
const YELLOW = 100;
/** Полуширина этой вершины в градусах. */
const YELLOW_WIDTH = 45;

/**
 * Доля прибавки к светлоте, 0…1, с максимумом на жёлтом.
 *
 * Максимальная светлота цвета зависит от оттенка: жёлтый в sRGB — это
 * `oklch(0.97 …)`, синий — `oklch(0.45 …)`. Одна светлота на всю тройку
 * поэтому не работает: то, что для синего насыщенный тон, для жёлтого уже
 * оливковая грязь. Кривая приподнимает только жёлто-лаймовый участок и
 * затухает к 25 (red) и 260 (blue), где значения ролей и так совпадают с
 * акцентами xima-ui.
 */
function hueLift(hue: number): number {
	const distance = Math.abs(((((hue - YELLOW) % 360) + 540) % 360) - 180);
	return Math.exp(-((distance / YELLOW_WIDTH) ** 2));
}

/** FNV-1a: биты перемешаны, поэтому близкие имена дают непохожие градиенты. */
function hashString(value: string): number {
	let hash = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return hash >>> 0;
}

/**
 * mulberry32 — детерминированный PRNG. Прежняя версия брала разряды одного
 * хеша сдвигами (`hash >> 3`, `hash >> 6`), а такие выборки коррелируют:
 * часть сочетаний выпадала заметно чаще остальных.
 */
function createRandom(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function pick<T>(items: readonly [T, ...T[]], ratio: number): T {
	const index = Math.min(items.length - 1, Math.floor(ratio * items.length));
	return items[index] ?? items[0];
}

/**
 * Один лепесток (radial-gradient). Затухание идёт в тот же цвет с нулевой
 * альфой, а не в `transparent`: ключевое слово раскрывается в прозрачный
 * чёрный, и на стыке слоёв цвет уводит в серый.
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
 * Один блоб = core-лепесток по центру плюс несколько спутников, смещённых и
 * уменьшенных случайно. Идеальный круг читается как штамп, а неровный контур
 * — как органически выросшее пятно, при этом остаётся одним цветом и одной
 * ролью, так что издалека всё ещё выглядит как один блоб, а не мусор.
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
 * `background-image` принимает только значения-изображения — сплошной цвет
 * туда подмешать нельзя, поэтому подложка идёт отдельным свойством.
 */
export function meshGradient(seed: string): string {
	const random = createRandom(hashString(seed));
	const palette = pick(PALETTES, random());
	const [depthHue, mainHue, highlightHue] = palette.hues;

	// Блобы стоят по вершинам треугольника, повёрнутого на общую фазу: покрытие
	// круга гарантировано, а раскладка всё равно своя у каждой карточки.
	// Независимые x/y давали и слипшиеся блобы, и пустые углы.
	const phase = random() * 360;

	// Первый слой в `background-image` рисуется сверху: блик над основным
	// цветом, подложка — под ними обоими.
	const layers = [
		blob(highlightHue, HIGHLIGHT, phase + 240, random),
		blob(mainHue, MAIN, phase + 120, random),
		blob(depthHue, DEPTH, phase, random),
	].join(", ");

	// Подложку видно только по краю круга, куда не дотягивается ни один блоб.
	const base = (0.32 + 0.08 * hueLift(depthHue)).toFixed(3);

	return `background-color: oklch(${base} 0.09 ${depthHue}); background-image: ${layers};`;
}
