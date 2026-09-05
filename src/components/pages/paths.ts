import { getCollection } from "astro:content";
import { getAllCategories } from "@/components/Catalog/categories";
import { localizeCards } from "@/components/Catalog/localize";
import { getRelatedCards } from "@/components/Catalog/related";
import type { PageLocale } from "@/components/pages/pageLocale";

/**
 * Наборы путей для динамических маршрутов. `getStaticPaths` Astro читает
 * только в файлах `src/pages/**`, поэтому сама функция остается там, а
 * ее тело - здесь: русский и английский маршруты отличались лишь локалью,
 * и один из них уже успел разойтись с другим.
 */

/** Страницы проектов: `/projects/<id>` и `/en/projects/<id>`. */
export async function cardPaths(locale: PageLocale) {
	const cards = await localizeCards(await getCollection("cards"), locale);

	return cards.map((card) => ({
		params: { slug: card.id },
		props: { card, related: getRelatedCards(card, cards) },
	}));
}

/** Страницы категорий: `/catalog/<category>` и `/en/catalog/<category>`. */
export async function categoryPaths(locale: PageLocale) {
	const cards = await localizeCards(await getCollection("cards"), locale);
	const categories = getAllCategories(cards);

	return categories.map((category) => ({
		params: { category },
		props: { category, cards, categories },
	}));
}

/**
 * Текстовые страницы: набор известен на сборке и приходит из коллекции -
 * `pages` для русской, `pagesEn` для английской. Это зеркальные коллекции,
 * а не перевод поверх записи, поэтому имя коллекции - аргумент.
 */
export async function mdxPagePaths(collection: "pages" | "pagesEn") {
	const entries = await getCollection(collection);

	return entries.map((entry) => ({
		params: { page: entry.id },
		props: { entry },
	}));
}
