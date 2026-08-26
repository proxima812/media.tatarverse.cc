import type { CollectionEntry } from "astro:content";

/**
 * Похожесть = 2 балла за каждый общий тег + 1 балл за каждый общий народ.
 * Тег весит больше: у канала и языкового проекта одного народа общего
 * меньше, чем у двух каналов.
 */
function similarity(
	card: CollectionEntry<"cards">,
	other: CollectionEntry<"cards">,
): number {
	const sharedPeoples = other.data.peoples.filter((people) =>
		card.data.peoples.includes(people),
	).length;
	const sharedTags = other.data.tags.filter((tag) =>
		card.data.tags.includes(tag),
	).length;

	return sharedPeoples + sharedTags * 2;
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
