import { describe, expect, test } from "bun:test";
import { overlayTranslations } from "@/components/Catalog/overlay";

/*
 * Правило наложения перевода: русская карточка - источник истины, из
 * английского файла приходит только текст. Раньше это утверждение жило
 * комментарием, потому что localizeCards сам читал коллекцию и проверить
 * его без сборки было нельзя.
 */

const card = {
	id: "ana-tele-language",
	data: {
		name: "Ана теле",
		description: "Курсы татарского языка",
		facts: ["Онлайн", "Бесплатно", "С 2013 года"],
		url: "https://anatele.ef.com/",
		tags: ["language", "education"],
		peoples: ["tatar"],
	},
};

describe("overlayTranslations", () => {
	test("подменяет только переведенный текст", () => {
		const [result] = overlayTranslations(
			[card],
			new Map([
				[
					"ana-tele-language",
					{
						name: "Ana tele",
						description: "Tatar language courses",
						facts: ["Online", "Free", "Since 2013"],
					},
				],
			]),
		);

		expect(result.data.name).toBe("Ana tele");
		expect(result.data.facts).toEqual(["Online", "Free", "Since 2013"]);
	});

	test("не зависящие от языка поля берутся из русской записи", () => {
		const [result] = overlayTranslations(
			[card],
			new Map([["ana-tele-language", { name: "Ana tele" }]]),
		);

		expect(result.data.url).toBe("https://anatele.ef.com/");
		expect(result.data.tags).toEqual(["language", "education"]);
		expect(result.data.peoples).toEqual(["tatar"]);
	});

	test("без перевода карточка остается русской, а не пропадает", () => {
		const result = overlayTranslations([card], new Map());

		expect(result).toHaveLength(1);
		expect(result[0].data.name).toBe("Ана теле");
	});

	test("исходная карточка не мутируется", () => {
		overlayTranslations(
			[card],
			new Map([["ana-tele-language", { name: "Ana tele" }]]),
		);

		expect(card.data.name).toBe("Ана теле");
	});
});
