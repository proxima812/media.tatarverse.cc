import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { overlayTranslations } from "@/components/Catalog/overlay";
import type { LocaleCode } from "@/config/types";

/**
 * Карточки для локали. Для русской возвращает список как есть, поэтому
 * вызывать можно безусловно - страницам не нужно помнить, что перевод
 * накладывают только английские.
 *
 * Чтение коллекции - здесь, само правило наложения - в `overlay.ts`: этот
 * модуль без сборки Astro не выполнить, а тот проверяется тестом.
 */
export async function localizeCards(
	cards: CollectionEntry<"cards">[],
	locale: LocaleCode,
): Promise<CollectionEntry<"cards">[]> {
	if (locale !== "en") return cards;

	const entries = await getCollection("cardsEn");

	return overlayTranslations(
		cards,
		new Map(entries.map((entry) => [entry.id, entry.data])),
	);
}
