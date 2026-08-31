import { describe, expect, test } from "bun:test";
import {
	cardsWithAllTags,
	parseTagQuery,
} from "@/components/Catalog/tagFilter";

describe("parseTagQuery", () => {
	test("keeps valid unique tags in query order", () => {
		expect(parseTagQuery("poet,music,unknown,poet", ["poet", "music"])).toEqual(
			["poet", "music"],
		);
	});

	test("returns no selection for an empty query", () => {
		expect(parseTagQuery(null, ["poet", "music"])).toEqual([]);
	});
});

describe("cardsWithAllTags", () => {
	test("requires every selected tag", () => {
		const cards = [
			{ id: "both", data: { tags: ["poet", "music"] } },
			{ id: "one", data: { tags: ["poet"] } },
		];

		expect(
			cardsWithAllTags(cards, ["poet", "music"]).map((card) => card.id),
		).toEqual(["both"]);
	});

	test("keeps every card when no tag is selected", () => {
		const cards = [
			{ id: "poetry", data: { tags: ["poet"] } },
			{ id: "music", data: { tags: ["music"] } },
		];

		expect(cardsWithAllTags(cards, []).map((card) => card.id)).toEqual([
			"poetry",
			"music",
		]);
	});
});
