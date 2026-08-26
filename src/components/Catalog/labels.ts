import type { CollectionEntry } from "astro:content";
import type { Tag } from "@/components/Catalog/tags";
import type { LocaleCode } from "@/config/types";
import { defaultLocale } from "@/i18n";

type CardData = CollectionEntry<"cards">["data"];
type People = CardData["peoples"][number];

/**
 * Значения enum'ов карточки — не строки словаря: они привязаны к схеме
 * коллекции, поэтому живут рядом с каталогом, а не в `src/i18n/locales/`.
 * Ключи локалей проверяются `satisfies`, так что новый тег не проедет
 * без перевода.
 */
const labels = {
	ru: {
		tag: {
			channel: "Канал",
			author: "Автор",
			media: "Медиа",
			language: "Языковой проект",
			lessons: "Уроки",
			graphics: "Графика",
			community: "Сообщество",
		},
		people: {
			tatar: "татары",
			bashkir: "башкиры",
			"crimean-tatar": "крымские татары",
		},
	},
	en: {
		tag: {
			channel: "Channel",
			author: "Author",
			media: "Media",
			language: "Language project",
			lessons: "Lessons",
			graphics: "Graphics",
			community: "Community",
		},
		people: {
			tatar: "Tatars",
			bashkir: "Bashkirs",
			"crimean-tatar": "Crimean Tatars",
		},
	},
} satisfies Record<
	string,
	{ tag: Record<Tag, string>; people: Record<People, string> }
>;

type Labels = (typeof labels)[keyof typeof labels];

function forLocale(locale: LocaleCode): Labels {
	const known: Record<string, Labels | undefined> = labels;
	return known[locale] ?? known[defaultLocale] ?? labels.ru;
}

export function tagLabel(locale: LocaleCode, tag: Tag): string {
	return forLocale(locale).tag[tag];
}

export function peopleLabel(locale: LocaleCode, people: People): string {
	return forLocale(locale).people[people];
}
