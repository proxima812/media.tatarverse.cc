import type { CollectionEntry } from "astro:content";
import type { LocaleCode } from "@/config/types";
import { defaultLocale } from "@/i18n";

type CardData = CollectionEntry<"cards">["data"];
type People = CardData["peoples"][number];

/**
 * Подписи народов. Остальные значения enum'ов карточки (категории, теги,
 * группы тегов) живут в `taxonomy.ts` вместе с самим реестром; народы -
 * отдельный enum схемы, поэтому их карта здесь.
 *
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

export function peopleLabel(locale: LocaleCode, people: People): string {
	return forLocale(locale).people[people];
}
