import { describe, expect, test } from "bun:test";
import { getRelatedCards } from "@/components/Catalog/related";

describe("getRelatedCards", () => {
	test("ranks a shared category above one shared tag or people", () => {
		const source = {
			id: "source",
			data: { categories: ["author"], tags: ["poetry"], peoples: ["tatar"] },
		};
		const cards = [
			source,
			{
				id: "people",
				data: { categories: ["media"], tags: ["news"], peoples: ["tatar"] },
			},
			{
				id: "tag",
				data: { categories: ["media"], tags: ["poetry"], peoples: ["bashkir"] },
			},
			{
				id: "category",
				data: { categories: ["author"], tags: ["music"], peoples: ["bashkir"] },
			},
		];

		expect(getRelatedCards(source, cards).map((card) => card.id)).toEqual([
			"category",
			"tag",
			"people",
		]);
	});
});
