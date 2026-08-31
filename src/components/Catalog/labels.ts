import type { CollectionEntry } from "astro:content";
import {
	type Category,
	type Tag,
	type TagGroup,
	categoryLabel as taxonomyCategoryLabel,
	tagGroupLabel as taxonomyTagGroupLabel,
	tagLabel as taxonomyTagLabel,
} from "@/components/Catalog/taxonomy";
import type { LocaleCode } from "@/config/types";
import { defaultLocale } from "@/i18n";

type CardData = CollectionEntry<"cards">["data"];
type People = CardData["peoples"][number];

/**
 * Значения enum'ов карточки - не строки словаря: они привязаны к схеме
 * коллекции, поэтому живут рядом с каталогом, а не в `src/i18n/locales/`.
 * Ключи локалей проверяются `satisfies`, так что новый тег не проедет
 * без перевода.
 */
const labels = {
	ru: {
		people: {
			tatar: "татары",
			bashkir: "башкиры",
			"crimean-tatar": "крымские татары",
		},
	},
	en: {
		people: {
			tatar: "Tatars",
			bashkir: "Bashkirs",
			"crimean-tatar": "Crimean Tatars",
		},
	},
} satisfies Record<string, { people: Record<People, string> }>;

type Labels = (typeof labels)[keyof typeof labels];

function forLocale(locale: LocaleCode): Labels {
	const known: Record<string, Labels | undefined> = labels;
	return known[locale] ?? known[defaultLocale] ?? labels.ru;
}

export function tagLabel(locale: LocaleCode, tag: Tag): string {
	return taxonomyTagLabel(locale === "en" ? "en" : "ru", tag);
}

export function categoryLabel(locale: LocaleCode, category: Category): string {
	return taxonomyCategoryLabel(locale === "en" ? "en" : "ru", category);
}

export function tagGroupLabel(locale: LocaleCode, group: TagGroup): string {
	return taxonomyTagGroupLabel(locale === "en" ? "en" : "ru", group);
}

export function peopleLabel(locale: LocaleCode, people: People): string {
	return forLocale(locale).people[people];
}
