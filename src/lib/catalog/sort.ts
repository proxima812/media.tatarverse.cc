import type { CollectionEntry } from "astro:content";

/**
 * Карточки в порядке добавления в каталог - от новых к старым. По умолчанию
 * `getCollection` отдает записи в алфавитном порядке id, из-за чего новая
 * карточка теряется где-то в середине списка. Сортировка не мутирует вход:
 * тот же массив используют счетчики тегов и категорий.
 *
 * Одинаковые `pubDate` - обычная ситуация при пакетном импорте, поэтому
 * ничья разрешается по id, чтобы порядок был стабильным между сборками.
 */
export function sortByPubDate(
	cards: CollectionEntry<"cards">[],
): CollectionEntry<"cards">[] {
	return [...cards].sort((a, b) => {
		const diff = b.data.pubDate.getTime() - a.data.pubDate.getTime();
		return diff !== 0 ? diff : a.id.localeCompare(b.id);
	});
}
