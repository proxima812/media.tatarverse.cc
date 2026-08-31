import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	CATEGORY_VALUES,
	TAG_VALUES,
} from "../src/components/Catalog/taxonomy.ts";

const cardsDir = fileURLToPath(new URL("../src/data/cards/", import.meta.url));
const categories = new Set(CATEGORY_VALUES);
const allowedTags = new Set(TAG_VALUES);
const roleTags = new Set(TAG_VALUES.slice(0, 28));

const rules = [
	["blogger", /блогер|блогерк|видеоблогер|тиктокер|инстаблогер/i],
	["journalist", /журналист/i],
	["editor", /редактор/i],
	["writer", /писател|писательниц|литератор/i],
	["poet", /поэт|поэтесс/i],
	["playwright", /драматург/i],
	["translator", /литератора-переводчик|переводчик[,а-я\s]/i],
	["teacher", /педагог|учител|преподавател/i],
	["linguist", /лингвист/i],
	["researcher", /исследовател/i],
	["historian", /историк/i],
	["local-historian", /краевед/i],
	["musician", /музыкант|пианист|скрипач|мультиинструменталист/i],
	["performer", /певец|певиц|исполнител/i],
	["songwriter", /автор \u043fесен|пишет \u043fесн/i],
	["composer", /композитор/i],
	["producer", /продюсер/i],
	["director", /режиссер/i],
	["actor", /(?:^|[^а-я])актер|актрис/i],
	[
		"presenter",
		/телеведущ|радиоведущ|работает ведущ|ведущ(?:ий|ая) (?:фестивал|мероприят|программ)/i,
	],
	["podcaster", /подкастер/i],
	["artist", /художник|художниц/i],
	["illustrator", /иллюстратор/i],
	["designer", /дизайнер|дизайнерк/i],
	["photographer", /фотограф/i],
	["craftsperson", /ремесленник|мастериц/i],
	["developer", /разработчик|инженер по машинному/i],
	["activist", /активист|общественн(?:ый|ая) деятел/i],
	["language", /язык|языков|грамматик|лингвист/i],
	["literature", /литератур|литературн|проз|писател|книжн/i],
	["poetry", /поэз|стих|поэт/i],
	["music", /музык|пес(?:н|ен)|певец|певиц|альбом|трек|радио/i],
	["history", /истори|историч|археолог/i],
	["culture", /культур|культурн/i],
	["traditions", /традиц|обыча|национальной одежд/i],
	["folklore", /фольклор|народн(?:ая|ые|ых) пес/i],
	["heritage", /наследи|памятник|архив/i],
	["identity", /идентичн|культурные корни|национальная жизнь/i],
	["religion", /ислам|мусульман|мечет|религи/i],
	["education", /образован|урок|учебн|курс|школ/i],
	["science", /наук|научн/i],
	["news", /новост|новостн|информационное агентств/i],
	["politics", /политик|общественно-политич/i],
	["society", /обществ|общин|сообществ|ассоциац|конгресс/i],
	["travel", /путешест|туризм|тревел|travel/i],
	["cuisine", /кухн|рецепт|блюд/i],
	[
		"fashion",
		/(?:^|[^а-я])мод(?:а|е|у|ой)(?:[^а-я]|$)|модн|одежд|вышивк|бренд/i,
	],
	["art", /искусств|художник|живопис|график|каллиграф|керамик/i],
	["design", /дизайн|орнамент|шрифт/i],
	["architecture", /архитектур/i],
	["theatre", /театр|спектакл/i],
	["cinema", /кино|фильм|документалист/i],
	["humor", /юмор|юморист|скетч|комеди|стендап|парод/i],
	["children", /детск|детей|для детей|ребенк/i],
	["youth", /молодеж|молодежн/i],
	["technology", /технолог|программ|модел|датасет|корпус/i],
	[
		"artificial-intelligence",
		/искусственный интеллект|машинное обучен|\bai\b|\bml\b|hugging face/i,
	],
	["website", /веб-сайт|веб-приложен|онлайн-платформ|сайт[,еа\s]/i],
	["mobile-app", /мобильн(?:ое|ого) приложен|apps\.apple|play\.google/i],
	["app", /приложен/i],
	["bot", /бот\b|telegram-бот|_bot\b/i],
	["blog", /блог|авторский канал|instagram\.com|tiktok\.com/i],
	["video", /видео|ролик|youtube\.com|youtu\.be|tiktok\.com/i],
	["podcast", /подкаст/i],
	["radio", /радио|радиостанц/i],
	["television", /телеканал|телевиден|\bTV\b|\bТВ\b/i],
	["newspaper", /газет/i],
	["magazine", /журнал/i],
	["newsletter", /рассылк|бюллетен/i],
	["audiobook", /аудиокниг|аудиопроизведен/i],
	["book", /книг|книжн/i],
	["library", /библиотек/i],
	["archive", /архив|коллекция документ/i],
	["database", /база данных|базу данных/i],
	["encyclopedia", /энциклопед|википед|wikipedia/i],
	["map", /интерактивная карта|картограф/i],
	["course", /курс|урок/i],
	["school", /школ|академи/i],
	["event", /мероприят|форум|саммит|конференц/i],
	["festival", /фестивал/i],
	["museum", /музей|музейн/i],
	["performance", /спектакл/i],
	["shop", /магазин|продажа|продажей|купить/i],
	["dictionary", /словар|словарн|лугат/i],
	["text-corpus", /корпус текст|текстовый корпус|корпусн/i],
	["translator-tool", /машинный перевод|переводчик|переводит текст|apertium/i],
	["transliteration", /транслитер/i],
	["keyboard", /клавиатур|раскладк/i],
	["font", /шрифт/i],
	["ocr", /\bocr\b|распознавание текст|оцифровк/i],
	[
		"speech-recognition",
		/распознавание реч|распознает реч|audio2text|speech.?to.?text|\basr\b/i,
	],
	[
		"text-to-speech",
		/синтез реч|синтеза реч|озвучивание текст|text.?to.?speech|\btts\b/i,
	],
	["language-model", /языковая модел|языковой модел|морфологическ|орфограф/i],
	["dataset", /датасет|набор данных|наборы данных/i],
	["for-children", /для детей|детск|школьник|дошкол/i],
	["for-youth", /для молодежи|молодежн/i],
	["for-adults", /для взрослых/i],
	["for-beginners", /для начинающ|начальн(?:ый|ого) уровен|с нуля/i],
	["for-advanced-learners", /продвинут(?:ый|ого) уровен/i],
	["for-teachers", /для преподавател|для учител/i],
	["for-researchers", /для исследовател|исследовательский инструмент/i],
	["for-diaspora", /диаспор|татары в [а-я]|community abroad/i],
	[
		"open-source",
		/открыт(?:ый|ые|ого) исходн|открыт(?:ый|ые) код|open.?source|github\.com/i,
	],
	["free", /бесплатн/i],
	["bilingual", /двуязыч|на двух языках/i],
	["multilingual", /многоязыч|на нескольких языках|поддерживает \d+ язык/i],
	["interactive", /интерактив|тренажер|упражнен|тесты/i],
	["educational", /образовательн|обучающ|учебн|урок|курс/i],
	["nonprofit", /некоммерч|некоммерческий|нко\b/i],
];

function parseCategories(source, file) {
	const existing = source.match(/^categories:\s*\[([^\]]+)\]/m);
	const legacy = source.match(/^tags:\s*\[([^\]]+)\]/m);
	const match = existing ?? legacy;
	if (!match) throw new Error(`${file}: taxonomy array not found`);

	const values = [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
	if (values.length === 0 || values.some((value) => !categories.has(value))) {
		throw new Error(`${file}: invalid legacy categories ${values.join(", ")}`);
	}
	return values;
}

function classify(source, cardCategories) {
	const selected = new Set();
	for (const [value, pattern] of rules) {
		if (pattern.test(source)) selected.add(value);
	}

	if (!cardCategories.includes("author")) {
		for (const value of roleTags) selected.delete(value);
	}
	if (!cardCategories.includes("language")) selected.delete("translator-tool");
	if (cardCategories.includes("language")) selected.add("language");
	if (cardCategories.includes("lessons")) {
		selected.add("education");
		selected.add("educational");
	}
	if (cardCategories.includes("graphics")) selected.add("design");
	if (cardCategories.includes("community")) selected.add("society");
	if (cardCategories.includes("media") && selected.size === 0)
		selected.add("website");
	if (cardCategories.includes("channel") && selected.size === 0)
		selected.add("blog");
	if (cardCategories.includes("author") && selected.size === 0)
		selected.add("blog");

	const ordered = TAG_VALUES.filter((value) => selected.has(value));
	if (ordered.length === 0) throw new Error("No controlled tag matched");
	if (ordered.some((value) => !allowedTags.has(value))) {
		throw new Error(`Unknown tag: ${ordered.join(", ")}`);
	}
	return ordered;
}

const files = (await readdir(cardsDir))
	.filter((file) => file.endsWith(".md"))
	.sort();
let changed = 0;

for (const file of files) {
	const path = join(cardsDir, file);
	const source = await readFile(path, "utf8");
	const cardCategories = parseCategories(source, file);
	const summary = ["name", "description", "url"]
		.map(
			(field) =>
				source.match(new RegExp(`^${field}:\\s*["']?(.+?)["']?$`, "m"))?.[1] ??
				"",
		)
		.join("\n");
	const tags = classify(`${basename(file, ".md")}\n${summary}`, cardCategories);
	const categoryLine = `categories: [${cardCategories.map((value) => `"${value}"`).join(", ")}]`;
	const tagLine = `tags: [${tags.map((value) => `"${value}"`).join(", ")}]`;

	const next = /^categories:/m.test(source)
		? source.replace(
				/^categories:\s*\[[^\]]+\]\s*\n^tags:\s*\[[^\]]+\]/m,
				`${categoryLine}\n${tagLine}`,
			)
		: source.replace(/^tags:\s*\[[^\]]+\]/m, `${categoryLine}\n${tagLine}`);

	if (next !== source) {
		await writeFile(path, next);
		changed += 1;
	}
	console.log(`${file}: ${cardCategories.join(", ")} -> ${tags.join(", ")}`);
}

console.log(`Migrated ${changed} of ${files.length} cards`);
