/**
 * Общая основа генераторов градиентов: палитра, детерминированный PRNG и
 * правка светлоты по оттенку. Вынесено из `meshGradient.ts` - генераторов
 * стало несколько, и палитру с хешем каждый из них повторял бы дословно.
 *
 * Все генераторы держат один контракт: `(seed: string) => string`, где
 * результат - готовая CSS-декларация (`background-color` + `background-image`).
 * Одна и та же строка на входе всегда дает один и тот же фон: карточка не
 * должна менять вид между сборками.
 *
 * Цвета - в OKLCH, как и токены в `src/styles/tailwind.css`. Это не косметика:
 * в HSL светлота номинальная, поэтому «одинаково светлые» синий и желтый на
 * деле различаются вдвое, и слои расслаиваются на «яркое пятно и два грязных».
 * В OKLCH светлота воспринимаемая, а хрому можно держать у границы охвата
 * sRGB - отсюда и насыщенность.
 */

export interface Palette {
	/** Название - для чтения диффов, в CSS не попадает. */
	readonly name: string;
	/**
	 * Тройка оттенков (OKLCH hue) от глубокого к яркому. Роли назначаются по
	 * позиции: `[подложка, основной, блик]`.
	 */
	readonly hues: readonly [number, number, number];
}

/**
 * Готовые сочетания вместо трех независимых бросков по общему списку оттенков.
 * Независимый выбор давал и вырожденные тройки (три одинаковых оттенка -
 * плоское пятно), и заведомо грязные (синий + оранжевый + зеленый).
 *
 * Каждое сочетание аналоговое: оттенки идут подряд по кругу с шагом ≈45°, то
 * есть гармоничны по построению, а не по удаче. Разброс внутри тройки ≤ 90° -
 * достаточно, чтобы читался переход цвета, и мало, чтобы соседние тона не
 * смешивались в серое.
 *
 * Якоря в OKLCH: red 25 · orange 56 · green 150 · blue 260 · violet 298 ·
 * pink 356. Центры троек разнесены по кругу примерно равномерно: набор,
 * перекошенный в сине-фиолетовое, давал каталог из почти одинаковых карточек.
 */
export const PALETTES: readonly [Palette, ...Palette[]] = [
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

/** Оттенок чистого желтого в OKLCH - вершина кривой светлоты. */
const YELLOW = 100;
/** Полуширина этой вершины в градусах. */
const YELLOW_WIDTH = 45;

/**
 * Доля прибавки к светлоте, 0…1, с максимумом на желтом.
 *
 * Максимальная светлота цвета зависит от оттенка: желтый в sRGB - это
 * `oklch(0.97 …)`, синий - `oklch(0.45 …)`. Одна светлота на всю тройку
 * поэтому не работает: то, что для синего насыщенный тон, для желтого уже
 * оливковая грязь. Кривая приподнимает только желто-лаймовый участок и
 * затухает к 25 (red) и 260 (blue).
 */
export function hueLift(hue: number): number {
	const distance = Math.abs(((((hue - YELLOW) % 360) + 540) % 360) - 180);
	return Math.exp(-((distance / YELLOW_WIDTH) ** 2));
}

/** FNV-1a: биты перемешаны, поэтому близкие имена дают непохожие градиенты. */
export function hashString(value: string): number {
	let hash = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return hash >>> 0;
}

/**
 * mulberry32 - детерминированный PRNG. Брать разряды одного хеша сдвигами
 * (`hash >> 3`, `hash >> 6`) нельзя: такие выборки коррелируют, и часть
 * сочетаний выпадает заметно чаще остальных.
 */
export function createRandom(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function pick<T>(items: readonly [T, ...T[]], ratio: number): T {
	const index = Math.min(items.length - 1, Math.floor(ratio * items.length));
	return items[index] ?? items[0];
}

/** Число в диапазоне `[min, max)` - читается лучше, чем `min + r() * (max - min)`. */
export function between(
	random: () => number,
	min: number,
	max: number,
): number {
	return min + random() * (max - min);
}

/**
 * Цвет в OKLCH со светлотой, приподнятой на желто-лаймовом участке круга.
 * `alpha` отделен от цвета: затухание в тот же цвет с нулевой альфой, а не в
 * `transparent` - ключевое слово раскрывается в прозрачный черный, и на стыке
 * слоев цвет уводит в серый.
 */
export function oklch(
	lightness: number,
	chroma: number,
	hue: number,
	alpha = 1,
): string {
	const lifted = (lightness + 0.12 * hueLift(hue)).toFixed(3);
	const value = `${lifted} ${chroma} ${hue}`;

	return alpha === 1 ? `oklch(${value})` : `oklch(${value} / ${alpha})`;
}

/**
 * Собирает готовую декларацию. `background-image` принимает только
 * значения-изображения - сплошной цвет туда подмешать нельзя, поэтому
 * подложка идет отдельным свойством.
 */
export function declaration(base: string, layers: readonly string[]): string {
	return `background-color: ${base}; background-image: ${layers.join(", ")};`;
}
