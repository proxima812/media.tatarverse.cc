import { getCollection } from "astro:content";
import { getAllCategories } from "@/lib/catalog/categories";
import { localizeCards } from "@/lib/catalog/localize";
import { getRelatedCards } from "@/lib/catalog/related";
import { localizeArtists, sortByName } from "@/lib/music/artists";
import type { PageLocale } from "@/lib/routes/pageLocale";

/**
 * Наборы путей для динамических маршрутов. `getStaticPaths` Astro читает
 * только в файлах `src/pages/**`, поэтому сама функция остается там, а
 * ее тело - здесь: русский и английский маршруты отличались лишь локалью,
 * и один из них уже успел разойтись с другим.
 */

/** Страницы проектов: `/projects/<id>` и `/en/projects/<id>`. */
export async function cardPaths(locale: PageLocale) {
	const cards = await localizeCards(await getCollection("cards"), locale);

	return cards.map((card) => ({
		params: { slug: card.id },
		props: { card, related: getRelatedCards(card, cards) },
	}));
}

/**
 * Страницы категорий: `/catalog/<category>` и `/en/catalog/<category>`.
 *
 * Кроме `music`: у музыки собственный каталог артистов
 * (`src/pages/catalog/music/`) по тому же адресу, поэтому общий маршрут
 * категории его бы дублировал. Из реестра категорию не убираем - она
 * остается в переключателе и ведет туда же.
 */
export async function categoryPaths(locale: PageLocale) {
	const cards = await localizeCards(await getCollection("cards"), locale);
	const categories = getAllCategories(cards);

	/*
	 * Фильтр только на адресах, не на списке в пропсах: переключатель
	 * категорий должен показывать музыку на любой странице каталога, просто
	 * ведет эта вкладка на собственный маршрут `catalog/music/index.astro`.
	 */
	return categories
		.filter((category) => category !== "music")
		.map((category) => ({
			params: { category },
			props: { category, cards, categories },
		}));
}

/** Страницы артистов: `/catalog/music/<id>` и `/en/catalog/music/<id>`. */
export async function artistPaths(locale: PageLocale) {
	const artists = sortByName(
		localizeArtists(await getCollection("artists"), locale),
		locale,
	);

	return artists.map((artist, index) => ({
		params: { artist: artist.id },
		props: {
			artist,
			/*
			 * Соседи по алфавиту вместо «похожих»: у артиста нет таксономии,
			 * по которой можно было бы посчитать близость, а тупиком страница
			 * кончаться не должна. Список закольцован - у первого и последнего
			 * соседи тоже есть.
			 */
			others: [
				artists[(index + 1) % artists.length],
				artists[(index + 2) % artists.length],
				artists[(index + 3) % artists.length],
			].filter(
				/*
				 * Явный type predicate: без него `undefined` остается в типе
				 * соседей, и `astro check` роняет сборку на странице артиста.
				 */
				(other): other is (typeof artists)[number] =>
					other !== undefined && other.id !== artist.id,
			),
		},
	}));
}

/**
 * Текстовые страницы: набор известен на сборке и приходит из коллекции -
 * `pages` для русской, `pagesEn` для английской. Это зеркальные коллекции,
 * а не перевод поверх записи, поэтому имя коллекции - аргумент.
 */
export async function mdxPagePaths(collection: "pages" | "pagesEn") {
	const entries = await getCollection(collection);

	return entries.map((entry) => ({
		params: { page: entry.id },
		props: { entry },
	}));
}
