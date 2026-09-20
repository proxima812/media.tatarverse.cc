# Применение выбранных логотипов

**Дата:** 2026-09-20
**Спека:** -

## Зачем

Показать логотипы и аватары на карточках после визуального просмотра кандидатов с официальных страниц. Пользователь поручил выбор агенту.

## Что меняем

Для каждого ID в таблице: добавить `src/assets/images/logo/<id>.png` и поле `logo` в `src/data/cards/<id>.md`. Выбрано 147 карточек. Изображения переносятся без дополнительной обработки из отчета сканирования.

## Чего не трогаем

Другие поля карточек, EN-переводы, имеющиеся логотипы, UI, URL и конфигурацию. Общие значки платформ и сомнительные обложки пропускаем.

## Шаги

- [x] Просмотреть все 419 уникальных изображений и сверить выбранные источники.
- [ ] Применить выбор через скрипт с проверкой хешей и резервными копиями.
- [ ] Проверить пути, неизменность остального контента, типы и i18n.

## Проверка

`bun run check`, `bun run check:i18n`, целостность PNG, сравнение Markdown с резервными копиями. Полная сборка и браузерная проверка не запускаются по умолчанию.

## Риски

Иконка платформы может быть ошибочно принята за логотип. Отбор выполнен визуально; для авторов допустим аватар с их страницы. Карточки без надежного кандидата остаются без logo.

## Выбор

Отчет: `.cache/logo-discovery/20260919T175913344483Z/report.json`.
Выбор: `.cache/logo-discovery/20260919T175913344483Z/selection-agent.json`.
Скрипт перед записью сохраняет исходные карточки в `backup-<timestamp>/` рядом с отчетом.

| ID карточки | Кандидат | Страница источника |
| --- | --- | --- |
| 15-daqqa-author | 15-daqqa-author-0 | https://www.instagram.com/15_daqqa/ |
| 500-tatarskih-slov-lessons | 500-tatarskih-slov-lessons-4 | https://apps.apple.com/ru/app/500-татарских-слов/id1596649590 |
| adelya-abadeli-author | adelya-abadeli-author-0 | https://www.instagram.com/adelya.abadeli/ |
| adip-baygis-author | adip-baygis-author-0 | https://t.me/tarcemaxana |
| agidel-journal-media | agidel-journal-media-1 | https://agideljurn.ru/ |
| aivaz-radiosy-author | aivaz-radiosy-author-0 | https://t.me/AivazRadiosi |
| akbuzat-magazine-media | akbuzat-magazine-media-0 | https://akbuzat-rb.ru/ |
| alifba-lessons | alifba-lessons-2 | https://play.google.com/store/apps/details?id=ru.alifba |
| american-assoc-crimean-turks-lessons | american-assoc-crimean-turks-lessons-0 | https://www.kirimny.org/ |
| american-tatar-association-newsletter-media | american-tatar-association-newsletter-media-0 | https://atanyc.com/newsletter/ |
| american-turko-tatar-association-channel | american-turko-tatar-association-channel-2 | https://www.attasf.org/ |
| anda-tugel-channel | anda-tugel-channel-0 | https://t.me/andatugel |
| arhitekturasi-channel | arhitekturasi-channel-0 | https://t.me/arhitekturasi |
| arhiufa-channel | arhiufa-channel-0 | https://t.me/arhiufa |
| armanchyk-lessons | armanchyk-lessons-2 | https://armanciq.ru/ |
| ave-team-qirim-lessons | ave-team-qirim-lessons-0 | https://www.youtube.com/@Ave_Team_CRH/videos |
| ay-yola-channel | ay-yola-channel-0 | https://www.youtube.com/channel/UC1Xknaz3Tko0Q1D__4NjWqg |
| ayda-shayart-channel | ayda-shayart-channel-0 | https://t.me/aydashayart |
| azat-kashapov-author | azat-kashapov-author-0 | https://www.instagram.com/azatkashap/ |
| baigysh-media | baigysh-media-1 | https://baigysh.tatar/ |
| baron-author | baron-author-0 | https://t.me/BARON116 |
| bash-ort-lessons | bash-ort-lessons-4 | https://apps.apple.com/ru/app/id6788543388 |
| bashbatyr-lessons | bashbatyr-lessons-2 | https://play.google.com/store/apps/details?id=com.bashBatir |
| bashkort-fonts-graphics | bashkort-fonts-graphics-1 | https://bashkort.org/fonts/ |
| bashkortostan-kyzy-media | bashkortostan-kyzy-media-2 | https://bashkizi.ru/ |
| bashkortostan-newspaper-media | bashkortostan-newspaper-media-1 | https://bashgazet.ru/ |
| bashkyr-telegram-language | bashkyr-telegram-language-0 | https://t.me/bashkyr |
| basqala-project-lessons | basqala-project-lessons-0 | https://t.me/basqala_project |
| bolgar-radiosy-media | bolgar-radiosy-media-0 | https://bolgarradio.com/ |
| bookhane-author | bookhane-author-4 | https://podcasts.apple.com/ru/podcast/bookhane/id1516855970 |
| botendonya-bashkort-diktanty-community | botendonya-bashkort-diktanty-community-2 | https://bashdictant.ru/ |
| bulat-shaymi-author | bulat-shaymi-author-0 | https://www.youtube.com/@BulatShaymi |
| canli-radio-media | canli-radio-media-6 | https://canli.online/ |
| cemaat-media | cemaat-media-0 | https://www.cemaat.media/en/ |
| chamala-language | chamala-language-2 | https://play.google.com/store/apps/details?id=com.chamala.chamala |
| che-guglit-tatar-kyzy-channel | che-guglit-tatar-kyzy-channel-0 | https://t.me/cheguglittatarkyzy |
| chukynganskiy-goroskop-channel | chukynganskiy-goroskop-channel-0 | https://t.me/chukinganskigoroskop |
| codex-crimaeanicus-author | codex-crimaeanicus-author-0 | https://www.instagram.com/codex_crimaeanicus/ |
| crimean-tatar-corpus-language | crimean-tatar-corpus-language-1 | https://ctcorpus.org/en |
| crimean-tatar-english-playlist-lessons | crimean-tatar-english-playlist-lessons-0 | https://www.youtube.com/playlist?list=PL686ACZGmFlFY39qoIQiz_nytEWpWJ_dM |
| crimeantatars-club-media | crimeantatars-club-media-5 | https://www.crimeantatars.club/ |
| d-rt-media | d-rt-media-1 | https://dort-qirim.org/ |
| defne-author | defne-author-0 | https://www.instagram.com/defne.music/ |
| diana-chester-brooklyn-tatars-author | diana-chester-brooklyn-tatars-author-4 | https://dianachester.com/brooklyn-tatars/ |
| dikiy-tatar-kyzlary-author | dikiy-tatar-kyzlary-author-0 | https://www.instagram.com/instatatarki/ |
| diyar-im-media | diyar-im-media-1 | https://diyar.im/ |
| duo-mong-author | duo-mong-author-0 | https://www.instagram.com/tatar_pianist/ |
| ekatatar-channel | ekatatar-channel-0 | https://t.me/ekatatar |
| eldar-guseinov-ceramics-graphics | eldar-guseinov-ceramics-graphics-0 | https://www.instagram.com/ceramic_eldar_gusenov/ |
| elmaz-asanova-author | elmaz-asanova-author-5 | https://www.cam.ac.uk/this-cambridge-life/The-Crimean-Tatar-who-wants-freedom-for-Ukraine-to-sing-again |
| elvin-grey-author | elvin-grey-author-0 | https://www.instagram.com/elvin_grey_music/ |
| elvira-usmanova-author | elvira-usmanova-author-0 | https://www.instagram.com/elvira.usman/ |
| elza-is-author | elza-is-author-0 | https://www.instagram.com/elza_is/ |
| idel-graphics | idel-graphics-0 | https://idelmarket.ru/about |
| ilnar-idrisov-author | ilnar-idrisov-author-0 | https://www.instagram.com/idrisov98mzfk/ |
| ilshat-s-etov-author | ilshat-s-etov-author-4 | https://github.com/ilchats |
| im-crimean-tatar-channel | im-crimean-tatar-channel-0 | https://www.instagram.com/im_crimean_tatar/ |
| into-the-tatarverse-channel | into-the-tatarverse-channel-0 | https://www.youtube.com/@intothetatarverse |
| ipteshler-tatarlar-channel | ipteshler-tatarlar-channel-0 | https://t.me/ipteshler |
| iskandar-gaysin-author | iskandar-gaysin-author-0 | https://www.instagram.com/iskandargaysin/ |
| kamal-theatre-channel | kamal-theatre-channel-0 | https://t.me/kamalteatr |
| kazlarski-channel | kazlarski-channel-0 | https://t.me/kazlarski |
| kirim-dernegi-editorial-channel | kirim-dernegi-editorial-channel-1 | https://www.kirimdernegi.org.tr/ |
| kitap-fm-media | kitap-fm-media-0 | https://t.me/kitap_fm |
| kizik-mizik-channel | kizik-mizik-channel-0 | https://t.me/kizik_mizik |
| krimskiy-inzhir-community | krimskiy-inzhir-community-0 | https://www.instagram.com/qiriminciri/ |
| kyzyl-tan-media | kyzyl-tan-media-2 | https://kiziltan.ru/ |
| learn-tatar-author | learn-tatar-author-1 | https://learntatar.com |
| lisan-old-tatar-language | lisan-old-tatar-language-0 | https://lisan.tatar/ |
| marifet-community | marifet-community-0 | https://www.instagram.com/marifet.qirim/ |
| matur-suz-channel | matur-suz-channel-0 | https://t.me/matur_suz |
| millet-crimean-tatar-channel | millet-crimean-tatar-channel-0 | https://trkmillet.ru/ |
| millet-haberlare-author | millet-haberlare-author-0 | https://t.me/fauziyabayramova |
| milliard-tatar-media | milliard-tatar-media-1 | https://milliard.tatar/ |
| mincult-rt-channel | mincult-rt-channel-0 | https://t.me/mincult_rt |
| mir-kino-tatarkino-channel | mir-kino-tatarkino-channel-0 | https://t.me/tatarkino |
| moonchos-author | moonchos-author-0 | https://www.instagram.com/moonchos/ |
| ncktrp-museum-channel | ncktrp-museum-channel-0 | https://ncktrp.pl/ |
| north-american-tatar-summit-language | north-american-tatar-summit-language-0 | https://sites.duke.edu/tatarsu/ |
| ommazh-channel | ommazh-channel-0 | https://www.instagram.com/ommage.mp3/ |
| onykchyk-author | onykchyk-author-0 | https://t.me/onykchyk |
| ornament-by-adele-khadieva-graphics | ornament-by-adele-khadieva-graphics-0 | https://www.instagram.com/ornament_by_adelekhadieva/ |
| ornek-alem-graphics | ornek-alem-graphics-0 | https://www.ornek-crimea.com/about-ornek-en |
| palascom-author | palascom-author-0 | https://www.youtube.com/@palascom |
| piter-tatar-community | piter-tatar-community-0 | https://piter.tatar/ |
| provulok-author | provulok-author-4 | https://provulok.bandcamp.com/ |
| q-hub-crimean-platform | q-hub-crimean-platform-2 | https://qirimhub.com/ |
| qirim-online-media | qirim-online-media-1 | https://qirim.online/ |
| qirimname-channel | qirimname-channel-0 | https://www.instagram.com/qirimname/ |
| qirimtatar-tili-language | qirimtatar-tili-language-1 | https://qirimtatartili.app/en |
| rais-gabitov-author | rais-gabitov-author-0 | https://www.instagram.com/raissia_official/ |
| razil-gabbasov-author | razil-gabbasov-author-0 | https://www.instagram.com/razil_borchak/ |
| renata-asanova-author | renata-asanova-author-0 | https://www.instagram.com/asanova_renata/ |
| saf-radio-media | saf-radio-media-0 | https://t.me/safradio |
| salam-app-language | salam-app-language-4 | https://www.rustore.ru/catalog/app/novayu.proga.salam |
| seyahat-delisi-author | seyahat-delisi-author-0 | https://www.instagram.com/seyahat_delisi_/ |
| shayan-tv-channel | shayan-tv-channel-5 | https://tt.shayantv.ru/ |
| siksan-tuksan-channel | siksan-tuksan-channel-0 | https://t.me/siksan90 |
| skazki-povolzhya-lessons | skazki-povolzhya-lessons-0 | http://сказкиповолжья.рф/ |
| slovar-ganieva-language | slovar-ganieva-language-0 | https://ganiev.org/ |
| sptatar-writers-union-media | sptatar-writers-union-media-0 | https://sptatar.com/ |
| suomen-islam-seurakunta-tatar-courses | suomen-islam-seurakunta-tatar-courses-0 | https://tatar.fi/ |
| sympleza-tatarsko-russkiy-slovar-language | sympleza-tatarsko-russkiy-slovar-language-2 | https://play.google.com/store/apps/details?id=com.sympleza.tatrudictionaryfree |
| tabris-radif-channel | tabris-radif-channel-0 | https://t.me/tatmuz |
| tamirlar-media | tamirlar-media-0 | https://tamirlar.com/ |
| tarihikanal-channel | tarihikanal-channel-0 | https://t.me/tarihikanal |
| tatar-inform-media | tatar-inform-media-0 | https://tatar-inform.tatar/ |
| tatar-kniga-media | tatar-kniga-media-0 | https://t.me/tatarkniga |
| tatar-kyzy-contest-channel | tatar-kyzy-contest-channel-0 | https://t.me/tatarkizi_official |
| tatar-lane-channel | tatar-lane-channel-0 | https://www.youtube.com/@TatarLane |
| tatar-malay-author | tatar-malay-author-0 | https://www.instagram.com/tatar__malay/ |
| tatar-multfilm-channel | tatar-multfilm-channel-0 | https://tatarmultfilm.ru/ |
| tatar-prince-author | tatar-prince-author-0 | https://www.instagram.com/tatar.prince/ |
| tatar-sylu-author | tatar-sylu-author-0 | https://www.youtube.com/channel/UCoJlv-4ftT47WFgRZnGHiKg |
| tatar-tele-channel-language | tatar-tele-channel-language-0 | https://t.me/tatartili |
| tatar-yadkarlare-channel | tatar-yadkarlare-channel-0 | https://t.me/tatar_yadkarlare |
| tatarcha-audio-eserler-channel | tatarcha-audio-eserler-channel-0 | https://t.me/tatarkitap |
| tatarcha-standup-channel | tatarcha-standup-channel-0 | https://t.me/tatarchastandup |
| tatarcha-zhyrlar-channel | tatarcha-zhyrlar-channel-0 | https://t.me/tatarcha_zhyr |
| tatargram-channel | tatargram-channel-0 | https://t.me/tatartg |
| tataria-online-media | tataria-online-media-2 | https://www.tataria.online/ |
| tatarica-media | tatarica-media-1 | https://tatarica.org/ |
| tatariya-channel | tatariya-channel-0 | https://t.me/tatariya |
| tatarlar-info-media | tatarlar-info-media-3 | https://tatarlar.info/ |
| tatarskaya-i-bashkirskaya-klaviatura-pro-language | tatarskaya-i-bashkirskaya-klaviatura-pro-language-4 | https://apps.apple.com/ru/app/id6738088696 |
| tatarskiy-slovar-language | tatarskiy-slovar-language-0 | https://t.me/tatarskiyslovar |
| tatpolit-author | tatpolit-author-0 | https://t.me/tpolit |
| tnv-tatarstan-channel | tnv-tatarstan-channel-3 | https://tnv.ru/tat/ |
| trenazher-tatarskogo-yazyka-language | trenazher-tatarskogo-yazyka-language-2 | https://play.google.com/store/apps/details?id=ws.rebus.tat |
| tugantel-corpus-language | tugantel-corpus-language-0 | https://tugantel.tatar/?lang=tt |
| tuvgan-tilim-lessons | tuvgan-tilim-lessons-0 | https://www.instagram.com/tuvgantilim/ |
| uctr-romania-channel | uctr-romania-channel-1 | https://uctr.ro/ |
| uk-tatar-bashkir-society-channel | uk-tatar-bashkir-society-channel-0 | https://www.uktatars.org/ |
| unsigez-channel | unsigez-channel-0 | https://t.me/unsigez |
| urducktv-channel | urducktv-channel-0 | https://www.youtube.com/@UrduckTv |
| usein-bekirov-author | usein-bekirov-author-0 | https://www.youtube.com/c/useinbekirov |
| vatan-kirim-media | vatan-kirim-media-1 | https://www.vatankirim.net/ |
| vilnius-tatar-community-publications | vilnius-tatar-community-publications-2 | https://www.vatb.org/apie |
| vsemirny-kongress-tatar-media | vsemirny-kongress-tatar-media-1 | https://tatar-congress.org/ |
| wikimedia-tatar-language-group-language | wikimedia-tatar-language-group-language-3 | https://meta.wikimedia.org/wiki/Wikimedia_Community_of_Tatar_language_User_Group |
| written-tatar-corpus-language | written-tatar-corpus-language-0 | https://www.corpus.tatar/ |
| yamle-muzyka-media | yamle-muzyka-media-0 | https://t.me/yummmymusic |
| yanshishma-media | yanshishma-media-2 | https://yanshishma.com/ |
| yaratam-min-channel | yaratam-min-channel-0 | https://t.me/yaratam_min |
| your-yool-author | your-yool-author-0 | https://www.instagram.com/your.yool/ |
| yuk-bar-channel | yuk-bar-channel-0 | https://t.me/yukbar |
| ztrp-editorial-channel | ztrp-editorial-channel-1 | https://ztrp.pl/ |
