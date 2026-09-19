/**
 * Подсказка категорий и тегов для карточки каталога.
 *
 * Отвечает на единственный вопрос, который `draft-card-pr.yml` честно
 * оставляет человеку: чем проект является и о чем он. Модель ничего не
 * сочиняет - она расставляет вероятности по закрытым спискам из
 * `src/lib/taxonomy.ts`, поэтому в выдаче физически не может появиться
 * тег, которого нет в реестре.
 *
 * Скрипт ничего не записывает. Он печатает блок подсказок для человека,
 * который ведет карточку по чеклисту `starter-card-review`.
 *
 *   bun scripts/suggest-card-taxonomy.mjs --card 15-daqqa-author
 *   bun scripts/suggest-card-taxonomy.mjs --submission заявка.json
 *   bun scripts/suggest-card-taxonomy.mjs --eval 40
 *
 * Ключ - `TYPESAFE_API_KEY` в `.env` (bun подхватывает сам).
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { TypeSafeClient, choice, noul } from "@typesafe-ai/sdk";
import {
	CATEGORY_VALUES,
	TAG_DEFINITIONS,
	TAG_VALUES,
	categoryLabel,
	tagGroupLabel,
	tagLabel,
} from "../src/lib/taxonomy.ts";

const CARDS_DIR = "src/data/cards";

/**
 * Что значит каждая категория. В `taxonomy.ts` лежат только подписи для UI,
 * а для суждения нужна граница: категория - чем проект является, тег - о чем
 * он. Без этих формулировок модель тянется к теме («о языке» -> `language`)
 * вместо типа проекта, и разметка расходится с каталогом.
 *
 * Формулировки взяты из `starter-card-review` и `CONTEXT.md`. Разъедутся -
 * прав чеклист, а не этот файл.
 */
const CATEGORY_CRITERIA = {
	channel:
		"Регулярно обновляемая лента на чужой площадке: телеграм-канал, паблик, youtube-канал, блог в соцсети. Признак - подписка и поток публикаций, а не разовый сайт",
	author:
		"За проектом стоит конкретный человек и проект держится на нем: автор, блогер, исследователь, музыкант, художник. Ставится и тогда, когда человек ведет канал или медиа - тогда вместе со второй категорией",
	media: "Редакция или издание: журнал, газета, интернет-издание, радио, телеканал, подкаст-студия. За ним стоит коллектив и редакционный процесс, а не один человек",
	language:
		"Продукт для работы с самим языком: словарь, корпус, переводчик, клавиатура, шрифт, распознавание речи, языковой датасет. Проект просто на татарском языке или о языке сюда не относится",
	lessons:
		"Проект учит: уроки, курс, учебник, разговорник, обучающие карточки, школа. Есть тот, кто учит, и материал, по которому учатся",
	graphics:
		"Визуальное: орнамент, узор, иллюстрация, шрифтовая графика, дизайн, фотопроект, стикеры, мерч с национальной графикой",
	community:
		"Объединение людей: сообщество, клуб, движение, фестиваль, оффлайн-встречи, волонтерская инициатива",
	music: "Музыкальный проект: исполнитель, группа, лейбл, музыкальный архив или плейлист-проект",
};

/** Карточка, свернутая до того, по чему вообще можно судить о проекте. */
function cardState(card) {
	return {
		card: {
			name: card.name,
			description: card.description,
			facts: card.facts,
			url: card.url,
		},
	};
}

/**
 * Один запрос на карточку: 8 категорий и 109 тегов отдельными Noul.
 *
 * Разбивать на этапы не потребовалось - все вопросы считаются параллельно
 * и укладываются в пару секунд. Noul на каждое значение, а не один Choice,
 * потому что и категорий, и тегов у карточки бывает несколько.
 */
function taxonomyQuestions() {
	const questions = {};

	for (const category of CATEGORY_VALUES) {
		questions[`category:${category}`] = noul(
			`Чем проект из \`card\` является: подходит ли ему тип "${categoryLabel("ru", category)}"?`,
			{
				true: CATEGORY_CRITERIA[category],
				false:
					"Проект этим не является. Тема проекта сюда не считается: категория - чем проект является, а не о чем он. Если по карточке видно другой, более точный тип - этот тип ставить не нужно",
			},
		);
	}

	for (const tag of TAG_VALUES) {
		const { group } = TAG_DEFINITIONS[tag];
		questions[`tag:${tag}`] = noul(
			`Тег "${tagLabel("ru", tag)}" (группа "${tagGroupLabel("ru", group)}") описывает проект из \`card\`?`,
			{
				true: "Тег следует из `card.description` или `card.facts`. Широкие теги вроде языка, культуры или общества ставятся наравне с узкими, если проект действительно про это",
				false: "Тег не следует из карточки или притянут по далекой ассоциации",
			},
		);
	}

	return questions;
}

/** Ссылка-первоисточник выбирается из того, что прислали, а не придумывается. */
function urlQuestion(candidates) {
	const criteria = { "нет однозначной": "Ни одна из ссылок не выглядит первоисточником проекта" };
	for (const url of candidates) criteria[url] = null;

	return choice(
		"Какая ссылка ведет на сам проект-первоисточник, а не на агрегатор, репост или личную страницу автора?",
		criteria,
	);
}

function splitAnswers(answers) {
	const categories = [];
	const tags = [];

	for (const [key, answer] of Object.entries(answers)) {
		const [kind, value] = key.split(":");
		if (kind === "category") categories.push({ value, p: answer.noul });
		else if (kind === "tag") tags.push({ value, p: answer.noul });
	}

	const byProbability = (a, b) => b.p - a.p;

	return { categories: categories.sort(byProbability), tags: tags.sort(byProbability) };
}

/**
 * Порог отсечения и потолок. `starter-card-review` просит 3-6 тегов:
 * пятнадцать тегов ломают AND-фильтр, поэтому список режется и по порогу,
 * и по длине.
 *
 * Пороги низкие намеренно. Развертка `--eval` по каталогу (30 карточек)
 * показала, что подъем порога с 0.5 до 0.9 роняет recall тегов с 0.82 до
 * 0.70, а precision поднимает лишь с 0.57 до 0.71 - и то потому, что
 * потолок в 6 тегов режет список раньше порога. Это подсказка человеку, а
 * не автопростановка: лишний тег он удаляет за секунду, а пропущенный не
 * заметит вовсе, поэтому размен идет в сторону recall.
 */
const DEFAULTS = { categoryThreshold: 0.5, tagThreshold: 0.5, maxTags: 6 };

function applyThresholds(suggestion, options = DEFAULTS) {
	return {
		categories: suggestion.categories.filter((item) => item.p >= options.categoryThreshold),
		tags: suggestion.tags
			.filter((item) => item.p >= options.tagThreshold)
			.slice(0, options.maxTags),
	};
}

async function suggest(client, state, extraQuestions = {}) {
	const response = await client.systemOne({
		state,
		questions: { ...taxonomyQuestions(), ...extraQuestions },
	});

	return { ...splitAnswers(response.answers), answers: response.answers, usage: response.usage };
}

/* -------------------------------------------------------------------- */
/* Чтение карточек                                                       */
/* -------------------------------------------------------------------- */

/**
 * Разбор фронтматтера без зависимости от yaml: карточки пишутся по одному
 * узкому шаблону (строка в кавычках или список строк), и тащить парсер ради
 * него в devDependencies не за что. Упадет на чем-то сложнее - значит
 * карточка вышла за шаблон, и это стоит увидеть.
 */
function readCard(id) {
	const source = readFileSync(join(CARDS_DIR, `${id}.md`), "utf-8");
	const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
	if (!frontmatter) throw new Error(`${id}: нет фронтматтера`);

	const card = { id, facts: [], categories: [], tags: [], peoples: [] };
	let listKey = null;

	for (const line of frontmatter[1].split("\n")) {
		const item = line.match(/^\s+-\s+(.*)$/);
		if (item && listKey) {
			card[listKey].push(unquote(item[1]));
			continue;
		}

		const field = line.match(/^([a-zA-Z]+):\s*(.*)$/);
		if (!field) continue;

		const [, key, rawValue] = field;
		if (rawValue === "") {
			listKey = key;
			card[key] = [];
		} else if (rawValue.startsWith("[")) {
			listKey = null;
			card[key] = rawValue
				.slice(1, -1)
				.split(",")
				.map((part) => unquote(part.trim()))
				.filter(Boolean);
		} else {
			listKey = null;
			card[key] = unquote(rawValue);
		}
	}

	return card;
}

function unquote(value) {
	return value.replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
}

function allCardIds() {
	return readdirSync(CARDS_DIR)
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.slice(0, -3));
}

/* -------------------------------------------------------------------- */
/* Вывод                                                                 */
/* -------------------------------------------------------------------- */

const percent = (p) => p.toFixed(2);

function formatList(items) {
	return items.map((item) => `${item.value} ${percent(item.p)}`).join(" · ") || "-";
}

function renderSuggestion(picked, full) {
	const belowTags = full.tags
		.filter((item) => !picked.tags.some((kept) => kept.value === item.value))
		.slice(0, 5);

	return [
		`категории: ${formatList(picked.categories)}`,
		`теги:      ${formatList(picked.tags)}`,
		`под порогом: ${formatList(belowTags)}`,
	].join("\n");
}

/* -------------------------------------------------------------------- */
/* Режимы                                                                */
/* -------------------------------------------------------------------- */

async function runCards(client, ids) {
	for (const id of ids) {
		const card = readCard(id);
		const full = await suggest(client, cardState(card));
		const picked = applyThresholds(full);

		console.log(`\n=== ${id} ===`);
		console.log(card.description);
		console.log(renderSuggestion(picked, full));
		console.log(`в карточке: ${card.categories.join(", ")} | ${card.tags.join(", ")}`);
	}
}

async function runSubmission(client, path) {
	const fields = JSON.parse(readFileSync(path, "utf-8"));
	const byLabel = new Map(fields.map((field) => [field.label || field.key, field]));

	const text = (label) => {
		const field = byLabel.get(label);
		return typeof field?.value === "string" ? field.value.trim() : null;
	};

	const facts = fields
		.filter((field) => /^Факт|факта о проекте/i.test(field.label || ""))
		.map((field) => (typeof field.value === "string" ? field.value.trim() : null))
		.filter(Boolean);

	const linkLabels = ["Сайт", "Telegram", "Instagram", "vk.com"];
	const candidates = fields
		.filter((field) => linkLabels.includes(field.label) || /^Прочая ссылка/.test(field.label || ""))
		.map((field) => (typeof field.value === "string" ? field.value.trim() : null))
		.filter(Boolean);

	const state = {
		card: {
			name: text("Название проекта"),
			description: text("Описание проекта"),
			facts,
			url: candidates,
		},
	};

	const extra = candidates.length > 1 ? { url: urlQuestion(candidates) } : {};
	const full = await suggest(client, state, extra);
	const picked = applyThresholds(full);

	console.log("Подсказки для черновика (проверить по starter-card-review):\n");
	if (extra.url) {
		const answer = full.answers.url;
		const ranked = Object.entries(answer.probabilities)
			.sort((a, b) => b[1] - a[1])
			.map(([url, p]) => `${url} (${percent(p)})`)
			.join(" | ");
		console.log(`url: ${ranked}`);
	} else if (candidates.length === 1) {
		console.log(`url: ${candidates[0]} (единственная ссылка в заявке)`);
	} else {
		console.log("url: ссылок в заявке нет");
	}
	console.log(renderSuggestion(picked, full));
}

/**
 * Прогон по каталогу: подсказка сравнивается с тем, что человек уже
 * проставил руками. Считается не «точность модели», а пригодность подсказки:
 * сколько проставленного она предлагает (recall) и сколько лишнего
 * приносит (precision). Пороги без этих чисел не выбрать.
 */
async function runEval(client, sampleSize) {
	const ids = allCardIds();
	const step = Math.max(1, Math.floor(ids.length / sampleSize));
	const sample = ids.filter((_, index) => index % step === 0).slice(0, sampleSize);

	const collected = [];
	let tokens = 0;

	for (const id of sample) {
		const card = readCard(id);
		const full = await suggest(client, cardState(card));
		const picked = applyThresholds(full);
		tokens += full.usage.input_tokens + full.usage.output_tokens;
		collected.push({ card, full });

		const missed = card.tags.filter((tag) => !picked.tags.some((item) => item.value === tag));
		console.log(
			`${id}\n  кат: ${picked.categories.map((i) => i.value).join(",") || "-"} vs ${card.categories.join(",")}` +
				`\n  тег: ${picked.tags.map((i) => i.value).join(",") || "-"} vs ${card.tags.join(",")}` +
				(missed.length ? `\n  пропущено: ${missed.join(",")}` : ""),
		);
	}

	console.log(`\n=== ${sample.length} карточек, ${tokens} токенов ===`);
	console.log(scoreThresholds(collected));
}

/**
 * Развертка по порогам. Вероятности уже получены, поэтому перебор ничего не
 * стоит: один прогон каталога отвечает не «хорош ли порог 0.75», а «какой
 * порог выбрать». Менять порог без пересчета запросов - ровно то, ради чего
 * сырые суждения держатся отдельно от политики.
 */
function scoreThresholds(collected) {
	const rows = ["порог | кат recall/prec | тег recall/prec (потолок 6)"];

	for (const threshold of [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9]) {
		const totals = {
			category: { hit: 0, suggested: 0, actual: 0 },
			tag: { hit: 0, suggested: 0, actual: 0 },
		};

		for (const { card, full } of collected) {
			const picked = applyThresholds(full, {
				categoryThreshold: threshold,
				tagThreshold: threshold,
				maxTags: DEFAULTS.maxTags,
			});

			for (const [kind, suggested, actual] of [
				["category", picked.categories, card.categories],
				["tag", picked.tags, card.tags],
			]) {
				const values = suggested.map((item) => item.value);
				totals[kind].hit += values.filter((value) => actual.includes(value)).length;
				totals[kind].suggested += values.length;
				totals[kind].actual += actual.length;
			}
		}

		const ratio = ({ hit, suggested, actual }) =>
			`${(hit / actual).toFixed(2)}/${suggested ? (hit / suggested).toFixed(2) : "-"}`;

		rows.push(
			` ${threshold.toFixed(2)} | ${ratio(totals.category).padEnd(14)} | ${ratio(totals.tag)}`,
		);
	}

	return rows.join("\n");
}

/* -------------------------------------------------------------------- */

const args = process.argv.slice(2);
const flag = (name) => {
	const index = args.indexOf(name);
	return index === -1 ? null : (args[index + 1] ?? "");
};

if (!process.env.TYPESAFE_API_KEY) {
	console.error("Нет TYPESAFE_API_KEY. Ключ лежит в .env, запускать через bun.");
	process.exit(1);
}

const client = new TypeSafeClient({ timeout: 60000 });

if (args.includes("--card")) {
	await runCards(client, args.slice(args.indexOf("--card") + 1).filter((a) => !a.startsWith("--")));
} else if (args.includes("--submission")) {
	await runSubmission(client, flag("--submission"));
} else if (args.includes("--eval")) {
	await runEval(client, Number(flag("--eval")) || 20);
} else {
	console.error(
		"Использование:\n" +
			"  --card <id> [<id>...]     подсказка для существующей карточки, рядом с тем, что в ней уже стоит\n" +
			"  --submission <файл.json>  подсказка из JSON заявки Tally, включая выбор url\n" +
			"  --eval [N]                прогон по каталогу: recall и precision подсказки",
	);
	process.exit(1);
}
