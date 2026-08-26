import type { CollectionEntry } from "astro:content";

type Card = CollectionEntry<"cards">;

export type CardWithLogo = Card & {
	data: Card["data"] & { logo: NonNullable<Card["data"]["logo"]> };
};

/**
 * Один логотип вокруг цифр: какая карточка и где стоит.
 *
 * - `id` — имя файла в `src/data/cards/` без `.md`. Карточка обязана быть
 *   с логотипом: без него рисовалась бы монограмма, а здесь она шум.
 * - `x`/`y` — центр логотипа в процентах от блока. Центральный коридор
 *   (x 28–72%, y 25–75%) занят текстом — логотип в нём перекроет цифры.
 * - `scale` — множитель к базовому размеру (`--logo-size` в компоненте):
 *   разнокалиберность вместо ровного ряда. Логотип виден на всех
 *   брейкпоинтах — сам `--logo-size` уменьшается на узких экранах, так что
 *   набор не нужно урезать под мобильный.
 */
export interface LogoSlot {
	id: string;
	x: number;
	y: number;
	scale: number;
}

/**
 * Подборка ручная, не автоматическая: витрина каталога — редакторское
 * решение, а случайный набор логотипов дал бы то мусорный набор, то три
 * почти одинаковых квадрата рядом. Менять список — здесь; чтобы поменять
 * логотип, достаточно переписать `id`, позиция останется своей.
 *
 * Базовые 12 координат и масштаб сняты с референса (скриншот витрины Mobbin)
 * — пиксельные центры логотипов переведены в проценты от рабочей зоны, там
 * все логотипы одного размера, поэтому `scale` везде 1. Два добавленных
 * позже (`tatarverse-community`, `media-tatarverse-media`) вписаны в
 * оставшиеся свободные промежутки по той же логике.
 */
export const LOGOS: readonly LogoSlot[] = [
	{ id: "qaradeniz-production-channel", x: 20, y: 13, scale: 1 },
	{ id: "bashkir-teacher-app-language", x: 32, y: 12, scale: 1 },
	{ id: "qirim-junior-language", x: 47, y: 8, scale: 1 },
	{ id: "idel-realii-media", x: 70, y: 10, scale: 1 },
	{ id: "kazan-utlary-media", x: 90, y: 10, scale: 1 },
	{ id: "ana-yurt-language", x: 15, y: 48, scale: 1 },
	{ id: "qha-media", x: 79, y: 55, scale: 1 },
	{ id: "tamyr-channel-channel", x: 8, y: 86, scale: 1 },
	{ id: "neurotatarlar-language", x: 29, y: 78, scale: 1 },
	{ id: "emel-zhurnal-media", x: 51, y: 84, scale: 1 },
	{ id: "tatar-radiosy-media", x: 69, y: 85, scale: 1 },
	{ id: "idel-zhurnal-media", x: 88, y: 80, scale: 1 },
	{ id: "tatarverse-community", x: 93, y: 30, scale: 1 },
	{ id: "media-tatarverse-media", x: 6, y: 65, scale: 1 },
];

export interface PlacedLogo {
	slot: LogoSlot;
	card: CardWithLogo;
}

/**
 * Сопоставляет список `LOGOS` с коллекцией. Неизвестный id роняет билд, а не
 * тихо пропускает слот: карточку могли переименовать или удалить, и дырка в
 * витрине заметна куда позже, чем ошибка сборки.
 */
export function resolveLogos(cards: Card[]): PlacedLogo[] {
	const byId = new Map(cards.map((card) => [card.id, card]));

	return LOGOS.map((slot) => {
		const card = byId.get(slot.id);
		if (!card) {
			throw new Error(
				`CatalogStats: карточки "${slot.id}" нет в коллекции cards — проверьте src/components/CatalogStats/logos.ts`,
			);
		}
		if (!card.data.logo) {
			throw new Error(
				`CatalogStats: у карточки "${slot.id}" нет логотипа — выберите другую в src/components/CatalogStats/logos.ts`,
			);
		}

		return { slot, card: card as CardWithLogo };
	});
}

/** FNV-1a: нужен не криптостойкий хеш, а стабильное между билдами число из id. */
function hash(input: string): number {
	let value = 2166136261;
	for (let index = 0; index < input.length; index++) {
		value ^= input.charCodeAt(index);
		value = Math.imul(value, 16777619);
	}
	return value >>> 0;
}

/** mulberry32 — детерминированный PRNG: один и тот же id даёт одну и ту же траекторию. */
function random(seed: number): () => number {
	let state = seed;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * CSS-переменные дрейфа для одного логотипа: три точки траектории, своя
 * длительность и отрицательная задержка. Отрицательная — чтобы анимации
 * стартовали в разных фазах и движение выглядело хаотичным, а не строем.
 *
 * Значения псевдослучайные, но выведены из `id`: у логотипа всегда одна и та
 * же траектория, и статика не «дёргается» от билда к билду.
 */
export function driftVars(id: string): string {
	const next = random(hash(id));
	const between = (min: number, max: number) => min + next() * (max - min);
	const round = (value: number) => Math.round(value * 100) / 100;

	/*
	 * Точки берутся в полярных координатах — угол разнесён по кругу (120° с
	 * дрожанием), радиус лежит в кольце 7–14px. При независимой выборке dx и dy
	 * логотипу могло выпасть три почти нулевых смещения по одной оси, и он
	 * замирал на месте; кольцо гарантирует заметный ход каждому.
	 */
	const base = between(0, 360);

	const steps = Array.from({ length: 3 }, (_, index) => {
		const angle = ((base + index * 120 + between(-40, 40)) * Math.PI) / 180;
		const radius = between(7, 14);
		const point = index + 1;

		return [
			`--dx-${point}:${round(Math.cos(angle) * radius)}px`,
			`--dy-${point}:${round(Math.sin(angle) * radius)}px`,
			`--rot-${point}:${round(between(-7, 7))}deg`,
		];
	}).flat();

	return [
		...steps,
		`--drift-duration:${round(between(9, 17))}s`,
		`--drift-delay:-${round(between(0, 14))}s`,
	].join(";");
}
