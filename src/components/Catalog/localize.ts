import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { LocaleCode } from "@/config/types";

/**
 * Перевод одной карточки: только текст. `url`, `logo`, `categories`, `tags` и
 * `peoples` от языка не зависят и берутся из русской записи - см. схему
 * `cardsEn` в `src/content.config.ts`.
 */
type CardTranslation = CollectionEntry<"cardsEn">["data"];

/**
 * Накладывает перевод на карточки по совпадению id. Нет перевода для карточки
 * - она остается на русском: показать непереведенный текст полезнее, чем
 * сломать страницу.
 *
 * Функция чистая и принимает переводы аргументом - это внутренний шов
 * `localizeCards`: правило наложения можно проверить двумя записями в памяти,
 * не поднимая сборку Astro ради чтения коллекции.
 */
export function overlayTranslations(
	cards: CollectionEntry<"cards">[],
	translations: Map<string, CardTranslation>,
): CollectionEntry<"cards">[] {
	return cards.map((card) => {
		const translation = translations.get(card.id);
		if (!translation) return card;

		return { ...card, data: { ...card.data, ...translation } };
	});
}

/**
 * Карточки для локали. Для русской возвращает список как есть, поэтому
 * вызывать можно безусловно - страницам не нужно помнить, что перевод
 * накладывают только английские.
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
