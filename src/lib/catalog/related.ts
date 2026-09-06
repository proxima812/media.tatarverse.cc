import type { CollectionEntry } from "astro:content";

/**
 * Категория описывает тип проекта и весит 3 балла. Тег дает 2, общий народ - 1.
 */
function similarity(
	card: CollectionEntry<"cards">,
	other: CollectionEntry<"cards">,
): number {
	const sharedPeoples = other.data.peoples.filter((people) =>
		card.data.peoples.includes(people),
	).length;
	const sharedCategories = other.data.categories.filter((category) =>
		card.data.categories.includes(category),
	).length;
	const sharedTags = other.data.tags.filter((tag) =>
		card.data.tags.includes(tag),
	).length;

	return sharedPeoples + sharedTags * 2 + sharedCategories * 3;
}

export function getRelatedCards(
	card: CollectionEntry<"cards">,
	cards: CollectionEntry<"cards">[],
	limit = 3,
): CollectionEntry<"cards">[] {
	return cards
		.filter((other) => other.id !== card.id)
		.map((other) => ({ card: other, score: similarity(card, other) }))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ card: other }) => other);
}
