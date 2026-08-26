import type { CollectionEntry } from "astro:content";

export type Tag = CollectionEntry<"cards">["data"]["tags"][number];

/**
 * Теги, у которых есть карточки, в порядке первого появления в каталоге:
 * фиксированный список пришлось бы править вручную при каждом новом теге.
 * Используется и тулбаром (порядок вкладок), и `getStaticPaths` тег-страниц
 * (какие `/catalog/<tag>` вообще собирать) — расхождения быть не может, раз
 * источник один.
 */
export function getAllTags(cards: CollectionEntry<"cards">[]): Tag[] {
	return [...new Set(cards.flatMap((card) => card.data.tags))] as Tag[];
}

export function cardsByTag(
	cards: CollectionEntry<"cards">[],
	tag: Tag,
): CollectionEntry<"cards">[] {
	return cards.filter((card) => card.data.tags.includes(tag));
}
