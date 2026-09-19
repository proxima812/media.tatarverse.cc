import { onResize } from "@/lib/ui/dom";
import Fuse from "fuse.js";
import { foldSearchText } from "@/lib/catalog/searchText";

export function initAlphabeticalCatalog() {
	/* Индекс и запрос используют одинаковую нормализацию букв. */

	/* После фильтрации пересчитываем позиции секций для подсветки алфавита. */
	const sections = [
		...document.querySelectorAll<HTMLElement>("[data-glossary-section]"),
	];
	const items = [
		...document.querySelectorAll<HTMLElement>("[data-glossary-item]"),
	];
	const jumps = [
		...document.querySelectorAll<HTMLElement>("[data-glossary-jump]"),
	];
	const railLinks = new Map(
		[
			...document.querySelectorAll<HTMLAnchorElement>(
				"[data-glossary-rail-link]",
			),
		].map((link) => [link.dataset.glossaryRailLink ?? "", link]),
	);
	const empty = document.querySelector<HTMLElement>("[data-glossary-empty]");
	const input = document.querySelector<HTMLInputElement>(
		"[data-glossary-search]",
	);
	const clearButton = document.querySelector<HTMLButtonElement>(
		"[data-glossary-search-clear]",
	);

	/** Линия отсчета для активной буквы - сразу под фиксированной шапкой. */
	const HEADER_OFFSET = 160;

	const rail = document.querySelector<HTMLElement>("[data-glossary-rail]");
	let current = "";
	let offsets: Array<{ letter: string; top: number }> = [];

	/* Геометрию читаем после фильтрации и resize, а не на каждом scroll. */
	const measure = () => {
		offsets = sections
			.filter((section) => !section.hidden)
			.map((section) => {
				let top = 0;
				let node: HTMLElement | null = section;
				while (node) {
					top += node.offsetTop;
					node = node.offsetParent as HTMLElement | null;
				}
				return { letter: section.dataset.glossarySection ?? "", top };
			});
	};

	const setCurrent = (letter: string) => {
		if (letter === current) return;
		railLinks.get(current)?.removeAttribute("aria-current");

		const link = railLinks.get(letter);
		link?.setAttribute("aria-current", "true");
		current = letter;

		/* scrollIntoView прокрутил бы и страницу; двигаем только рельс. */
		if (!rail || !link || rail.scrollHeight <= rail.clientHeight) return;
		const offset = link.offsetTop - rail.clientHeight / 2 + link.offsetHeight / 2;
		rail.scrollTo({ top: offset, behavior: "smooth" });
	};

	const updateCurrent = () => {
		const line = window.scrollY + HEADER_OFFSET;

		let letter = offsets[0]?.letter ?? "";
		for (const entry of offsets) {
			if (entry.top > line) break;
			letter = entry.letter;
		}

		if (letter) setCurrent(letter);
	};

	/* Название имеет больший вес, чем описание и теги. */
	const records = items.map((item, index) => ({
		index,
		name: item.dataset.searchName ?? "",
		text: item.dataset.search ?? "",
	}));

	const fuse = new Fuse(records, {
		keys: [
			{ name: "name", weight: 3 },
			{ name: "text", weight: 1 },
		],
		/* Совпадение может находиться в любой части строки. */
		ignoreLocation: true,
		threshold: 0.34,
		minMatchCharLength: 2,
	});

	/* Короткие токены ищем точно: нечеткий поиск дает слишком много совпадений. */
	const FUZZY_MIN_LENGTH = 3;

	/** Индексы записей, подходящих одному слову запроса. */
	const matchToken = (token: string): Set<number> => {
		const matched = new Set<number>();

		/* Точное вхождение сохраняем, даже если Fuse отверг его по порогу. */
		for (const record of records) {
			if (record.text.includes(token)) matched.add(record.index);
		}

		if (token.length >= FUZZY_MIN_LENGTH) {
			for (const result of fuse.search(token)) matched.add(result.item.index);
		}

		return matched;
	};

	/* Карточка должна подходить каждому слову запроса. */
	const applyQuery = (raw: string) => {
		const tokens = foldSearchText(raw).split(/\s+/).filter(Boolean);

		if (tokens.length === 0) {
			for (const item of items) item.hidden = false;
		} else {
			const matched = tokens
				.map(matchToken)
				.reduce((acc, set) => new Set([...acc].filter((i) => set.has(i))));

			for (const [index, item] of items.entries()) {
				item.hidden = !matched.has(index);
			}
		}

		const shown = new Set<string>();
		for (const section of sections) {
			const visible = section.querySelector("[data-glossary-item]:not([hidden])");
			section.hidden = !visible;
			if (visible) shown.add(section.dataset.glossarySection ?? "");
		}

		/* Буквы без совпадений уходят и из рельса, и из ленты на узком экране. */
		for (const jump of jumps) {
			jump.hidden = !shown.has(jump.dataset.glossaryJump ?? "");
		}

		if (empty) empty.hidden = shown.size > 0;
		if (clearButton) clearButton.hidden = tokens.length === 0;

		measure();
		updateCurrent();
	};

	/** Одно обновление на кадр: событий скролла приходит заметно больше. */
	let scheduled = false;
	const onScroll = () => {
		if (scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => {
			scheduled = false;
			updateCurrent();
		});
	};

	measure();
	updateCurrent();

	document.addEventListener("scroll", onScroll, { passive: true });
	onResize(() => {
		measure();
		updateCurrent();
	});

	if (input) {
		/* При возврате назад браузер может восстановить запрос. */
		if (input.value) applyQuery(input.value);

		input.addEventListener("input", () => applyQuery(input.value));
		input.addEventListener("keydown", (event) => {
			if (event.key !== "Escape" || !input.value) return;
			input.value = "";
			applyQuery("");
		});
	}

	clearButton?.addEventListener("click", () => {
		if (!input) return;
		input.value = "";
		applyQuery("");
		input.focus();
	});
}
