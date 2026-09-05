import { describe, expect, test } from "bun:test";
import {
	foldSearchText,
	searchHaystack,
} from "@/components/Catalog/searchText";

/*
 * Свертка - самое дорогое место каталога в случае ошибки: разъедься правила
 * запроса и строки записи, часть карточек стала бы ненаходимой, причем
 * молча. Проверяется не таблица целиком, а контракт: как бы человек ни
 * набрал название, он попадает в строку записи.
 */

describe("foldSearchText", () => {
	test("складывает башкирские буквы к базовым", () => {
		expect(foldSearchText("Ағиҙел")).toBe("агизел");
	});

	test("снимает диакритику латиницы", () => {
		expect(foldSearchText("Balaçıqlar İçün")).toBe("balaciqlar icun");
	});

	test("не трогает то, что уже свернуто", () => {
		expect(foldSearchText("ana tele")).toBe("ana tele");
	});
});

describe("searchHaystack", () => {
	test("держит оба чтения буквы: и агизел, и агидел", () => {
		const haystack = searchHaystack("Ағиҙел");

		expect(haystack).toContain("агизел");
		expect(haystack).toContain("агидел");
	});

	test("не двоит строку, когда чтение одно", () => {
		expect(searchHaystack("ana tele")).toBe("ana tele");
	});
});

describe("запрос и строка записи сходятся", () => {
	/*
	 * Главное утверждение модуля: обе стороны сравнения складываются
	 * согласованно. Первая свертка идет на сборке, вторая - в браузере, и
	 * именно их расхождение никак иначе не заметно.
	 */
	const cases = [
		["Ағиҙел", ["агидел", "агизел", "АГИДЕЛ"]],
		["Balaçıqlar İçün Resimli Luğat", ["balaciqlar", "icun", "lugat"]],
		["Ана теле", ["ана теле"]],
	];

	for (const [name, queries] of cases) {
		for (const query of queries) {
			test(`«${query}» находит «${name}»`, () => {
				expect(searchHaystack(name)).toContain(foldSearchText(query));
			});
		}
	}
});
