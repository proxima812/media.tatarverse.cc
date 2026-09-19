import type { CollectionEntry } from "astro:content";
import { peopleLabel } from "@/lib/catalog/labels";
import { searchHaystack } from "@/lib/catalog/searchText";
import { categoryLabel, tagLabel } from "@/lib/taxonomy";
import type { LocaleCode } from "@/config/types";

/** Группы и карточки отсортированы по локали; группа символов идет последней. */
export function prepareGlossary(
	cards: readonly CollectionEntry<"cards">[],
	locale: LocaleCode,
) {
	const collator = new Intl.Collator(locale, { sensitivity: "base" });
	const isLetter = (char: string) =>
		char.toLocaleLowerCase(locale) !== char.toLocaleUpperCase(locale);

	function groupKey(name: string): string {
		// Пропускаем кавычки и пунктуацию перед первой буквой или цифрой.
		const first = [...name].find(
			(char) => isLetter(char) || (char >= "0" && char <= "9"),
		);
		return first && isLetter(first) ? first.toLocaleUpperCase(locale) : "#";
	}

	const sorted = [...cards].sort((a, b) =>
		collator.compare(a.data.name, b.data.name),
	);
	const groups = new Map<string, CollectionEntry<"cards">[]>();
	for (const card of sorted) {
		const letter = groupKey(card.data.name);
		const bucket = groups.get(letter);
		if (bucket) bucket.push(card);
		else groups.set(letter, [card]);
	}

	return [...groups]
		.sort(([a], [b]) => {
			if (a === b) return 0;
			if (a === "#") return 1;
			if (b === "#") return -1;
			return collator.compare(a, b);
		})
		.map(([letter, cards], index) => ({
			letter,
			// Сохраняем числовые якоря, чтобы URL не зависел от кодирования букв.
			anchor: `glossary-${index}`,
			cards: cards.map((card) => ({
				card,
				search: searchIndex(card, locale),
				searchName: searchHaystack(card.data.name),
			})),
		}));
}

function searchIndex(card: CollectionEntry<"cards">, locale: LocaleCode): string {
	const { name, description, categories, tags, peoples } = card.data;

	const parts = [
		name,
		description,
		...categories.map((category) => categoryLabel(locale, category)),
		...tags.map((tag) => tagLabel(locale, tag)),
		...peoples.map((people) => peopleLabel(locale, people)),
	];

	return searchHaystack(parts.join(" "));
}
