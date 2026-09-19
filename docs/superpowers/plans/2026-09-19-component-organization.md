# Понятная структура компонентов

**Дата:** 2026-09-19
**Спека:** -

## Зачем

Упростить навигацию по компонентам и подготовку алфавитного каталога при сохранении текущего поведения сайта.

## Что меняем

- Перенести из `src/components/partials/` в `layout/`: Header, Footer, FooterLinkGroup, Breadcrumbs, BigWordBottom (новое имя FooterBrand).
- Перенести из `partials/` в `ui/`: Button, Container, StrokeIcon, Tooltip.
- Перенести из `partials/` в `forms/`: TallyForm.
- Перенести из `partials/` в `home/`: FAQ, Features, LogoMarquee, LogoStack, Quote, SearchShowcase, StatField, StickyList.
- Перенести CatalogGlossary и CatalogSearch из `Catalog/` в `search/`, назвать AlphabeticalCatalog и SearchInput.
- Изменить импорты и имена этих компонентов у потребителей в `src/components/`, `src/layouts/Layout.astro`, `src/data/markdown/add.mdx`, `src/data/markdown-en/add.mdx`.
- Изменить `src/lib/catalog/glossary.ts`: единая подготовка групп и поисковых строк.
- Создать `src/components/search/alphabeticalCatalog.client.ts`: перенести браузерную логику из глоссария.
- Сократить исторические комментарии в компонентах поиска, CatalogCard и CatalogGrid; обновить ссылку в `src/lib/catalog/searchText.ts`.

## Чего не трогаем

URL, контент, стили, SEO, настройки, зависимости, ассеты и `.impeccable/questions/`. Сохраняем предыдущую правку группировки глоссария. Остальные папки не переименовываем ради регистра.

## Шаги

- [ ] Разложить компоненты по назначению и обновить потребителей.
- [ ] Собрать данные глоссария одним вызовом и отделить клиентский код.
- [ ] Сократить комментарии и проверить изменения.

## Проверка

`bun run check`, проверка отсутствия старых импортов и `git diff --check`. Полная сборка по умолчанию не запускается согласно инструкции пользователя; браузерное поведение остается непроверенным.

## Риски

Пропущенные импорты в MDX и изменение загрузки клиентского скрипта. Сохраняем обработанный Astro script с импортом клиентского модуля и существующие DOM-атрибуты.
