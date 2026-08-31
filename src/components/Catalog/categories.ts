import type { CollectionEntry } from "astro:content";
import type { Category, Tag } from "@/components/Catalog/taxonomy";

export function getAllCategories(
	cards: CollectionEntry<"cards">[],
): Category[] {
	return [...new Set(cards.flatMap((card) => card.data.categories))];
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
