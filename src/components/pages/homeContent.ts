import type { PageLocale } from "@/components/pages/pageLocale";
import { config } from "main.config";

/**
 * Тексты главной страницы по локалям - одним модулем.
 *
 * До этого английский текст задавался пятью разными способами: словарь,
 * дефолт пропа компонента, объект во фронтматтере `en/index.astro`, таблица
 * локалей внутри компонента и тернарник в разметке. Каждый следующий способ
 * заводили потому, что предыдущий не сработал, и английская главная в итоге
 * разошлась с русской не только текстом, но и составом блоков.
 *
 * Дефолты пропов в самих компонентах остаются нейтральными дефолтами
 * стартера: главная передает свой контент явно, а не полагается на них.
 */

interface HomeItem {
	readonly title: string;
	readonly description: string;
}

interface FaqItem {
	readonly question: string;
	readonly answer: string;
}

interface HomeContent {
	readonly features: { readonly heading: string; readonly items: readonly HomeItem[] };
	readonly faq: { readonly title: string; readonly items: readonly FaqItem[] };
	readonly instFollows: { readonly title: string };
	readonly quote: {
		readonly quote: string;
		readonly name: string;
		readonly position: string;
	};
}

const ru: HomeContent = {
	features: {
		heading: "Все в одном каталоге - это удобно",
		items: [
			{
				title: "Находите за секунды",
				description:
					"Поиск по названию, описанию и тегам сужает каталог по мере ввода - а рядом весь список по алфавиту.",
			},
			{
				title: "Легко добавить проект",
				description:
					"На странице «Добавить проект» есть форма - заполните ее, и после модерации карточка появится в каталоге.",
			},
			{
				title: "Сохраняйте понравившееся",
				description:
					"Отмечайте проекты сердечком - они собираются на отдельной странице и остаются в браузере без всякой регистрации.",
			},
		],
	},
	faq: {
		title: "Часто задаваемые вопросы",
		items: [
			{
				question: "Что такое media.tatarverse?",
				answer:
					"Открытый каталог проектов о татарском, башкирском и крымскотатарском языках и культуре: языковые приложения, каналы, СМИ, курсы и графика - в одном месте.",
			},
			{
				question: "Как добавить свой проект в каталог?",
				answer:
					"Через форму на странице «Добавить проект» - заявка уходит на модерацию. Если удобнее работать с кодом, можно прислать pull request в открытом репозитории на GitHub.",
			},
			{
				question: "Это бесплатно?",
				answer:
					"Да. Каталог не показывает рекламу и не продает доступ - исходный код открыт, коммерческой модели нет.",
			},
			{
				question: "Кому принадлежат логотипы в карточках?",
				answer:
					"Правообладателям перечисленных проектов - мы используем их только для идентификации. Подробности на странице «Источники».",
			},
			{
				question: "Нашли ошибку в карточке - куда писать?",
				answer:
					"Откройте issue в репозитории на GitHub - мы стараемся отвечать быстро.",
			},
		],
	},
	instFollows: { title: "Спасибо Вам за поддержку." },
	/*
	 * Русская цитата читается из `main.config.ts`: он остается единственным
	 * файлом, который правят под новый проект. Перевод живет здесь, рядом с
	 * остальным английским текстом главной.
	 */
	quote: config.site.quote,
};

const en: HomeContent = {
	features: {
		heading: "One catalog - three ways to use it.",
		items: [
			{
				title: "Find it in seconds",
				description:
					"Search by name, description, and tags narrows the catalog as you type - with the full A-Z list right next to it.",
			},
			{
				title: "Easy to add a project",
				description:
					'The "Add a project" page has a form - fill it in, and once it\'s reviewed the card appears in the catalog.',
			},
			{
				title: "Keep what you like",
				description:
					"Heart a project and it lands on your saved page - stored in the browser, no account needed.",
			},
		],
	},
	faq: {
		title: "Frequently asked questions",
		items: [
			{
				question: "What is media.tatarverse?",
				answer:
					"An open catalog of projects about the Tatar, Bashkir, and Crimean Tatar languages and cultures: language apps, channels, media outlets, courses, and graphic design work in one place.",
			},
			{
				question: "How do I add my project to the catalog?",
				answer:
					'Through the form on the "Add a project" page - the submission goes to review. If you prefer working with code, send a pull request in the open GitHub repository.',
			},
			{
				question: "Is it free?",
				answer:
					"Yes. The catalog shows no ads and doesn't sell access - the source code is open, with no commercial model.",
			},
			{
				question: "Who owns the logos in the cards?",
				answer:
					'The respective project owners - we use them only for identification. See the "Sources" page for details.',
			},
			{
				question: "Found an error in a card - where do I report it?",
				answer:
					"Open an issue in the GitHub repository - we try to respond quickly.",
			},
		],
	},
	instFollows: { title: "Thank you for your support." },
	/*
	 * Реальные слова автора проекта, а не маркетинговый текст: переведены
	 * дословно, а не переписаны.
	 */
	quote: {
		quote:
			"I don't like searching for long. There are plenty of projects on Tatar, Bashkir and Crimean Tatar, but they are scattered across the web - you find half of them by accident. Here they are in one place, and what you need turns up right away.",
		name: "Kamil M. I.",
		position: "Developer, creator of the project",
	},
};

export function homeContent(locale: PageLocale): HomeContent {
	return locale === "en" ? en : ru;
}
