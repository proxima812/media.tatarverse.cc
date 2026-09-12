import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORY_VALUES, TAG_VALUES } from "@/lib/taxonomy";

/**
 * Одна карточка = один проект в каталоге. `peoples` - массив, потому что
 * проект может быть общим (например, языковая платформа для нескольких
 * народов сразу). Русский текст - источник истины: id файла в `cards-en/`
 * должен совпадать с id в `cards/`, см. `src/lib/catalog/localize.ts`.
 */
const cards = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/cards/" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			description: z.string(),
			/** 3-4 коротких факта о проекте - показываются на карточке и на странице проекта. */
			facts: z.array(z.string()).min(3).max(4),
			url: z.url(),
			/** Дата добавления карточки в каталог. */
			pubDate: z.coerce.date(),
			/** Локальный файл логотипа - Astro оптимизирует и генерирует размеры. Нет логотипа - карточка рисует монограмму. */
			logo: image().optional(),
			categories: z.array(z.enum(CATEGORY_VALUES)).min(1),
			tags: z.array(z.enum(TAG_VALUES)).min(1),
			peoples: z.array(z.enum(["tatar", "bashkir", "crimean-tatar"])).min(1),
		}),
});

/**
 * Английский перевод карточек. Только переводимый текст - url, logo,
 * categories, tags и peoples не зависят от языка и берутся из `cards`. Нет файла
 * с тем же id - карточка на /en/ показывается с русским текстом (см.
 * `localizeCards` в `src/lib/catalog/localize.ts`).
 */
const cardsEn = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/cards-en/" }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		facts: z.array(z.string()).min(3).max(4),
	}),
});

/**
 * Цельные текстовые страницы сайта - политика конфиденциальности, условия
 * использования, источники, «О проекте», «Добавить проект». В отличие от
 * `cards`/`cardsEn`, `pagesEn` не докладывает перевод поверх русской записи -
 * это полноценная зеркальная коллекция: у каждой страницы свое, целиком
 * переведенное тело документа. Слияние `data` здесь не подходит - оно
 * подменило бы только фронтматтер, а сам markdown-текст остался бы русским.
 * Подробности и пример страницы - `starter-mdx`.
 */
const pages = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/markdown/" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		/** Дата последнего пересмотра текста - показывается на странице. */
		updatedDate: z.coerce.date(),
	}),
});

/** Английский перевод текстовых страниц. Id файла должен совпадать с `pages`. */
const pagesEn = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/markdown-en/" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedDate: z.coerce.date(),
	}),
});

/**
 * Артист музыкального каталога (`/catalog/music/`). Отдельная коллекция, а не
 * категория в `cards`: у карточки проекта обязательны `facts`, `url` и
 * таксономия, а здесь смысл карточки другой - фотография и имя, - и вся
 * содержательная часть живет на персональной странице списком популярных
 * треков. Натягивать это на схему `cards` пришлось бы через поля, которые
 * для проекта необязательны, а для артиста бессмысленны.
 */
const artists = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/artists/" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			/** Имя латиницей для /en/ - нет поля, значит имя не переводится. */
			nameEn: z.string().optional(),
			description: z.string().optional(),
			descriptionEn: z.string().optional(),
			/** Фото артиста или обложка альбома - лицо карточки. Нет файла - рисуется градиент с монограммой. */
			photo: image().optional(),
			/*
			 * Атрибуция фото. Снимки берутся с Викисклада, а свободная лицензия
			 * там - не то же самое, что «бери и ставь»: CC BY-SA требует назвать
			 * автора и лицензию рядом с изображением. Поэтому поля живут в
			 * данных, а подпись рисуется на странице артиста автоматически -
			 * забыть ее, добавляя фото, нельзя.
			 */
			photoCredit: z.string().optional(),
			/**
			 * Готовая подпись под фото - для обложек релизов, у которых нет
			 * «автора снимка»: там подписывать надо сам релиз. Есть подпись -
			 * она и рисуется вместо пары «автор, лицензия».
			 */
			photoCaption: z.string().optional(),
			photoLicense: z.string().optional(),
			photoLicenseUrl: z.url().optional(),
			/** Страница файла-источника (на Викискладе - File:...). */
			photoSource: z.url().optional(),
			/**
			 * Популярные треки в порядке убывания популярности - его задает
			 * человек во фронтматтере, а не подсчет: у каталога нет источника
			 * прослушиваний, и порядок здесь - редакторское решение.
			 */
			tracks: z
				.array(
					z.object({
						title: z.string(),
						/** Ссылка на трек. Есть - кнопка копирует ее, нет - копирует «Артист — Трек». */
						url: z.url().optional(),
						/** Год релиза - подпись под названием. */
						year: z.number().int().optional(),
					}),
				)
				.default([]),
			/** Внешние площадки артиста: Telegram, стриминги, соцсети. */
			links: z
				.array(z.object({ label: z.string(), url: z.url() }))
				.default([]),
		}),
});

export const collections = { cards, cardsEn, pages, pagesEn, artists };
