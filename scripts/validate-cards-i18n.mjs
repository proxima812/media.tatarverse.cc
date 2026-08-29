import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/**
 * Проверяет, что у каждой карточки `src/data/cards/<id>.md` есть перевод
 * `src/data/cards-en/<id>.md`. Карточки, добавленные до этого правила,
 * перечислены в `scripts/cards-i18n-baseline.json` - список только
 * сокращается по мере перевода, никогда не пополняется. Отсутствующий
 * перевод у id не из baseline - ошибка сборки: новая карточка обязана
 * сразу приходить с EN-версией.
 */

const root = process.cwd();
const cardsDir = path.join(root, "src/data/cards");
const cardsEnDir = path.join(root, "src/data/cards-en");
const baselinePath = path.join(root, "scripts/cards-i18n-baseline.json");

const ids = async (dir) =>
	(await readdir(dir))
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.replace(/\.md$/, ""))
		.sort();

const cardIds = await ids(cardsDir);
const translatedIds = new Set(await ids(cardsEnDir));
const baseline = new Set(JSON.parse(await readFile(baselinePath, "utf8")));

const missing = cardIds.filter((id) => !translatedIds.has(id));
const newUntranslated = missing.filter((id) => !baseline.has(id));
const legacyUntranslated = missing.filter((id) => baseline.has(id));

if (legacyUntranslated.length > 0) {
	console.warn(
		`[i18n] ${legacyUntranslated.length} карточка(и) без EN-перевода из baseline (переводим постепенно, не блокирует сборку).`,
	);
}

if (newUntranslated.length > 0) {
	console.error(
		`[i18n] Новые карточки без перевода в src/data/cards-en/ (см. правило в AGENTS.md):\n${newUntranslated
			.map((id) => `  - ${id}`)
			.join("\n")}`,
	);
	process.exit(1);
}

console.log(
	`[i18n] ${cardIds.length - missing.length}/${cardIds.length} карточек переведено на EN, новых без перевода нет.`,
);
