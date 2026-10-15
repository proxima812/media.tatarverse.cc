# Редизайн «Журнал»

**Дата:** 2026-10-14
**Спека:** `docs/design/2026-10-14-redesign-presentation.html`, слайд 8 (вариант 06 «Журнал») и слайд 2 (общая система)

## Зачем

Сейчас сайт полностью серый, а у каждого блока главной свой характер: девять
разных секций, мэш-градиенты, пилюля-шапка. Владелец выбрал минималистичное
направление в духе Vercel, Dub и Mobbin: Inter, тонкие линии, много воздуха,
крупная типографика и цвет только как сигнал - иконка категории в тонированном
квадрате. Главная становится журнальной: огромный заголовок со знаками трех
народов, поиск с фильтром по народам и горизонтальные ряды проектов по
категориям. Каталог, страница проекта и остальные страницы переходят на ту же
систему. Темная тема заложена в токенах и включается последним шагом.

## Что меняем

Система:

- Изменить: `src/styles/tailwind.css` - новая нейтральная шкала (фон, поверхность,
  линия, текст, приглушенный текст), семь тонов категорий, `--font-mono`,
  радиусы остаются закрытой шкалой. Токены сразу описаны для двух тем
  (`:root` и `[data-theme=dark]`), переключатель появится в шаге 8.
- Изменить: `astro.config.mjs` - второй шрифт Geist Mono (только latin) для
  счетчиков, доменов, подписей и клавиш.
- Изменить: `src/lib/taxonomy.ts` - иконки категорий на линейный набор
  `tabler:*` (он уже стоит в зависимостях), у каждой категории тон.
- Создать: `src/components/ui/CategoryTile.astro` - иконка категории в
  тонированном квадрате.
- Создать: `src/components/ui/SearchField.astro` - поле поиска с иконкой и
  подсказкой клавиши.
- Создать: `src/components/ui/Kbd.astro` - клавиша.
- Изменить: `src/components/ui/Button.astro` - пресеты под новую систему
  (сплошная, вторичная с контуром, призрачная), нажатие `scale(.97)`.
- Изменить: `src/components/Catalog/TaxonomyChip.astro`,
  `src/components/Catalog/PeopleBadge.astro`, `src/components/Catalog/CardLogo.astro` -
  бейдж категории с цветной точкой, знак народа в черном круге, логотип
  с квадратным скруглением.

Каркас:

- Изменить: `src/components/layout/Header.astro` - шапка во всю ширину
  (логотип, ссылки, справа поиск, сохраненное, язык, «Добавить проект»).
  Логика мобильного меню, счетчик сохраненного и переключатель локали
  сохраняются.
- Изменить: `src/components/layout/Footer.astro` и его части - тихий подвал
  на линиях.
- Изменить: `src/components/ui/Container.astro` - отступы под новую шапку.

Главная:

- Создать: `src/components/home/JournalHero.astro` - заголовок со знаками
  народов и подзаголовок.
- Создать: `src/components/home/CategoryRows.astro` - панель поиска и
  фильтра по народам и ряды по категориям с горизонтальной прокруткой.
- Создать: `src/components/Catalog/ProjectCover.astro` - карточка-обложка для
  рядов (обложка 16:10, логотип, бейдж категории, название, описание,
  домен, знаки народов).
- Изменить: `src/components/pages/HomePage.astro` - Hero + ряды + FAQ.
- Изменить: `src/components/home/FAQ.astro` - новый стиль.
- Удалить: `src/components/home/{LogoStack,SearchShowcase,Features,StatField,StickyList,Quote,LogoMarquee}.astro`,
  `src/components/MainTitle.astro`, `src/lib/home/showcase.ts`,
  `src/lib/ui/drift.ts`, `src/styles/chroma-styles/chroma.css` - больше нигде
  не используются (проверено поиском по `src`).
- Изменить: `src/lib/home/content.ts` - остается только то, что нужно FAQ.
- Изменить: `src/i18n/locales/{ru,en}.ts`, `src/i18n/dictionary.ts` - ключи
  главной.

Каталог:

- Изменить: `src/components/pages/CatalogIndexPage.astro`,
  `src/components/pages/CategoryPage.astro` - крупный заголовок, счетчик.
- Изменить: `src/components/Catalog/Catalog.astro` - липкая панель: поиск по
  тексту, фильтр по народам, теги; фильтры складываются с тегами.
- Изменить: `src/components/Catalog/CatalogToolbar.astro` - категории чипами
  с цветной иконкой, переключатель вида сегментом.
- Изменить: `src/components/Catalog/CatalogCard.astro` - карточка в новой
  системе (логотип, название, домен, описание, бейдж, знаки, закладка).
- Изменить: `src/components/Catalog/CatalogGrid.astro`,
  `src/components/Catalog/CatalogRow.astro`,
  `src/components/Catalog/CatalogTagFilter.astro`,
  `src/components/Catalog/SaveButton.astro` - стиль, атрибуты
  `data-peoples` и `data-search` для фильтра.
- Удалить: `src/components/Catalog/variants/*` - нигде не импортируются.

Страница проекта и прочее:

- Изменить: `src/components/pages/ProjectPage.astro`,
  `src/components/Catalog/CardDetail.astro`,
  `src/components/Catalog/CardTaxonomy.astro`,
  `src/components/layout/Breadcrumbs.astro` - две колонки на линиях,
  факты списком с точками, таблица метаданных, «Похожие проекты».
- Изменить: `src/components/pages/{SearchPage,SavedPage,MusicPage,ArtistPage}.astro`,
  `src/components/search/*`, `src/components/Music/*`, `src/layouts/MDX.astro`,
  `src/pages/404.astro` - заголовки и поверхности в новой системе.
- Изменить: `DESIGN.md` - новая система вместо «монохромного атласа».

Тема:

- Изменить: `src/layouts/Layout.astro`, `src/components/layout/Header.astro` -
  переключатель темы, тема ставится инлайн-скриптом до отрисовки
  (без мигания), уважает `prefers-color-scheme`.

## Чего не трогаем

- URL: `/`, `/catalog`, `/catalog/<category>`, `/projects/<id>`, `/search`,
  `/saved`, `/catalog/music/*`, текстовые страницы и их `/en/` зеркала.
- Схему карточек, `src/data/**`, таксономию значений (меняются только иконки
  и тоны), `src/content.config.ts`.
- SEO-слой: `SEO.astro`, интеграции, `llms.txt`/markdown-двойники.
- Ключ `localStorage` закладок и вида каталога, событие `catalog:saved-change`.
- Брендовые ассеты в `public/`.

## Шаги

Каждый шаг - отдельный коммит, сайт после него собирается.

- [x] 1. Токены, шрифт Geist Mono, иконки и тоны категорий, примитивы
  (`CategoryTile`, `SearchField`, `Kbd`, `Button`, чипы, бейджи, логотип).
- [x] 2. Шапка, подвал, контейнер.
- [x] 3. Главная: `JournalHero`, `ProjectCover`, `CategoryRows`, FAQ; удаление
  старых блоков.
- [x] 4. Каталог: заголовки страниц, панель с поиском и народами, карточка,
  список, теги.
- [x] 5. Страница проекта.
- [x] 6. Поиск, сохраненное, музыка, текстовые страницы, 404.
- [x] 7. `DESIGN.md`.
- [x] 8. Темная тема и переключатель.

## Проверка

Проверки запускаются по просьбе владельца (см. память агента). Когда
попросят: `bun run verify`, затем глазами `/`, `/en/`, `/catalog`,
`/catalog/media`, `/projects/avdet-media`, `/search`, `/saved`,
`/catalog/music`, `/about` на 1440 и 390 px, в обеих темах после шага 8.

## Риски

- Фильтр каталога теперь складывает три условия (текст, народы, теги):
  ленивые чанки сетки должны раскрываться до фильтрации, как сейчас для тегов
  (`catalog:before-filter`).
- Удаление блоков главной может задеть markdown-двойник `/index.md`, если он
  собирается из `src/lib/home/content.ts` - проверить `dualmarkPages.ts`.
- Тоны категорий - новые хроматические токены: контраст текста в бейджах
  проверить на светлой и темной теме.
- `catalog.title` в словаре содержит длинное тире, а хук запрещает его в
  записываемых файлах: правка словаря должна заменить его на дефис.
