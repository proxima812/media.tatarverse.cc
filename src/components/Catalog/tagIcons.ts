import type { Tag } from "@/components/Catalog/tags";

/**
 * Значок на тег — набор `mdi` (тот же, что уже используется в `Footer.astro`,
 * пакет `@iconify-json/mdi` уже установлен). Ключи те же, что в `labels.ts`,
 * поэтому новый тег в схеме сразу подсветит недостающую иконку через `satisfies`.
 */
const TAG_ICONS = {
	channel: "mdi:broadcast",
	author: "mdi:account-edit-outline",
	media: "mdi:newspaper-variant-outline",
	language: "mdi:translate",
	lessons: "mdi:school-outline",
	graphics: "mdi:palette-outline",
	community: "mdi:account-group-outline",
} satisfies Record<Tag, string>;

export function tagIcon(tag: Tag): string {
	return TAG_ICONS[tag];
}
