/**
 * Дрейф логотипов в витрине на главной. Единственный потребитель -
 * `StatField.astro`, поэтому модуль лежит рядом с ним, а не в отдельном
 * каталоге: раскладка плиток и траектория движения читаются вместе.
 */

import type { CollectionEntry } from "astro:content";

type Card = CollectionEntry<"cards">;

/** Карточка, у которой логотип точно есть: без него рисуется монограмма, а в витрине она шум. */
export type CardWithLogo = Card & {
	data: Card["data"] & { logo: NonNullable<Card["data"]["logo"]> };
};

/** FNV-1a: нужен не криптостойкий хеш, а стабильное между билдами число из id. */
function hash(input: string): number {
	let value = 2166136261;
	for (let index = 0; index < input.length; index++) {
		value ^= input.charCodeAt(index);
		value = Math.imul(value, 16777619);
	}
	return value >>> 0;
}

/** mulberry32 - детерминированный PRNG: один и тот же id дает одну и ту же траекторию. */
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
 * длительность и отрицательная задержка. Отрицательная - чтобы анимации
 * стартовали в разных фазах и движение выглядело хаотичным, а не строем.
 *
 * Значения псевдослучайные, но выведены из `id`: у логотипа всегда одна и та
 * же траектория, и статика не «дергается» от билда к билду.
 */
export function driftVars(id: string): string {
	const next = random(hash(id));
	const between = (min: number, max: number) => min + next() * (max - min);
	const round = (value: number) => Math.round(value * 100) / 100;

	/*
	 * Точки берутся в полярных координатах - угол разнесен по кругу (120° с
	 * дрожанием), радиус лежит в кольце 7-14px. При независимой выборке dx и dy
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
