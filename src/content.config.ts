import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORY_VALUES, TAG_VALUES } from "@/components/Catalog/taxonomy";

/**
 * Одна карточка = один проект в каталоге. `peoples` - массив, потому что
 * проект может быть общим (например, языковая платформа для нескольких
 * народов сразу). Русский текст - источник истины: id файла в `cards-en/`
 * должен совпадать с id в `cards/`, см. `src/components/Catalog/localize.ts`.
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
 * `localizeCards` в `src/components/Catalog/localize.ts`).
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

export const collections = { cards, cardsEn, pages, pagesEn };
