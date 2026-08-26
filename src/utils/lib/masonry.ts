/**
 * Раскладка карточек по колонкам через реальные DOM-узлы, а не CSS `columns`.
 * У `columns` элементы заполняют колонку целиком сверху вниз (1, 2, 3 — все
 * в первой колонке, 4 — только потом во второй), поэтому порядок чтения идёт
 * вниз-потом-вбок, а не по строкам, как в обычной сетке. Раскладка по
 * колонкам-round-robin (0 → колонка 0, 1 → колонка 1, …) даёт порядок как в
 * `grid-auto-flow`, при этом каждая колонка остаётся независимым flex-потоком
 * и высоты карточек не выравниваются между колонками.
 *
 * Адаптировано из https://github.com/OlivierEstevez/astro-masonry (MIT,
 * Olivier Estévez) под инкрементальную вставку: каталог подгружает карточки
 * порциями по скроллу (см. `CatalogGrid.astro`), поэтому вместо однократной
 * раскладки всего списка при инициализации класс поддерживает `addItem` —
 * карточки можно добавлять по одной, по мере появления.
 */

/** `default` — число колонок по умолчанию, остальные ключи — «ширина вьюпорта ≤ N» → число колонок. */
export interface MasonryBreakpoints {
	default: number;
	[maxWidthPx: number]: number;
}

function throttle(fn: () => void, delayMs: number): () => void {
	let scheduled = false;

	return () => {
		if (scheduled) return;
		scheduled = true;
		setTimeout(() => {
			scheduled = false;
			fn();
		}, delayMs);
	};
}

export class MasonryGrid {
	private readonly container: HTMLElement;
	private readonly breakpoints: MasonryBreakpoints;
	private columns: HTMLElement[] = [];
	private items: HTMLElement[] = [];
	private columnCount: number;

	constructor(container: HTMLElement, breakpoints: MasonryBreakpoints) {
		this.container = container;
		this.breakpoints = breakpoints;
		this.columnCount = this.resolveColumnCount();
		this.buildColumns();

		window.addEventListener(
			"resize",
			throttle(() => this.handleResize(), 200),
		);
	}

	/** Кладёт карточку в следующую по кругу колонку и запоминает её для будущего пересчёта при ресайзе. */
	addItem(item: HTMLElement): void {
		const column = this.columns[this.items.length % this.columnCount];
		column?.appendChild(item);
		this.items.push(item);
	}

	private resolveColumnCount(): number {
		const width = window.innerWidth;
		const thresholds = Object.keys(this.breakpoints)
			.filter((key) => key !== "default")
			.map(Number)
			.sort((a, b) => a - b);

		for (const threshold of thresholds) {
			if (width <= threshold)
				return this.breakpoints[threshold] ?? this.breakpoints.default;
		}

		return this.breakpoints.default;
	}

	private buildColumns(): void {
		this.container.innerHTML = "";
		this.columns = Array.from({ length: this.columnCount }, () => {
			const column = document.createElement("div");
			column.className = "flex min-w-0 flex-1 flex-col gap-8";
			this.container.appendChild(column);
			return column;
		});
	}

	private handleResize(): void {
		const nextColumnCount = this.resolveColumnCount();
		if (nextColumnCount === this.columnCount) return;

		this.columnCount = nextColumnCount;
		const items = this.items;
		this.items = [];
		this.buildColumns();
		for (const item of items) this.addItem(item);
	}
}
