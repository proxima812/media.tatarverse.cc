import type { CollectionEntry } from "astro:content";
import { CATEGORY_VALUES, type Category, type Tag } from "@/lib/taxonomy";

/**
 * Категории каталога - весь реестр, а не только занятые карточками. Раздел
 * заводится в `taxonomy.ts` раньше, чем в него ложится первая карточка, и
 * до тех пор у него все равно должны быть страница и место в переключателе:
 * иначе новую категорию нельзя ни открыть, ни показать автору.
 *
 * Порядок - реестровый, поэтому переключатель не переставляется от того,
 * какая карточка добавилась последней. Аргумент оставлен: вызывающие
 * страницы передают свой список карточек, и сигнатура переживет возврат к
 * выборке по содержимому.
 */
export function getAllCategories(
	_cards: CollectionEntry<"cards">[],
): Category[] {
	return [...CATEGORY_VALUES];
}

export function cardsByCategory(
	cards: CollectionEntry<"cards">[],
	category: Category,
): CollectionEntry<"cards">[] {
	return cards.filter((card) => card.data.categories.includes(category));
}

export function getTagCounts(
	cards: CollectionEntry<"cards">[],
): ReadonlyMap<Tag, number> {
	const counts = new Map<Tag, number>();

	for (const card of cards) {
		for (const tag of card.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return counts;
}
