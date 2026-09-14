import type { Category } from "@/lib/taxonomy";

/**
 * Данные и геометрия витрины поиска на главной (`SearchShowcase.astro`).
 * Слайды - контент, как тексты в `content.ts`: они правятся чаще разметки,
 * поэтому живут отдельно от компонента.
 */

/** Место кадра внутри панели, в процентах от ее габарита. */
export type Tile = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export type Photo = {
	/** Имя файла в `src/assets/images/showcase/` без расширения. */
	file: string;
	alt: { ru: string; en: string };
};

export type Slide = {
	category: Category;
	background: string;
	photos: [Photo, Photo, Photo];
};

/*
 * Боковые кадры прижаты к краям панели и уходят под них по всей высоте -
 * так композиция держит рамку, а не висит тремя картинками по центру.
 * Средний стоит свободно между ними: он шире боковых и ниже их, ровно по
 * его центру идет пилюля поиска.
 *
 * Симметрия считается по краям: левый начинается в 0, правый заканчивается
 * в 100, ширина у них одна.
 */
const EDGE_WIDTH = 29.4;

export const TILES: [Tile, Tile, Tile] = [
	{ left: 0, top: 0, width: EDGE_WIDTH, height: 100 },
	{ left: 37, top: 19.5, width: 26, height: 60 },
	{ left: 100 - EDGE_WIDTH, top: 0, width: EDGE_WIDTH, height: 100 },
];

/** Смещение (в процентах от высоты самого кадра), паркующее его сразу за краем панели. */
export const exitOffset = (tile: Tile) =>
	-(((tile.top + tile.height) / tile.height) * 100 + 6);
export const enterOffset = (tile: Tile) =>
	((100 - tile.top) / tile.height) * 100 + 6;

/*
 * Слайды идут по категориям каталога - тем, что человек и правда ищет.
 * Фон переезжает вместе с запросом; цвета подобраны под настроение кадров.
 */
export const SLIDES: Slide[] = [
	{
		category: "music",
		background: "#2b2230",
		photos: [
			{
				file: "music-1",
				alt: {
					ru: "Артист поет в микрофон на сцене в сценическом дыму",
					en: "A performer singing into a microphone in stage haze",
				},
			},
			{
				file: "music-2",
				alt: {
					ru: "Обложка музыкального альбома",
					en: "A music album cover",
				},
			},
			{
				file: "music-3",
				alt: {
					ru: "Музыкальная группа в сценических костюмах на темном фоне",
					en: "A band in stage costumes against a dark backdrop",
				},
			},
		],
	},
	{
		category: "lessons",
		background: "#3b3226",
		photos: [
			{
				file: "lessons-1",
				alt: {
					ru: "Тетрадь с рукописным текстом и перьевая ручка",
					en: "Notebook with handwriting and a fountain pen",
				},
			},
			{
				file: "lessons-2",
				alt: {
					ru: "Две ручки на исписанном листе",
					en: "Two pens resting on a written page",
				},
			},
			{
				file: "lessons-3",
				alt: {
					ru: "Раскрытый блокнот с записями в руке",
					en: "An open handwritten notebook held in a hand",
				},
			},
		],
	},
	{
		category: "channel",
		background: "#24333a",
		photos: [
			{
				file: "channel-1",
				alt: {
					ru: "Катушки с кинопленкой и старая аппаратура",
					en: "Film reels and vintage equipment",
				},
			},
			{
				file: "channel-2",
				alt: {
					ru: "Ретро-камера в руке на голубом фоне",
					en: "A retro camera held against a blue backdrop",
				},
			},
			{
				file: "channel-3",
				alt: {
					ru: "Двухобъективная пленочная камера",
					en: "A twin-lens film camera",
				},
			},
		],
	},
	{
		category: "language",
		background: "#33261f",
		photos: [
			{
				file: "language-1",
				alt: {
					ru: "Перо выводит строчку на бумаге",
					en: "A nib writing a line on paper",
				},
			},
			{
				file: "language-2",
				alt: {
					ru: "Зал старой библиотеки с книжными полками",
					en: "A hall of an old library lined with books",
				},
			},
			{
				file: "language-3",
				alt: {
					ru: "Стопка старых книг в кожаных переплетах",
					en: "A stack of old leather-bound books",
				},
			},
		],
	},
];
