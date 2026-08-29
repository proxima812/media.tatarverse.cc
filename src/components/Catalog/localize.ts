import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { LocaleCode } from "@/config/types";

/**
 * Накладывает перевод из `cardsEn` на карточки `cards` по совпадению id.
 * Нет перевода для карточки - она остается на русском (лучше показать
 * непереведенный текст, чем сломать страницу).
 */
export async function localizeCards(
	cards: CollectionEntry<"cards">[],
	locale: LocaleCode,
): Promise<CollectionEntry<"cards">[]> {
	if (locale !== "en") return cards;

	const translations = await getCollection("cardsEn");
	const byId = new Map(translations.map((entry) => [entry.id, entry.data]));

	return cards.map((card) => {
		const translation = byId.get(card.id);
		if (!translation) return card;

		return { ...card, data: { ...card.data, ...translation } };
	});
}
