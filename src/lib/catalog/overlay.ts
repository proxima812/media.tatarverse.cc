import type { CollectionEntry } from "astro:content";

/**
 * Правило наложения перевода на карточку - отдельным модулем от
 * `localize.ts`, и это не эстетика: `localize.ts` импортирует `getCollection`
 * из `astro:content`, а такой модуль нельзя выполнить вне сборки Astro.
 * Здесь только импорт типа, который стирается компиляцией, поэтому правило
 * проверяется двумя записями в памяти.
 */

/**
 * Перевод одной карточки: только текст. `url`, `logo`, `categories`, `tags` и
 * `peoples` от языка не зависят и берутся из русской записи - см. схему
 * `cardsEn` в `src/content.config.ts`.
 */
export type CardTranslation = CollectionEntry<"cardsEn">["data"];

/**
 * Накладывает перевод на карточки по совпадению id. Нет перевода для карточки
 * - она остается на русском: показать непереведенный текст полезнее, чем
 * сломать страницу.
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
