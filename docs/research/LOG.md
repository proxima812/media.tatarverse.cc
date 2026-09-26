# Research log

Рабочий журнал discovery-прохода. Не production-данные.

Промпт: `docs/promt_search.md`. Бриф для треков: `docs/research/BRIEF.md`.
Снимок каталога на начало прохода: `docs/research/inventory.txt`.

## Состояние каталога на начало

325 карточек, EN-перевод у всех 325.

| peoples | карточек |
|---|---:|
| tatar | 183 |
| crimean-tatar | 82 |
| bashkir | 43 |
| tatar + bashkir | 15 |
| все три | 2 |

| категория | карточек |
|---|---:|
| media | 76 |
| language | 72 |
| channel | 45 |
| author | 42 |
| lessons | 38 |
| community | 18 |
| graphics | 11 |
| music | 0 (артисты в отдельной коллекции) |

## Пробелы, под которые собран проход

1. `community` - 18 из 325. Диаспора, автономии, землячества, культурные
   центры почти не покрыты.
2. `graphics` - 11 из 325. Дизайн, шрифты, иллюстрация.
3. Башкирский сегмент - 43 карточки против 183 татарских.
4. Форматы: подкасты, театры, издательства, детский контент.

## Треки

| Трек | Зона |
|---|---|
| 1 | RU / CIS, упор на community и башкирские проекты |
| 2 | Диаспора: Финляндия, Турция, липкские татары, Румыния и Болгария, США и Канада, Европа, Япония и Китай |
| 3 | Поиск на tt / ba / crh и других тюркских, упор на недостающие форматы |
| 4 | Graph traversal от каталога, мероприятия, GitHub и сторы |

## Батч 1 - записан

12 карточек, все с EN-переводом. pubDate 2026-09-26.

| id | Страна | Трек | Confidence | Verified |
|---|---|---|---|---|
| tnka-moskva-community | Россия, Москва | 1 + 4 | high | direct |
| tnka-peterburg-community | Россия, СПб | 1 | high | direct |
| vsemirny-kurultai-bashkir-community | Россия, Уфа | 1 + 4 | high | direct |
| kurultai-bashkir-chelyabinsk-community | Россия, Челябинск | 1 | medium | direct |
| kongress-tatar-chelyabinsk-community | Россия, Челябинск | 1 | high | direct |
| nkat-nizhegorodskaya-community | Россия, Нижний Новгород | 1 | high | direct |
| samtatnews-media | Россия, Самара | 1 | medium | direct |
| tatarlar-uz-community | Узбекистан, Ташкент | 1 | high | direct |
| idel-almaty-community | Казахстан, Алматы | 1 | medium | direct |
| istanbul-kirim-dernegi-community | Турция, Стамбул | 2 + 3 | high | direct |
| mzr-polska-community | Польша, Белосток | 2 | high | direct |
| eesti-tatarlaste-liit-community | Эстония, Таллин | 2 | high | direct |

Два кандидата подтверждены независимо двумя треками: автономия Москвы
(1 и 4), Всемирный курултай башкир (1 и 4), İstanbul Kırım Derneği (2 и 3).

## Батч 2 - записан

12 карточек, все с EN-переводом.

| id | Где | Народ | Трек |
|---|---|---|---|
| tatarskoe-knizhnoe-izdatelstvo-media | Казань | tatar | 3 |
| tinchurin-teatr-community | Казань | tatar | 3 |
| bashkirskiy-teatr-gafuri-community | Уфа | bashkir | 3 |
| tamasha-magazine-media | Уфа | bashkir | 3 |
| crimean-tatar-resource-center-community | Киев | crimean-tatar | 4 |
| sabantuy-moskva-community | Москва | tatar, bashkir | 4 |
| kirim-film-festivali-community | Стамбул | crimean-tatar | 4 |
| kirim-vakfi-community | Анкара | crimean-tatar | 2 + 3 |
| kazan-kultur-ankara-community | Анкара | tatar | 2 + 3 |
| canadian-assoc-crimean-tatars-community | Канада | crimean-tatar | 2 |
| tatars-in-japan-community | Япония | tatar | 2 |
| almaniya-tatarcha-channel | Франкфурт | tatar | 4 |

Замечание по таксономии: театры и фестивали пришлось положить в
`community` с тегами `theatre` и `festival`. Отдельной категории для
учреждений культуры в реестре нет, а `media` подходит хуже. Если таких
карточек станет больше, стоит обсудить новую категорию.

## Исправления в существующих данных

1. `vsemirny-kongress-tatar-media` - ссылка обновлена с tatar-congress.org
   на congress.tatar. Старый домен отдает 301, проверено curl.
2. `crimean-tatar-foundation-usa-channel` - домен crimeantatarfoundation.org
   не резолвится (код 000), но MX-записи Google Workspace живы, а у
   организации работает Instagram с 3,6 тысячами подписчиков. Карточка не
   удалена, ссылка переведена на Instagram.

## Очередь на батч 3

Проверены, ждут записи:

Диаспора: Kırım Vakfı (Анкара), Kazan Kültür ve Yardımlaşma Derneği
(Анкара), Eskişehir Kırım Derneği, Kruszyniany, Canadian Association of
Crimean Tatars, International Committee for Crimea, Tatars in Japan,
Bertugan-Verlag (Берлин), Almaniya Tatarça / Quadrat e.V. (Франкфурт).

Форматы-пробелы: Татарское книжное издательство, издательство «Юлбасма»,
театр имени Тинчурина, Башкирский театр имени Гафури, журнал «Тамаша»,
Crimean Tatar Resource Center, Московский Сабантуй, Международный крымский
кинофестиваль, Tuvğan Til.

Telegram и цифровое: Чё казылык, ТАТФОРУМ, Fikerdәşlek, Татарча җырлар,
Башҡорт телен өйрәнәм, Киске Өфө, Татарский Екатеринбург, Мәдәният.
Мәгариф. Тарих., Milli_migmar.

Open source: TurkicNLP, Apertium Bashkir, crh-translit, Tatar OCR for
Tesseract, Bashkir Dialects Geospatial Dataset, bashkir-genealogy-data.

## Отклоненные - основные причины

| Причина | Примеры |
|---|---|
| Уже в каталоге | congress.tatar, piter.tatar, tatarica.org, milliard.tatar, все девять проектов qirimca.org, Apertium-пары, QırımKey, tatar.fi |
| Родитель или ребенок имеющейся карточки | Emel Kırım Vakfı (домен уже занят карточкой журнала «Emel») |
| Главная ссылка только Facebook | UDTTMR (Румыния), Eskişehir Kazan Tatarları |
| Домен мертв или не отвечает | rnkat.ru, kctb.kz, akbars.club, tatar-duslyk.ru, bsfond.ru, mosobltatar.ru |
| Проект заброшен | TAMGA Берлин (2013), vatandash.kz (2015), tatruc.tilda.ws (2021), Историясы (2025) |
| Не по теме каталога | Дома дружбы народов без этнической привязки, TATAR JAPAN Co., Комитет БНД, общие книжные фестивали Казани |
| Нет публичной ссылки | ~25 башкирских организаций из реестра kurultai.ru, Ак калфак, Alliance of Tatars of Europe, Чишма (Беларусь) |
| Дробление организации | Köklüce Kırım Derneği - сельское отделение 2023 года |

## Найдено в существующих данных - требует решения

1. `crimean-tatar-foundation-usa-channel` - домен crimeantatarfoundation.org
   не резолвится. Карточка, похоже, мертвая.
2. `vsemirny-kongress-tatar-media` - старый домен tatar-congress.org теперь
   отдает 301 на congress.tatar. Ссылку стоит обновить.

## Метрика по языкам

| Язык | Кандидатов | Уникальных находок | Добавлено в батч 1 |
|---|---:|---:|---:|
| ru | 22 | 19 | 7 |
| tr | 8 | 6 | 1 |
| en | 11 | 9 | 2 |
| tt | 9 | 9 | 0 |
| ba | 4 | 4 | 2 |
| pl | 2 | 2 | 1 |
| crh | 3 | 3 | 0 |
| et | 1 | 1 | 1 |
| de | 1 | 1 | 0 |
| ro | 1 | 1 | 0 |
| code search | 6 | 6 | 0 |
| fi, lt, bg, ja, be | 0 | 0 | 0 |

Языки глубокого поиска: ru, en, tr, tt, ba, crh.
Вспомогательные: pl, et, de, ro, ja, fi, lt, bg, be.
Без результата: fi, lt, bg, be, kk, uz, ky, az - организации в этих
странах либо уже в каталоге, либо ведут сайты по-русски.
Продуктивные: ru, en, tr, tt, ba.


## Проверки

Запущены по просьбе владельца после каждого батча.

| Команда | Результат |
|---|---|
| `bun run check` | 0 ошибок |
| `bun run check:seo` | 805 страниц, 0 ошибок, 46 предупреждений |
| `bun run check:i18n` | 349/349 карточек переведены |

Все 46 предупреждений - длина title и description у карточек, которые были
в каталоге до этого прохода. Ни одна из 24 новых карточек предупреждений не
дает: длинные названия сокращены после первого прогона.

## Итог прохода

| Показатель | Значение |
|---|---:|
| Кандидатов найдено | 61 |
| Добавлено карточек | 24 |
| Исправлено существующих | 2 |
| Отклонено | 37 |
| Каталог | 325 -> 349 |

Категории новых карточек: `community` 21, `media` 5, `lessons` 1,
`channel` 1 (часть карточек имеет две категории).

По каталогу в целом, с учетом карточек с несколькими значениями:

| Категория | Было | Стало |
|---|---:|---:|
| community | 25 | 46 |
| media | 83 | 88 |
| channel | 50 | 51 |
| lessons | 47 | 48 |

| peoples | Было | Стало |
|---|---:|---:|
| tatar | 200 | 215 |
| crimean-tatar | 84 | 89 |
| bashkir | 60 | 66 |

Главный результат прохода: `community` вырос почти вдвое - с 25 до 46
карточек. Это и был заявленный пробел.

Новые географии, которых в каталоге не было: Польша (липкские татары),
Эстония, Япония, Канада, Узбекистан, Казахстан, Германия, Киев.

## Что осталось на следующий проход

1. Реестр зарубежных башкирских организаций на kurultai.ru - около 25
   организаций с именами руководителей, но без сайтов. Нужен поиск по
   именам, чтобы найти их страницы в соцсетях.
2. Регионы РФ, где организации работают только через VK и Telegram:
   Астраханская, Саратовская, Тюменская, Омская, Новосибирская области,
   Пермский край, ХМАО, ЯНАО, Красноярский край.
3. Холдинг rbsmi.ru - десятки башкироязычных изданий, не разобран.
4. Заблокированы техническими ошибками, стоит перепроверить вручную:
   kitap.tatar.ru, ebook.bashnl.ru, kitap-ufa.ru, fnkat.tatarstan.ru,
   selet.biz.
5. Болгария - крымскотатарская община существует, но ни одной организации
   с рабочей публичной ссылкой не найдено.
6. Категория `graphics` (14 карточек) осталась почти нетронутой.
7. Девять татарских и башкирских Telegram-каналов и шесть open-source
   проектов из очереди батча 3 уже верифицированы и ждут записи.
