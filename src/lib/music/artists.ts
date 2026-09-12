import type { CollectionEntry } from "astro:content";
import type { PageLocale } from "@/lib/routes/pageLocale";

export type Artist = CollectionEntry<"artists">;
export type Track = Artist["data"]["tracks"][number];

/**
 * Подмена имени и описания под локаль. У карточек проектов перевод лежит
 * отдельной коллекцией (`cards-en`), потому что там переводится целый абзац
 * текста и несколько фактов. У артиста переводимого текста два поля, и
 * зеркальная коллекция из тридцати файлов с одной строкой в каждом стоила бы
 * дороже, чем польза от нее, - поэтому перевод лежит рядом, в `nameEn`
 * и `descriptionEn`.
 */
export function localizeArtist(artist: Artist, locale: PageLocale): Artist {
	if (locale !== "en") return artist;

	return {
		...artist,
		data: {
			...artist.data,
			name: artist.data.nameEn ?? artist.data.name,
			description: artist.data.descriptionEn ?? artist.data.description,
		},
	};
}

export function localizeArtists(
	artists: Artist[],
	locale: PageLocale,
): Artist[] {
	return artists.map((artist) => localizeArtist(artist, locale));
}

/**
 * Порядок в каталоге - по имени средствами локали: в русском списке
 * кириллица и латиница иначе разъехались бы двумя блоками по кодам символов.
 */
export function sortByName(artists: Artist[], locale: PageLocale): Artist[] {
	const collator = new Intl.Collator(locale, { sensitivity: "base" });

	return [...artists].sort((a, b) =>
		collator.compare(a.data.name, b.data.name),
	);
}

/**
 * Что кладется в буфер по кнопке у трека. Ссылка, если она есть, - ее можно
 * сразу открыть или переслать. Нет ссылки - «Артист — Трек»: с этой строкой
 * трек находится в любом стриминге поиском.
 */
export function trackClipboardText(artistName: string, track: Track): string {
	return track.url ?? `${artistName} — ${track.title}`;
}
