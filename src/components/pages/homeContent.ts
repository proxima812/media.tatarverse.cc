import { config } from "main.config";
import type { PageLocale } from "@/components/pages/pageLocale";

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
	readonly features: {
		readonly heading: string;
		readonly items: readonly HomeItem[];
	};
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
				title: "Сохраняйте понравившееся",
				description:
					"Отмечайте проекты сердечком - они собираются на отдельной странице и остаются в браузере без всякой регистрации.",
			},
			{
				title: "Легко добавить проект",
				description:
					"На странице «Добавить проект» есть форма - заполните ее, и после модерации карточка появится в каталоге.",
			},
		],
	},
	faq: {
		title: "Часто задаваемые вопросы",
		items: [
			{
				question: "Что такое media.tatarverse?",
				answer:
					"Открытый каталог проектов о татарском, башкирском и крымскотатарском языках и культуре: авторы, каналы, медиа, языковые платформы, уроки и графика - собраны в одном месте, у каждого проекта своя карточка и прямая ссылка на первоисточник.",
			},
			{
				question: "Как добавить свой проект в каталог?",
				answer:
					"Заполните форму на странице «Добавить проект» - заявка уходит на модерацию, и карточка обычно появляется в течение суток. Если удобнее работать с кодом, пришлите pull request в открытом репозитории на GitHub.",
			},
			{
				question: "Нашли ошибку в карточке - куда писать?",
				answer:
					"Любым удобным способом: ссылка «Предложить правку» внизу страницы проекта, issue или pull request в репозитории на GitHub, Telegram, VK, Instagram или Threads - везде @the_tatarverse. Полный список - на странице «О проекте».",
			},
			{
				question: "Проект закрылся или переехал - что с карточкой?",
				answer:
					"Переехал - поправим ссылку, закрылся - уберем карточку: каталог ведет к живым проектам, а не хранит архив мертвых ссылок. Автор проекта может попросить убрать карточку без объяснения причин.",
			},
			{
				question: "Нужна ли регистрация и что с моими данными?",
				answer:
					"Регистрации нет. Сохраненные проекты и выбранный вид каталога хранятся только в вашем браузере и никуда не отправляются, веб-аналитика на сайте не подключена. Подробности - в «Политике конфиденциальности».",
			},
			{
				question: "Это бесплатно?",
				answer:
					"Да. Каталог некоммерческий: рекламы нет, доступ не продается, исходный код открыт.",
			},
			{
				question: "Можно ли пользоваться данными каталога у себя?",
				answer:
					"Да. Код сайта под лицензией MIT, тексты карточек - CC BY 4.0, с указанием источника. Данные лежат обычными файлами в репозитории, выкачивать сайт для этого не нужно.",
			},
			{
				question: "Кому принадлежат логотипы в карточках?",
				answer:
					"Правообладателям самих проектов - в каталоге они используются только для того, чтобы обозначить проект, и не означают партнерства или одобрения. Подробности - на странице «Источники».",
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
				title: "Keep what you like",
				description:
					"Heart a project and it lands on your saved page - stored in the browser, no account needed.",
			},
			{
				title: "Easy to add a project",
				description:
					'The "Add a project" page has a form - fill it in, and once it\'s reviewed the card appears in the catalog.',
			},
		],
	},
	faq: {
		title: "Frequently asked questions",
		items: [
			{
				question: "What is media.tatarverse?",
				answer:
					"An open catalog of projects about the Tatar, Bashkir and Crimean Tatar languages and cultures: authors, channels, media outlets, language platforms, lessons and graphics - collected in one place, each with its own card and a direct link to the original.",
			},
			{
				question: "How do I add my project to the catalog?",
				answer:
					'Fill in the form on the "Add a project" page - the submission goes to review and the card usually appears within a day. If you prefer working with code, send a pull request in the open GitHub repository.',
			},
			{
				question: "Found a mistake in a card - where do I report it?",
				answer:
					'Whichever way suits you: the "Suggest an edit" link at the bottom of a project page, an issue or a pull request in the GitHub repository, Telegram, VK, Instagram or Threads - all of them @the_tatarverse. The full list is on the "About" page.',
			},
			{
				question: "A project closed or moved - what happens to its card?",
				answer:
					"Moved - we fix the link; closed - we remove the card: the catalog leads to live projects, it is not an archive of dead links. An author can ask us to remove their card without giving a reason.",
			},
			{
				question: "Do I need an account, and what happens to my data?",
				answer:
					'There are no accounts. Saved projects and the chosen catalog view are stored in your browser only and are never sent anywhere; web analytics is not enabled on the site. Details are in the "Privacy Policy".',
			},
			{
				question: "Is it free?",
				answer:
					"Yes. The catalog is non-commercial: no ads, no paid access, and the source code is open.",
			},
			{
				question: "Can I reuse the catalog data?",
				answer:
					"Yes. The site code is MIT licensed and the card texts are CC BY 4.0, with attribution. The data sits as plain files in the repository, so there is no need to scrape the site.",
			},
			{
				question: "Who owns the logos in the cards?",
				answer:
					'The projects themselves - in the catalog the logos are used only to identify a project and do not imply partnership or endorsement. Details are on the "Sources" page.',
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
