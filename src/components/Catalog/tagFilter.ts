import type { Tag } from "@/components/Catalog/taxonomy";

export function parseTagQuery(
	raw: string | null,
	available: readonly Tag[],
): Tag[] {
	if (!raw) return [];

	const known = new Set<string>(available);
	const selected = new Set<Tag>();

	for (const value of raw.split(",")) {
		if (known.has(value)) selected.add(value as Tag);
	}

	return [...selected];
}

export function cardsWithAllTags<
	T extends { readonly data: { readonly tags: readonly Tag[] } },
>(cards: readonly T[], selected: readonly Tag[]): T[] {
	return cards.filter((card) =>
		selected.every((value) => card.data.tags.includes(value)),
	);
}
