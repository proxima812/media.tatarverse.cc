import type { LocaleCode } from "@/config/types";

export const CATEGORY_VALUES = [
	"channel",
	"author",
	"media",
	"language",
	"lessons",
	"graphics",
	"community",
] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

export const TAG_GROUP_VALUES = [
	"roles",
	"topics",
	"formats",
	"language-technologies",
	"audiences",
	"features",
] as const;

export type TagGroup = (typeof TAG_GROUP_VALUES)[number];

export const TAG_VALUES = [
	"blogger",
	"journalist",
	"editor",
	"writer",
	"poet",
	"playwright",
	"translator",
	"teacher",
	"linguist",
	"researcher",
	"historian",
	"local-historian",
	"musician",
	"performer",
	"songwriter",
	"composer",
	"producer",
	"director",
	"actor",
	"presenter",
	"podcaster",
	"artist",
	"illustrator",
	"designer",
	"photographer",
	"craftsperson",
	"developer",
	"activist",
	"language",
	"literature",
	"poetry",
	"music",
	"history",
	"culture",
	"traditions",
	"folklore",
	"heritage",
	"identity",
	"religion",
	"education",
	"science",
	"news",
	"politics",
	"society",
	"travel",
	"cuisine",
	"fashion",
	"art",
	"design",
	"architecture",
	"theatre",
	"cinema",
	"humor",
	"children",
	"youth",
	"technology",
	"artificial-intelligence",
	"website",
	"app",
	"mobile-app",
	"bot",
	"blog",
	"video",
	"podcast",
	"radio",
	"television",
	"newspaper",
	"magazine",
	"newsletter",
	"book",
	"audiobook",
	"library",
	"archive",
	"database",
	"encyclopedia",
	"map",
	"course",
	"school",
	"event",
	"festival",
	"museum",
	"performance",
	"shop",
	"dictionary",
	"text-corpus",
	"translator-tool",
	"transliteration",
	"keyboard",
	"font",
	"ocr",
	"speech-recognition",
	"text-to-speech",
	"language-model",
	"dataset",
	"for-children",
	"for-youth",
	"for-adults",
	"for-beginners",
	"for-advanced-learners",
	"for-teachers",
	"for-researchers",
	"for-diaspora",
	"open-source",
	"free",
	"bilingual",
	"multilingual",
	"interactive",
	"educational",
	"nonprofit",
] as const;

export type Tag = (typeof TAG_VALUES)[number];
export type TaxonomyLocale = "ru" | "en";

interface Definition {
	readonly labels: Readonly<Record<TaxonomyLocale, string>>;
}

interface CategoryDefinition extends Definition {
	readonly icon: string;
}

interface TagDefinition extends Definition {
	readonly group: TagGroup;
}

const labels = (ru: string, en: string): Definition["labels"] => ({ ru, en });

export const CATEGORY_DEFINITIONS = {
	channel: { labels: labels("Канал", "Channel"), icon: "mdi:broadcast" },
	author: {
		labels: labels("Автор", "Author"),
		icon: "mdi:account-edit-outline",
	},
	media: {
		labels: labels("Медиа", "Media"),
		icon: "mdi:newspaper-variant-outline",
	},
	language: {
		labels: labels("Языковой проект", "Language project"),
		icon: "mdi:translate",
	},
	lessons: {
		labels: labels("Уроки", "Lessons"),
		icon: "mdi:school-outline",
	},
	graphics: {
		labels: labels("Графика", "Graphics"),
		icon: "mdi:palette-outline",
	},
	community: {
		labels: labels("Сообщество", "Community"),
		icon: "mdi:account-group-outline",
	},
} satisfies Record<Category, CategoryDefinition>;

const tag = (group: TagGroup, ru: string, en: string): TagDefinition => ({
	group,
	labels: labels(ru, en),
});

export const TAG_GROUP_LABELS = {
	roles: labels("Роли", "Roles"),
	topics: labels("Темы", "Topics"),
	formats: labels("Форматы", "Formats"),
	"language-technologies": labels(
		"Языковые технологии",
		"Language technologies",
	),
	audiences: labels("Аудитория", "Audience"),
	features: labels("Особенности", "Features"),
} satisfies Record<TagGroup, Definition["labels"]>;

export const TAG_DEFINITIONS = {
	blogger: tag("roles", "Блогер", "Blogger"),
	journalist: tag("roles", "Журналист", "Journalist"),
	editor: tag("roles", "Редактор", "Editor"),
	writer: tag("roles", "Писатель", "Writer"),
	poet: tag("roles", "Поэт", "Poet"),
	playwright: tag("roles", "Драматург", "Playwright"),
	translator: tag("roles", "Переводчик", "Translator"),
	teacher: tag("roles", "Преподаватель", "Teacher"),
	linguist: tag("roles", "Лингвист", "Linguist"),
	researcher: tag("roles", "Исследователь", "Researcher"),
	historian: tag("roles", "Историк", "Historian"),
	"local-historian": tag("roles", "Краевед", "Local historian"),
	musician: tag("roles", "Музыкант", "Musician"),
	performer: tag("roles", "Исполнитель", "Performer"),
	songwriter: tag("roles", "Автор песен", "Songwriter"),
	composer: tag("roles", "Композитор", "Composer"),
	producer: tag("roles", "Продюсер", "Producer"),
	director: tag("roles", "Режиссер", "Director"),
	actor: tag("roles", "Актер", "Actor"),
	presenter: tag("roles", "Ведущий", "Presenter"),
	podcaster: tag("roles", "Подкастер", "Podcaster"),
	artist: tag("roles", "Художник", "Artist"),
	illustrator: tag("roles", "Иллюстратор", "Illustrator"),
	designer: tag("roles", "Дизайнер", "Designer"),
	photographer: tag("roles", "Фотограф", "Photographer"),
	craftsperson: tag("roles", "Мастер", "Craftsperson"),
	developer: tag("roles", "Разработчик", "Developer"),
	activist: tag("roles", "Активист", "Activist"),
	language: tag("topics", "Язык", "Language"),
	literature: tag("topics", "Литература", "Literature"),
	poetry: tag("topics", "Поэзия", "Poetry"),
	music: tag("topics", "Музыка", "Music"),
	history: tag("topics", "История", "History"),
	culture: tag("topics", "Культура", "Culture"),
	traditions: tag("topics", "Традиции", "Traditions"),
	folklore: tag("topics", "Фольклор", "Folklore"),
	heritage: tag("topics", "Наследие", "Heritage"),
	identity: tag("topics", "Идентичность", "Identity"),
	religion: tag("topics", "Религия", "Religion"),
	education: tag("topics", "Образование", "Education"),
	science: tag("topics", "Наука", "Science"),
	news: tag("topics", "Новости", "News"),
	politics: tag("topics", "Политика", "Politics"),
	society: tag("topics", "Общество", "Society"),
	travel: tag("topics", "Путешествия", "Travel"),
	cuisine: tag("topics", "Кухня", "Cuisine"),
	fashion: tag("topics", "Мода", "Fashion"),
	art: tag("topics", "Искусство", "Art"),
	design: tag("topics", "Дизайн", "Design"),
	architecture: tag("topics", "Архитектура", "Architecture"),
	theatre: tag("topics", "Театр", "Theatre"),
	cinema: tag("topics", "Кино", "Cinema"),
	humor: tag("topics", "Юмор", "Humor"),
	children: tag("topics", "Дети", "Children"),
	youth: tag("topics", "Молодежь", "Youth"),
	technology: tag("topics", "Технологии", "Technology"),
	"artificial-intelligence": tag(
		"topics",
		"Искусственный интеллект",
		"Artificial intelligence",
	),
	website: tag("formats", "Сайт", "Website"),
	app: tag("formats", "Приложение", "App"),
	"mobile-app": tag("formats", "Мобильное приложение", "Mobile app"),
	bot: tag("formats", "Бот", "Bot"),
	blog: tag("formats", "Блог", "Blog"),
	video: tag("formats", "Видео", "Video"),
	podcast: tag("formats", "Подкаст", "Podcast"),
	radio: tag("formats", "Радио", "Radio"),
	television: tag("formats", "Телевидение", "Television"),
	newspaper: tag("formats", "Газета", "Newspaper"),
	magazine: tag("formats", "Журнал", "Magazine"),
	newsletter: tag("formats", "Рассылка", "Newsletter"),
	book: tag("formats", "Книга", "Book"),
	audiobook: tag("formats", "Аудиокнига", "Audiobook"),
	library: tag("formats", "Библиотека", "Library"),
	archive: tag("formats", "Архив", "Archive"),
	database: tag("formats", "База данных", "Database"),
	encyclopedia: tag("formats", "Энциклопедия", "Encyclopedia"),
	map: tag("formats", "Карта", "Map"),
	course: tag("formats", "Курс", "Course"),
	school: tag("formats", "Школа", "School"),
	event: tag("formats", "Мероприятие", "Event"),
	festival: tag("formats", "Фестиваль", "Festival"),
	museum: tag("formats", "Музей", "Museum"),
	performance: tag("formats", "Спектакль", "Performance"),
	shop: tag("formats", "Магазин", "Shop"),
	dictionary: tag("language-technologies", "Словарь", "Dictionary"),
	"text-corpus": tag("language-technologies", "Корпус текстов", "Text corpus"),
	"translator-tool": tag(
		"language-technologies",
		"Переводчик",
		"Translation tool",
	),
	transliteration: tag(
		"language-technologies",
		"Транслитерация",
		"Transliteration",
	),
	keyboard: tag("language-technologies", "Клавиатура", "Keyboard"),
	font: tag("language-technologies", "Шрифт", "Font"),
	ocr: tag("language-technologies", "Распознавание текста", "Text recognition"),
	"speech-recognition": tag(
		"language-technologies",
		"Распознавание речи",
		"Speech recognition",
	),
	"text-to-speech": tag(
		"language-technologies",
		"Синтез речи",
		"Text to speech",
	),
	"language-model": tag(
		"language-technologies",
		"Языковая модель",
		"Language model",
	),
	dataset: tag("language-technologies", "Датасет", "Dataset"),
	"for-children": tag("audiences", "Детям", "For children"),
	"for-youth": tag("audiences", "Молодежи", "For young people"),
	"for-adults": tag("audiences", "Взрослым", "For adults"),
	"for-beginners": tag("audiences", "Начинающим", "For beginners"),
	"for-advanced-learners": tag(
		"audiences",
		"Продолжающим",
		"For advanced learners",
	),
	"for-teachers": tag("audiences", "Преподавателям", "For teachers"),
	"for-researchers": tag("audiences", "Исследователям", "For researchers"),
	"for-diaspora": tag("audiences", "Диаспоре", "For diaspora"),
	"open-source": tag("features", "Открытый исходный код", "Open source"),
	free: tag("features", "Бесплатно", "Free"),
	bilingual: tag("features", "Двуязычный", "Bilingual"),
	multilingual: tag("features", "Многоязычный", "Multilingual"),
	interactive: tag("features", "Интерактивный", "Interactive"),
	educational: tag("features", "Образовательный", "Educational"),
	nonprofit: tag("features", "Некоммерческий", "Nonprofit"),
} satisfies Record<Tag, TagDefinition>;

/**
 * `LocaleCode` - это произвольная строка (см. `src/config/types.ts`), а у
 * реестра подписи есть ровно для двух локалей. Сужение живет здесь, в одном
 * месте: раньше его повторяли три обертки в `labels.ts`, а без них тернарник
 * разъехался бы по всем вызывающим компонентам.
 */
function taxonomyLocale(locale: LocaleCode): TaxonomyLocale {
	return locale === "en" ? "en" : "ru";
}

export function categoryLabel(locale: LocaleCode, category: Category): string {
	return CATEGORY_DEFINITIONS[category].labels[taxonomyLocale(locale)];
}

export function tagLabel(locale: LocaleCode, value: Tag): string {
	return TAG_DEFINITIONS[value].labels[taxonomyLocale(locale)];
}

export function tagGroupLabel(locale: LocaleCode, group: TagGroup): string {
	return TAG_GROUP_LABELS[group][taxonomyLocale(locale)];
}

/**
 * Иконка категории. Лежит в том же определении, что и подписи: отдельный
 * модуль вокруг одного обращения к полю прятал бы реестр, а не сложность.
 */
export function categoryIcon(category: Category): string {
	return CATEGORY_DEFINITIONS[category].icon;
}
