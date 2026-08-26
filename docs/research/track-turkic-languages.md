# Track 3 — Tatar / Turkic-language discovery

Research date: 2026-08-22. Scope is constrained by the repository schema: only
`tatar`, `bashkir`, and `crimean-tatar` projects are eligible. Searches in other
Turkic languages were used to find projects supporting those peoples; generic
Turkish/Kazakh/Uzbek projects were not retained.

## Candidates

Each entry is a proposed card, not yet a committed dataset record. `high` means
the primary project page was found and its purpose is explicit; `medium` means
the project is real but its current activity, canonical URL, or exact card
boundary should be checked once more during normalization.

### Tatar language, education, and digital resources

#### 1. `tugantel-corpus-language` — «Туган тел» татар гомумтел корпусы
- Alternative names: Tugan Tel; Татарский национальный корпус.
- Description: searchable general corpus of contemporary Tatar for research, teaching, and language learners.
- Facts: searches lexemes, word forms, and grammatical features; built with staff of the Tatarstan Academy of Sciences and KFU; includes texts supplied by Tatar periodicals and publishers.
- URL: https://tugantel.tatar/?lang=tt
- Category / peoples: `language`; `tatar`.
- Geography / languages: Tatarstan; Tatar interface and corpus, Russian interface.
- Evidence: https://tugantel.tatar/?lang=tt ; https://tugantel.tatar/?lang=en
- Status: high; no existing URL/name duplicate.

#### 2. `written-tatar-corpus-language` — Татар теленең язма корпусы
- Alternative names: Corpus of Written Tatar; Письменный корпус татарского языка.
- Description: large online written-language corpus with advanced morphological search.
- Facts: reports over 500 million words and 620 million tokens; supports searches by lemma, word form, and grammatical properties; offers interface material in Tatar, Russian, and English.
- URL: https://www.corpus.tatar/
- Category / peoples: `language`; `tatar`.
- Geography / languages: Tatarstan; Tatar, Russian, English.
- Evidence: https://www.corpus.tatar/ ; https://www.corpus.tatar/manuals/tatcorpus_instruction_tat.pdf
- Status: high; distinct from `tugantel` and existing `bashkir-corpus`.

#### 3. `tatar-speech-corpus-language` — Татар сөйләм корпусы
- Alternative names: Sintez corpus; Tatar speech corpus.
- Description: speech-oriented Tatar corpus and linguistic tools hosted within the corpus.tatar project.
- Facts: provides a dedicated `sintez` interface; describes the scale of the related written corpus; includes a “Дөрес яз!” writing tool entry.
- URL: https://sintez.corpus.tatar/tt
- Category / peoples: `language`; `tatar`.
- Geography / languages: Tatarstan; Tatar.
- Evidence: https://sintez.corpus.tatar/tt ; https://www.corpus.tatar/
- Status: medium; normalization must confirm it is sufficiently independent from candidate 2 for a separate card.

#### 4. `antat-tatzet-language` — «Татар теле» электрон ресурслар җыелмасы
- Alternative names: TatZet; ANTAT Tatar language resources.
- Description: Academy of Sciences hub linking Tatar dictionaries, corpora, terminology, and dialect resources.
- Facts: maintained on the Tatarstan Academy of Sciences domain; has separate dictionary and corpus groups; includes the electronic Tatar folk-dialect atlas.
- URL: https://www.antat.ru/tt/tatzet/
- Category / peoples: `language`; `tatar`.
- Geography / languages: Tatarstan; Tatar.
- Evidence: https://www.antat.ru/tt/tatzet/ ; https://suzlek.antat.ru/
- Status: high; hub card, avoid separately duplicating every linked dictionary unless it has an independent product identity.

#### 5. `suzlek-antat-language` — Татар теленең электрон сүзлекләр фонды
- Alternative names: suzlek.antat.ru; Electronic collection of Tatar dictionaries.
- Description: unified search over scholarly Tatar dictionaries published by the language institute.
- Facts: hosted by the Tatarstan Academy of Sciences; combines multiple lexicographic sources; supports direct headword search in a web interface.
- URL: https://suzlek.antat.ru/
- Category / peoples: `language`; `tatar`.
- Geography / languages: Tatarstan; Tatar and Russian dictionary material.
- Evidence: https://suzlek.antat.ru/ ; https://www.antat.ru/tt/tatzet/
- Status: high; related to candidate 4 but independently usable.

#### 6. `syzlek-ru-tat-language` — Сүзлек
- Alternative names: Syzlek.ru; Русча-татарча онлайн сүзлек.
- Description: lightweight bidirectional Russian–Tatar online dictionary.
- Facts: supports Russian-to-Tatar lookup; supports Tatar-to-Russian lookup; exposes a dedicated project-information page.
- URL: https://syzlek.ru/
- Category / peoples: `language`; `tatar`.
- Geography / languages: online; Tatar and Russian.
- Evidence: https://syzlek.ru/
- Status: high; no existing duplicate.

#### 7. `lisan-old-tatar-language` — Lisan.Tatar
- Alternative names: Lisan; لسان.
- Description: experimental AI assistant for reading, transcribing, and translating Old Tatar and Old Bashkir texts.
- Facts: converts Arabic-script source text into three transcription alphabets; provides translations in four languages; also presents an online library, genealogy, and metrical-book workspace.
- URL: https://lisan.tatar/
- Category / peoples: `language`; `tatar`, `bashkir`.
- Geography / languages: online/Tatarstan; Tatar, Bashkir, Russian, English.
- Evidence: https://lisan.tatar/
- Status: high; discovered by Tatar/Bashkir-script query, not present in cards.

#### 8. `tatar-nlp-sart-language` — SART
- Alternative names: Similarity, Analogies, and Relatedness for Tatar.
- Description: open benchmark datasets for evaluating Tatar word embeddings.
- Facts: contains 202 similarity word pairs; contains 252 relatedness pairs; its analogies set has 34 categories and 30,144 questions.
- URL: https://github.com/tat-nlp/SART
- Category / peoples: `language`; `tatar`.
- Geography / languages: international/open source; Tatar data, Russian instructions, English documentation.
- Evidence: https://github.com/tat-nlp/SART
- Status: high; no repository duplicate.

#### 9. `ud-tatar-nmctt-language` — UD Tatar-NMCTT
- Alternative names: NAIST Multilingual Corpus Tatar treebank.
- Description: manually annotated Tatar Universal Dependencies corpus.
- Facts: based on Tatar-Inform news texts; created within the NAIST Multilingual Corpus project; distributed in CoNLL-U with Universal Dependencies metadata.
- URL: https://github.com/UniversalDependencies/UD_Tatar-NMCTT
- Category / peoples: `language`; `tatar`.
- Geography / languages: Japan/Tatarstan; Tatar data, English documentation.
- Evidence: https://github.com/UniversalDependencies/UD_Tatar-NMCTT ; https://universaldependencies.org/treebanks/tt_nmctt/
- Status: high; no duplicate.

#### 10. `fastmorph-tatar-language` — Fastmorph
- Alternative names: Tatar corpus fast search engine.
- Description: open-source corpus search engine originally built for the Corpus of Written Tatar.
- Facts: searches word forms, lemmas, and morphological tags; supports masks and word-distance constraints; repository documents operation on a 116-million-occurrence corpus.
- URL: https://github.com/mansayk/fastmorph
- Category / peoples: `language`; `tatar`.
- Geography / languages: open source; Tatar data, English documentation.
- Evidence: https://github.com/mansayk/fastmorph
- Status: high; technical project distinct from the public corpus front end.

#### 11. `tatoxa-language` — Tatoxa
- Alternative names: Tatar text detoxification system.
- Description: open Tatar-language text detoxification model, pipeline, and annotated data.
- Facts: translates and adapts detoxification data from Russian to Tatar; adds 701 moderated annotated examples; publishes datasets and experiments with the implementation.
- URL: https://github.com/s-nlp/tatoxa
- Category / peoples: `language`; `tatar`.
- Geography / languages: international research; Tatar and Russian data, English documentation.
- Evidence: https://github.com/s-nlp/tatoxa
- Status: high; recent research resource, not in existing cards.

#### 12. `turkicnlp-language` — TurkicNLP
- Alternative names: Turkic NLP Toolkit.
- Description: multilingual NLP toolkit whose supported languages include Tatar, Bashkir, and Crimean Tatar.
- Facts: provides multilingual neural models; its morphological analyzer lists all three in-scope languages; also covers many neighboring Turkic languages and scripts.
- URL: https://github.com/turkic-nlp/turkicnlp
- Category / peoples: `language`; `tatar`, `bashkir`, `crimean-tatar`.
- Geography / languages: international; 20+ Turkic languages.
- Evidence: https://github.com/turkic-nlp/turkicnlp
- Status: high; eligible because all schema peoples are explicitly supported.

#### 13. `tatoeba-tatar-language` — Tatoeba: Tatar
- Alternative names: Tatar sentences on Tatoeba.
- Description: community-built Tatar sentence and translation dataset.
- Facts: exposes Tatar sentence browsing and search; connects sentences to translations in many languages; data can be downloaded under Tatoeba licensing terms.
- URL: https://tatoeba.org/en/sentences/show_all_in/tat/none
- Category / peoples: `language`; `tatar`.
- Geography / languages: international multilingual platform; Tatar.
- Evidence: https://tatoeba.org/en/sentences/show_all_in/tat/none ; https://tatoeba.org/en/downloads
- Status: medium; retain only if platform-language slices are accepted as projects.

#### 14. `common-voice-tatar-language` — Mozilla Common Voice: Tatar
- Alternative names: Common Voice tt.
- Description: crowdsourced open speech-data effort with a Tatar locale.
- Facts: collects validated voice clips and sentences; datasets are released for speech technology research; Tatar is represented as a distinct locale in dataset releases.
- URL: https://commonvoice.mozilla.org/tt
- Category / peoples: `language`; `tatar`.
- Geography / languages: global; Tatar.
- Evidence: https://commonvoice.mozilla.org/tt ; https://commonvoice.mozilla.org/en/datasets
- Status: medium; verify current locale landing behavior before card creation.

#### 15. `tatar-wikipedia-language` — Татар Википедиясе
- Alternative names: Tatar Wikipedia; Татарча Википедия.
- Description: community-edited encyclopedia in the Tatar language.
- Facts: uses its own `tt` Wikimedia edition; includes community, discussion, and help spaces in Tatar; provides freely licensed encyclopedia content and downloadable dumps.
- URL: https://tt.wikipedia.org/
- Category / peoples: `language`; `tatar`.
- Geography / languages: global; Tatar.
- Evidence: https://tt.wikipedia.org/ ; https://dumps.wikimedia.org/ttwiki/
- Status: high; not a duplicate of the existing Wikimedia user-group card.

#### 16. `tatar-multfilm-channel` — «Татармультфильм»
- Alternative names: Татармультфильм берләшмәсе; Tatarmultfilm.
- Description: animation studio publishing Tatar-language children’s films and interactive learning projects.
- Facts: creates animations from works by Tatar writers; built the BALA multimedia library; announced the interactive `Мульт дәрес` language-learning complex.
- URL: https://www.tatarmultfilm.ru/
- Category / peoples: `channel`; `tatar`.
- Geography / languages: Kazan, Tatarstan; Tatar and Russian.
- Evidence: https://www.tatarmultfilm.ru/ ; https://www.tatarmultfilm.ru/news/interaktivnyi-kompleks-mult-d-res
- Status: high; studio itself is absent from current cards.

#### 17. `skazki-povolzhya-lessons` — «Сказки Поволжья»
- Alternative names: Идел буе әкиятләре; Multimedia Tales of the Volga Region.
- Description: illustrated and voiced online folklore library supporting study of Tatar and other Volga languages.
- Facts: created with a Presidential Grants Foundation grant; combines illustrations, text, and audio; explicitly designed for children learning Tatar, Chuvash, Mari, Mordvin, and Udmurt cultures and languages.
- URL: https://сказкиповолжья.рф/
- Category / peoples: `lessons`; `tatar`.
- Geography / languages: Volga region/global online; Russian and regional languages including Tatar.
- Evidence: https://сказкиповолжья.рф/about
- Status: high; not in existing cards.

### Tatar media and channels discovered through Tatar queries

#### 18. `yalkyn-media` — «Ялкын» журналы
- Description: century-old Tatar youth magazine and online media project.
- Facts: focuses on teenagers and young people; states preservation and development of Tatar among its goals; publishes culture, creativity, careers, and youth material.
- URL: https://yalkyn.ru/
- Category / peoples: `media`; `tatar`.
- Geography / languages: Kazan/Tatarstan; primarily Tatar.
- Evidence: https://yalkyn.ru/ ; https://yalkyn.ru/catalog/ialkyn-zurnaly-tarixy
- Status: high; no duplicate.

#### 19. `sabantuy-journal-media` — «Сабантуй» балалар журналы
- Alternative names: Sabantuy children's magazine.
- Description: Tatar-language children’s magazine with an active web edition.
- Facts: publishes stories, puzzles, educational and ethical material; founded as a print title and now operates as a magazine; official site identifies Tatmedia as founder.
- URL: https://sabantuyjournal.ru/
- Category / peoples: `media`; `tatar`.
- Geography / languages: Kazan/Tatarstan; Tatar.
- Evidence: https://sabantuyjournal.ru/
- Status: high.

#### 20. `vatanym-tatarstan-media` — «Ватаным Татарстан»
- Description: Tatar-language public and political newspaper with a full web edition.
- Facts: official site describes it as a Tatar-language newspaper; covers society, economy, culture, and health; maintains issue and article archives.
- URL: https://vatantat.tatmedia.ru/
- Category / peoples: `media`; `tatar`.
- Geography / languages: Kazan/Tatarstan; Tatar.
- Evidence: https://vatantat.tatmedia.ru/
- Status: high.

#### 21. `shahri-kazan-media` — «Шәһри Казан»
- Alternative names: Шахри Казан; Şähri Qazan.
- Description: Kazan-based Tatar newspaper and online publication.
- Facts: publishes current affairs and city/republic reporting; is listed by the Tatarstan Academy among major Tatar-language online periodicals; operates under the Tatmedia publishing network.
- URL: https://shahrikazan.ru/
- Category / peoples: `media`; `tatar`.
- Geography / languages: Kazan/Tatarstan; Tatar.
- Evidence: https://shahrikazan.ru/ ; https://antat.ru/ru/iyli/publishing/book/2024/Конф-язык-2024%20%281%29.pdf
- Status: high.

#### 22. `syuyumbike-journal-media` — «Сөембикә» журналы
- Alternative names: Syuyumbike; Sөyembikə.
- Description: long-running Tatar women’s magazine and online publication.
- Facts: publishes family, culture, history, literature, and contemporary-life sections; has a Tatar-language web edition; is a distinct Tatmedia periodical.
- URL: https://syuyumbike.ru/
- Category / peoples: `media`; `tatar`.
- Geography / languages: Kazan/Tatarstan; Tatar and some Russian.
- Evidence: https://syuyumbike.ru/
- Status: high.

#### 23. `shayan-tv-channel` — «ШАЯН ТВ»
- Alternative names: Shayan TV.
- Description: dedicated children’s television channel broadcasting in Tatar.
- Facts: carries cartoons, educational programs, and children’s entertainment; created as a Tatar-language channel; maintains online video and program access.
- URL: https://shayantv.ru/
- Category / peoples: `channel`; `tatar`.
- Geography / languages: Tatarstan; Tatar.
- Evidence: https://shayantv.ru/ ; https://tnv.ru/about/shayan-tv/
- Status: high.

#### 24. `tnv-tatarstan-channel` — «ТНВ-Татарстан»
- Alternative names: Яңа Гасыр; TNV.
- Description: major television and radio broadcaster with extensive Tatar-language programming.
- Facts: runs television, radio, and online video services; broadcasts news, culture, entertainment, and children’s programs; has a dedicated Tatar-language site interface.
- URL: https://tnv.ru/tat/
- Category / peoples: `channel`; `tatar`.
- Geography / languages: Tatarstan and satellite audience; Tatar and Russian.
- Evidence: https://tnv.ru/tat/ ; https://tnv.ru/about/
- Status: high; distinct from existing individual radio cards.

#### 25. `tmtv-channel` — TMTV
- Alternative names: Татар музыкаль телеканалы.
- Description: television and online channel centered on contemporary Tatar music.
- Facts: publishes Tatar music videos and artist programs; operates a continuous TV brand; maintains official online and social video distribution.
- URL: https://tmtv-online.ru/
- Category / peoples: `channel`; `tatar`.
- Geography / languages: Tatarstan; Tatar and Russian.
- Evidence: https://tmtv-online.ru/
- Status: medium; verify canonical site availability and official social links.

### Bashkir-language discovery

#### 26. `agidel-journal-media` — «Ағиҙел» журналы
- Alternative names: Agidel literary journal.
- Description: Bashkir literary, artistic, and public-affairs magazine with an active web edition.
- Facts: publishes prose, poetry, criticism, and news; site content is predominantly Bashkir; subscription and editorial information are exposed on the official site.
- URL: https://agideljurn.ru/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Ufa/Bashkortostan; Bashkir.
- Evidence: https://agideljurn.ru/
- Status: high; no duplicate.

#### 27. `shonkar-journal-media` — «Шоңҡар» журналы
- Alternative names: Shonqar; Шонкар.
- Description: Bashkir youth literary and public-affairs magazine and website.
- Facts: publishes in Bashkir; covers society, literature, culture, economics, and youth themes; traces its independent publication history to 1994.
- URL: https://shonkar.com/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Ufa/Bashkortostan; Bashkir.
- Evidence: https://shonkar.com/
- Status: high.

#### 28. `amanat-journal-media` — «Аманат» журналы
- Description: monthly Bashkir children’s and youth literary-publicistic magazine.
- Facts: first appeared in 1929 under the name `Керпе`; later used the name `Пионер`; publishes creative and educational material for school-age readers in Bashkir.
- URL: https://amanat.rbsmi.ru/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Ufa/Bashkortostan; Bashkir.
- Evidence: https://amanat.rbsmi.ru/ ; https://kitaptar.bashkort.org/
- Status: medium; verify current canonical domain (historic `journal1amanat.ru` also appears in sources).

#### 29. `akbuzat-journal-media` — «Аҡбуҙат» журналы
- Description: illustrated Bashkir magazine for preschool and primary-school children.
- Facts: targets younger children than `Аманат`; publishes stories, poems, folklore, and creative tasks; used by educators in Bashkir-language reading lessons.
- URL: https://akbuzat.rbsmi.ru/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Ufa/Bashkortostan; Bashkir.
- Evidence: https://akbuzat.rbsmi.ru/ ; https://kitaptar.bashkort.org/
- Status: medium; recheck canonical domain during normalization.

#### 30. `bashkortostan-newspaper-media` — «Башҡортостан» гәзите
- Alternative names: Bashkortostan newspaper.
- Description: national public-political newspaper published in Bashkir.
- Facts: covers republic news, society, culture, and language; maintains a web edition; is a separate Bashkir-language editorial title.
- URL: https://bashgazet.ru/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Ufa/Bashkortostan; Bashkir.
- Evidence: https://bashgazet.ru/
- Status: high.

#### 31. `yeshlek-newspaper-media` — «Йәшлек» гәзите
- Alternative names: Yeshlek; Йәштәр гәзите.
- Description: Bashkir-language youth-oriented newspaper and online publication.
- Facts: publishes republic news and social reporting; addresses youth and family themes; provides an active Bashkir web feed.
- URL: https://ye102.ru/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Bashkortostan; Bashkir.
- Evidence: https://ye102.ru/
- Status: high.

#### 32. `bashkortostan-kyzy-media` — «Башҡортостан ҡыҙы»
- Alternative names: Bashkortostan Kyzy.
- Description: Bashkir-language women’s magazine and online publication.
- Facts: covers women’s lives, family, literature, health, and culture; publishes original Bashkir material; has an identifiable independent editorial brand.
- URL: https://bashkizi.ru/
- Category / peoples: `media`; `bashkir`.
- Geography / languages: Ufa/Bashkortostan; Bashkir.
- Evidence: https://bashkizi.ru/
- Status: high.

#### 33. `kurai-tv-channel` — «Ҡурай ТВ»
- Alternative names: Kurai TV.
- Description: Bashkir music and culture television/online channel.
- Facts: foregrounds Bashkir songs, performers, and cultural programming; uses Bashkir naming and presentation; distributes video through broadcast and online platforms.
- URL: https://kurai.tv/
- Category / peoples: `channel`; `bashkir`.
- Geography / languages: Bashkortostan; Bashkir and Russian.
- Evidence: https://kurai.tv/
- Status: medium; verify current live site and official ownership.

#### 34. `bashkort-tele-wikipedia-language` — Башҡорт Википедияһы
- Alternative names: Bashkir Wikipedia; Башҡортса Википедия.
- Description: community-edited encyclopedia in Bashkir.
- Facts: has its own `ba` Wikimedia edition; hosts community and help pages in Bashkir; releases freely licensed database dumps.
- URL: https://ba.wikipedia.org/
- Category / peoples: `language`; `bashkir`.
- Geography / languages: global; Bashkir.
- Evidence: https://ba.wikipedia.org/ ; https://dumps.wikimedia.org/bawiki/
- Status: high; existing Wikimedia user group card is not this encyclopedia edition.

#### 35. `tarat-bashkir-dictionary-language` — Tarat башҡорт һүҙлеге
- Alternative names: Tarat.ru Russian–Bashkir dictionary.
- Description: searchable Russian–Bashkir online dictionary and translation resource.
- Facts: offers Russian-to-Bashkir word entries; publishes Bashkir examples and related results; is usable through direct word URLs without an app installation.
- URL: https://tarat.ru/targema/ru/ba
- Category / peoples: `language`; `bashkir`.
- Geography / languages: online; Bashkir and Russian.
- Evidence: https://tarat.ru/targema/word/ru/ba/10665
- Status: medium; verify canonical landing URL and whether enough independent project information exists.

### Crimean Tatar discovery through Qırımtatarca and Turkish queries

#### 36. `qirimca-directory-media` — Qırımca.org
- Alternative names: Crimean Tatar Projects directory.
- Description: curated multilingual directory devoted to Crimean Tatar language, culture, education, and media projects.
- Facts: groups entries by language, education, culture, and media tags; provides individual project profiles; publishes Ukrainian and English interfaces.
- URL: https://qirimca.org/
- Category / peoples: `media`; `crimean-tatar`.
- Geography / languages: Ukraine/global diaspora; Ukrainian, English, Crimean Tatar names.
- Evidence: https://qirimca.org/ ; https://qirimca.org/index.php/en/projects
- Status: high; several existing cards cite it, but the directory itself has no card.

#### 37. `oda-qirim-channel` — Oda
- Alternative names: Oda Telegram channel; Sevilla Kenji's Oda.
- Description: journalist-led Telegram channel about Crimean Tatar culture and contemporary life.
- Facts: created by journalist Sevilla Kenji; classified by Qırımca as Crimean Tatar culture and media; uses a channel format rather than a standalone news site.
- URL: https://qirimca.org/index.php/en/projects/oda
- Category / peoples: `channel`; `crimean-tatar`.
- Geography / languages: Ukraine/Crimea; Crimean Tatar and Ukrainian/Russian context.
- Evidence: https://qirimca.org/index.php/en/projects ; https://qirimca.org/index.php/en/tags/tags-mass-media
- Status: medium; resolve the direct Telegram URL from the profile before card creation.

#### 38. `tamirlar-media` — Tamırlar
- Alternative names: Тамырлар; Roots.
- Description: multimedia archive of testimonies from survivors of the Crimean Tatar deportation.
- Facts: records personal deportation stories; is explicitly described as a multimedia platform; preserves Crimean Tatar historical memory through first-person accounts.
- URL: https://qirimca.org/index.php/en/projects/tamirlar
- Category / peoples: `media`; `crimean-tatar`.
- Geography / languages: Crimea/Ukraine and diaspora; Crimean Tatar, Ukrainian/Russian context.
- Evidence: https://qirimca.org/index.php/en/projects ; https://qirimca.org/index.php/en/tags/tags-mass-media
- Status: medium; verify profile slug and primary platform URL.

#### 39. `polylogue-unity-lessons` — Polylogue of Unity
- Alternative names: Полілог єдності.
- Description: Crimean Tatar video-lesson series published by Franko TV.
- Facts: consists of language lessons; delivered as video; indexed by Qırımca under Crimean Tatar language and education.
- URL: https://qirimca.org/index.php/en/projects/polylogue-of-unity
- Category / peoples: `lessons`; `crimean-tatar`.
- Geography / languages: Ukraine; Crimean Tatar and Ukrainian.
- Evidence: https://qirimca.org/index.php/en/projects
- Status: medium; replace directory profile with direct Franko TV playlist during normalization.

#### 40. `elifbe-krym-realii-lessons` — «Elifbe» на Krym.Realii
- Alternative names: Elifbe; Элифбе.
- Description: structured Crimean Tatar video-lesson series from Krym.Realii.
- Facts: teaches the alphabet and practical language; published as a sequence of video lessons; is separately indexed as an education project by Qırımca.
- URL: https://qirimca.org/index.php/en/projects/elifbe-on-krym-realii
- Category / peoples: `lessons`; `crimean-tatar`.
- Geography / languages: Ukraine/international; Crimean Tatar, Russian/Ukrainian explanations.
- Evidence: https://qirimca.org/index.php/en/projects
- Status: medium; direct playlist URL required; not a duplicate of the existing `Krym.Realii` media card because this is its course.

#### 41. `ave-team-qirim-channel` — Ave Team Qırım
- Alternative names: Ave Team Qirim.
- Description: YouTube channel presenting everyday issues and Crimean Tatar perspectives during the Russia–Ukraine war.
- Facts: video-first project; explicitly associated with Crimean Tatar language and education by Qırımca; focuses on contemporary lived experience rather than institutional news.
- URL: https://qirimca.org/index.php/en/projects/ave-team-qirim
- Category / peoples: `channel`; `crimean-tatar`.
- Geography / languages: Ukraine; Crimean Tatar/Ukrainian.
- Evidence: https://qirimca.org/index.php/en/projects
- Status: medium; resolve direct YouTube channel URL.

#### 42. `qirimtatar-wikipedia-language` — Qırımtatarca Vikipediya
- Alternative names: Crimean Tatar Wikipedia; Qırımtatar Vikipediyası.
- Description: community-edited encyclopedia in Crimean Tatar.
- Facts: has its own `crh` Wikimedia edition; uses Crimean Tatar Latin orthography; provides openly licensed articles and database dumps.
- URL: https://crh.wikipedia.org/
- Category / peoples: `language`; `crimean-tatar`.
- Geography / languages: global; Crimean Tatar.
- Evidence: https://crh.wikipedia.org/ ; https://dumps.wikimedia.org/crhwiki/
- Status: high.

#### 43. `qirimtatar-sketch-engine-language` — Crimean Tatar on Sketch Engine
- Alternative names: Qırımtatar tili Sketch Engine korpusı.
- Description: Crimean Tatar corpus access and analysis environment on Sketch Engine.
- Facts: indexed as a separate Crimean Tatar language project by Qırımca; provides corpus-style concordance and linguistic analysis; aimed at researchers and language-resource users.
- URL: https://qirimca.org/index.php/en/projects/crimean-tatar-language-on-sketch-engine
- Category / peoples: `language`; `crimean-tatar`.
- Geography / languages: international; Crimean Tatar, English interface.
- Evidence: https://qirimca.org/ ; https://www.sketchengine.eu/
- Status: medium; confirm public-access corpus URL and avoid duplicating the existing National Corpus.

#### 44. `qirimtatar-anki-language` — Crimean Tatar on Anki
- Alternative names: Qırımtatarca Anki cards.
- Description: curated spaced-repetition deck/resource for Crimean Tatar vocabulary study.
- Facts: indexed by Qırımca as a Crimean Tatar language project; uses flashcard-based repetition; is separate from Memrise and the standalone Qırımtatar Tili app already in the catalog.
- URL: https://qirimca.org/index.php/en/projects/crimean-tatar-language-on-anki
- Category / peoples: `language`; `crimean-tatar`.
- Geography / languages: global; Crimean Tatar with learner-language translations.
- Evidence: https://qirimca.org/
- Status: medium; resolve and test the actual AnkiWeb deck link.

#### 45. `qirimtatar-quizlet-language` — Crimean Tatar on Quizlet
- Alternative names: Qırımtatarca Quizlet sets.
- Description: curated Quizlet learning sets for Crimean Tatar.
- Facts: indexed as a project by Qırımca; provides vocabulary flashcards and self-testing; differs from the existing Memrise card and language apps.
- URL: https://qirimca.org/index.php/en/projects/crimean-tatar-language-on-quizlet
- Category / peoples: `language`; `crimean-tatar`.
- Geography / languages: global; Crimean Tatar.
- Evidence: https://qirimca.org/
- Status: medium; direct Quizlet owner/set URL must be verified.

#### 46. `armanciq-language` — Armançıq
- Alternative names: Armancik.
- Description: Crimean Tatar children’s language/culture project listed by Qırımca.
- Facts: presented as its own named project; associated with Crimean Tatar learning resources; aimed at a younger audience than general corpus and media products.
- URL: https://qirimca.org/index.php/en/projects/armanciq
- Category / peoples: `language`; `crimean-tatar`.
- Geography / languages: Ukraine/Crimea; Crimean Tatar.
- Evidence: https://qirimca.org/
- Status: medium-low; keep in research log but require profile and primary-link verification before normalization.

#### 47. `crimean-tatars-project-channel` — Crimean Tatars
- Description: social-media project about Crimean Tatar identity and culture indexed by Qırımca.
- Facts: appears as a distinct named project in the Qırımca directory; tagged as Crimean Tatar media; separate from the `I'm Crimean Tatar` account already present in the dataset.
- URL: https://qirimca.org/index.php/en/projects/crimean-tatars
- Category / peoples: `channel`; `crimean-tatar`.
- Geography / languages: Crimea/diaspora; multilingual.
- Evidence: https://qirimca.org/ ; https://qirimca.org/index.php/en/tags/tags-mass-media
- Status: medium-low; deduplicate against similarly named social accounts after resolving its direct URL.

#### 48. `diyar-im-media` — diyar.im
- Alternative names: Diyarım / diyar.im.
- Description: named Crimean Tatar digital project surfaced through the Qırımca ecosystem.
- Facts: listed independently in the directory; associated with Crimean Tatar culture/language; has a distinct brand rather than being a directory category.
- URL: https://qirimca.org/index.php/en/projects/diyar-im
- Category / peoples: `media`; `crimean-tatar`.
- Geography / languages: Crimea/Ukraine; Crimean Tatar.
- Evidence: https://qirimca.org/
- Status: medium-low; inspect project profile and current external URL before adding.

## Rejected or held outside the candidate count

- Generic Kazakh, Turkish, Uzbek, Kyrgyz, Azerbaijani, and Turkmen language
  products: out of schema unless they explicitly support Tatar, Bashkir, or
  Crimean Tatar. Searches in these languages mostly returned generic language
  learning businesses.
- `Apertium tat-bak`, `Bashkir Corpus`, `Qırımtatar national corpus`, `Memrise
  Crimean Tatar`, `Qırım Junior`, `Ana Yurt`, `BÜLBÜL`, `Canlı`, `Devlet Saray`,
  `Kırım Akademiyası`, `Qırım` newspaper, `Krym.Realii`: already represented in
  `data/cards`.
- Bluebird, Ak Bure, Salam, Tatar M(A)L, Lugat, Nurbay, Keyman, and Ana Tele:
  already represented.
- Tatoeba Challenge bitext tables and OPUS language pairs: useful evidence and
  datasets, but held to avoid fragmenting one umbrella corpus into many cards.
- Google corpuscrawler and generic CLD/Stanza language-support code: Tatar or
  Bashkir support is incidental, not a people-focused standalone project.
- `Берлек теле` Reddit proposal and the newly announced `Тәмугъ` comic: no
  stable, independently verifiable project endpoint yet.
- `Әлифба 2.0` and `Мульт дәрес`: credible new 2026 products, but no stable
  public product/app URL found yet; recheck after public release.
- `Tatarile.org` library/audio pages: sources reference them, but current
  canonical availability was not sufficiently verified in this pass.
- Organizations and cultural associations without an eligible category were
  intentionally left to the RU/CIS and diaspora tracks.

## Language and source metrics

The following are actual query families used in this track (not a claim of
exhaustive use of every language requested by the master prompt):

| Language / script | Example real query | Unique candidate discoveries |
|---|---|---:|
| Tatar Cyrillic (`tt`) | `татарча татар теле онлайн сүзлек корпус дәресләр проект` | 17 |
| Bashkir Cyrillic (`ba`) | `башҡортса башҡорт теле онлайн һүҙлек корпус дәрестәр проект` | 10 |
| Crimean Tatar Latin (`crh`) | `qırımtatar tili luğat dersler media projesi` | 13 |
| Turkish (`tr`) | `qırımtatarca sözlük online proje ders platform` | 2 (overlap removed) |
| Russian (`ru`) | `татар телендә журнал газета сайт Ялкын Сабантуй`; `башкирский онлайн словарь` | 5 |
| English (`en`) | `site:github.com Tatar language NLP corpus dictionary`; `site:huggingface.co Tatar Bashkir Crimean Tatar dataset model` | 8 (several overlap with tt) |
| Kazakh (`kk`) | combinations of `татар тілі`, `қырымтатар тілі`, `жоба` | 0 eligible unique |
| Uzbek (`uz`) | combinations of `tatar tili`, `qirim tatar`, `loyiha` | 0 eligible unique |
| Kyrgyz (`ky`) | combinations of `татар тили`, `кырым татар`, `долбоор` | 0 eligible unique |
| Azerbaijani (`az`) | combinations of `tatar dili`, `Krım tatar`, `layihə` | 0 eligible unique |

Numbers overlap across query languages; the candidate total is 48 unique
records after comparison with all 123 existing filenames, names, and URLs.

Source types actually used:

- official project and editorial sites;
- Tatarstan Academy of Sciences and university/research infrastructure;
- GitHub repositories and Universal Dependencies;
- Wikimedia editions and dump endpoints;
- Qırımca's specialist Crimean Tatar project directory;
- platform/app listings and institutional publications used as secondary
  corroboration.

## Remaining gaps and recommended verification order

1. Resolve direct Telegram/YouTube/Anki/Quizlet links for Qırımca-derived
   medium-confidence candidates before generating cards.
2. Check canonical domains for the Bashkir RBSMI magazines (`Аманат`,
   `Аҡбуҙат`) and whether the older domains redirect cleanly.
3. Revisit app stores for the newly announced `Әлифба 2.0`; it could become a
   strong `language` candidate once the official listing is public.
4. Search VK and Telegram internally for Tatar/Bashkir-language micro-media;
   ordinary web indexing exposed relatively few of these.
5. Verify whether `sintez.corpus.tatar` is a separate speech product or merely a
   mode of the written corpus; merge candidates 2 and 3 if branding/ownership
   does not support separate cards.
6. During normalization, prioritize high-confidence candidates 1–2, 4–12,
   15–24, 26–27, 30–32, 34, 36, and 42; keep lower-confidence directory entries
   in the research log until their primary endpoint is confirmed.
