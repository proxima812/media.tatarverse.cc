import { auroraGradient } from "@/utils/lib/generators/auroraGradient";
import { beamGradient } from "@/utils/lib/generators/beamGradient";
import { blobGradient } from "@/utils/lib/generators/blobGradient";
import { growGradient } from "@/utils/lib/generators/growGradient";
import { weaveGradient } from "@/utils/lib/generators/weaveGradient";

export {
	auroraGradient,
	beamGradient,
	blobGradient,
	growGradient,
	weaveGradient,
};

/** Все генераторы разом - для витрины на `/dev/gradients` и выбора по имени. */
export interface GradientGenerator {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly generate: (seed: string) => string;
}

export const GRADIENT_GENERATORS: readonly GradientGenerator[] = [
	{
		id: "blob",
		title: "blob",
		description:
			"Органическая клякса: доминирующее пятно с рваным контуром и пустое поле подложки напротив.",
		generate: blobGradient,
	},
	{
		id: "grow",
		title: "grow",
		description:
			"Кольца от смещенной точки роста: каждое следующее шире предыдущего, поэтому центр плотный, край разрежен.",
		generate: growGradient,
	},
	{
		id: "beam",
		title: "beam",
		description:
			"Веер секторов из точки у края плашки, ширины секторов разные, в вершине - мягкое свечение.",
		generate: beamGradient,
	},
	{
		id: "weave",
		title: "weave",
		description:
			"Две системы полос под разными углами; верхняя полупрозрачна, поэтому на пересечениях получается ткань.",
		generate: weaveGradient,
	},
	{
		id: "aurora",
		title: "aurora",
		description:
			"Вытянутые ленты света вдоль общей оси: ближние светлее и тоньше, дальние глубже и шире.",
		generate: auroraGradient,
	},
];
