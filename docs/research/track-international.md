# Track 2 - International / Diaspora Discovery

Research date: 2026-08-22. This is a discovery artifact, not import-ready card data. No `data/cards/**` files were changed.

## Method and dataset guardrails

- Existing dataset checked: 123 cards; names and slugs were compared case-insensitively.
- Source-of-truth schema checked in `src/content.config.ts`: only `channel`, `author`, `media`, `language`, `lessons`, `graphics`; peoples only `tatar`, `bashkir`, `crimean-tatar`; every eventual card needs 3-4 facts.
- An association is **not** included merely because it exists. A candidate below is its distinct public editorial, teaching, publishing, archive, or creator surface that can honestly use one of the six categories.
- “Verified” means the primary URL and the core claims were confirmed in an official/first-party page or an authoritative institutional source during this pass. “Review” means relevant and likely usable, but the final importer should re-check activity, canonical URL, and whether the surface is sufficiently independent for a card.
- URLs shown as evidence were reachable/indexed during research; social-platform pages may still require an interactive-browser check before import.

## High-confidence candidates

### 1. `american-turko-tatar-association-channel`
- **Name:** American Turko-Tatar Association - cultural channel
- **Description:** California diaspora site publishing the history, events, and cultural life of the American Turko-Tatar community.
- **Facts:** established in 1960; based in Burlingame/San Francisco Bay Area; founded by immigrants from Tatar communities in China, Japan, Korea, and Turkey; explicitly works to preserve Tatar culture and religious traditions.
- **Primary URL:** https://www.attasf.org/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** USA (California); English, with Tatar/Turkish cultural material.
- **Evidence:** https://www.attasf.org/our-story.html ; https://www.attasf.org/
- **Confidence / status:** high / verified; not the existing New York ATA newsletter.

### 2. `uk-tatar-association-language-school`
- **Name:** UK Tatar Association Language School
- **Description:** London-based community language classes and library activity focused on transmitting Tatar language and culture.
- **Facts:** UKTA was formally established in 2012; language school is listed among its recurring activities; its charitable objectives explicitly include language classes and a library; it also runs youth and cultural events.
- **Primary URL:** https://en.tatar.org.uk/about-ukta/
- **Category / people:** `lessons` / `tatar`
- **Geography / languages:** United Kingdom (London); Tatar, English.
- **Evidence:** https://en.tatar.org.uk/about-ukta/ ; https://register-of-charities.charitycommission.gov.uk/
- **Confidence / status:** high / verified.

### 3. `uk-tatar-association-channel`
- **Name:** United Kingdom Tatar Association
- **Description:** Public diaspora channel documenting UK Tatar festivals, education, volunteering, and youth activity.
- **Facts:** independent non-political organization; established in 2012; publishes information about Sabantuy, Nowruz, school and youth activities; maintains English and Russian site versions.
- **Primary URL:** https://en.tatar.org.uk/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** UK; English, Russian, some Tatar.
- **Evidence:** https://en.tatar.org.uk/about-ukta/ ; https://en.tatar.org.uk/
- **Confidence / status:** high / verified; distinct from the school only if editorial activity is retained as the card subject.

### 4. `uk-tatar-bashkir-society-channel`
- **Name:** UK Tatar Bashkir Society
- **Description:** UK public channel for joint Tatar and Bashkir cultural activity, community history, and events.
- **Facts:** presents itself as the UK Tatar Bashkir Society; has a dedicated “Our Story” section; operates a standalone public website; serves both Tatar and Bashkir audiences.
- **Primary URL:** https://www.uktatars.org/
- **Category / people:** `channel` / `tatar`, `bashkir`
- **Geography / languages:** UK; English, Russian/Tatar in community material.
- **Evidence:** https://www.uktatars.org/ ; https://www.uktatars.org/our-story
- **Confidence / status:** medium-high / verified core identity; re-check publishing cadence.

### 5. `forum-of-european-tatars-channel`
- **Name:** Forum of European Tatars
- **Description:** Multilingual European diaspora platform publishing a programme and resources on language, education, media, and cooperation among Tatars in Europe.
- **Facts:** first announced forum is in Frankfurt, 25-27 September 2026; working languages are Tatar and English; programme includes diaspora education and media; explicitly aims to establish recurring European coordination.
- **Primary URL:** https://www.tatarforum.eu/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** Germany / Europe; Tatar, English.
- **Evidence:** https://www.tatarforum.eu/
- **Confidence / status:** high / verified; event-platform candidate, reassess longevity after September 2026.

### 6. `suomen-islam-seurakunta-tatar-courses`
- **Name:** Suomen Islam-seurakunta - Tatar language courses
- **Description:** Long-running Finnish Tatar community teaching programme for language, culture, religion, and history.
- **Facts:** the congregation has provided Tatar instruction since the community school closed; offers summer and winter courses; teaching covers language, culture, religion, and history; serves one of Finland’s oldest minority-language communities.
- **Primary URL:** https://tatar.fi/
- **Category / people:** `lessons` / `tatar`
- **Geography / languages:** Finland (Helsinki); Tatar, Finnish, Swedish.
- **Evidence:** https://www.sverigesradio.se/artikel/6593395 ; https://rm.coe.int/168008b5b9 ; https://historia.hel.fi/fi/ilmiot/helsingin-asukkaat/helsingin-tataarit
- **Confidence / status:** high / verified via government/public-broadcaster sources; confirm canonical course page.

### 7. `suomen-tatarit-publications`
- **Name:** Suomen tataarit - community publications
- **Description:** Finnish Tatar publishing activity producing books, learning materials, periodicals, music, and children’s language resources.
- **Facts:** Helsinki’s official history portal identifies the congregation and cultural association as active publishers; materials include books and educational resources; newborn families receive a language-and-culture resource box; publication work supports the Mishar Tatar community.
- **Primary URL:** https://tatar.fi/
- **Category / people:** `media` / `tatar`
- **Geography / languages:** Finland; Tatar, Finnish.
- **Evidence:** https://historia.hel.fi/fi/ilmiot/helsingin-asukkaat/helsingin-tataarit ; https://um.fi/documents/35732/0/ECRML_VI_raportti_2023.pdf/
- **Confidence / status:** medium-high / verified activity; import only after a stable publications index is located.

### 8. `super-tatar-rhythm-etno-band-channel`
- **Name:** Super Tatar Rhythm & Etno Band
- **Description:** International Finnish-Tatar music project presenting Tatar folk repertoire through rock, jazz, blues, and classical influences.
- **Facts:** sings in Tatar; formed by musicians living in multiple countries; led vocally by Helsinki-based Deniz Bedretdin; its first album combined Tatar folk music with Western genres.
- **Primary URL:** https://www.sverigesradio.se/artikel/6593395
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** Finland, Germany, Tatarstan; Tatar, Finnish/Swedish media coverage.
- **Evidence:** https://www.sverigesradio.se/artikel/6593395
- **Confidence / status:** high identity, medium URL / review; locate official music or video channel before import.

### 9. `lietuvos-totoriai-newspaper`
- **Name:** Lietuvos totoriai
- **Description:** Newspaper of Lithuania’s Tatar communities covering community life, history, and connections with Tatars abroad.
- **Facts:** founded in 1995; published by the Union of Lithuanian Tatar Communities; government-hosted archive includes issue 187 from 2026; supported in part by Lithuania’s Department of National Minorities.
- **Primary URL:** https://tmde.lrv.lt/lt/veiklos-sritys-1/leidiniai-ir-publikacijos/tautiniu-bendruomeniu-leidiniai/lietuvos-totoriai/
- **Category / people:** `media` / `tatar`
- **Geography / languages:** Lithuania; Lithuanian, Polish/Russian in historical/community material.
- **Evidence:** https://tmde.lrv.lt/lt/veiklos-sritys-1/leidiniai-ir-publikacijos/tautiniu-bendruomeniu-leidiniai/lietuvos-totoriai/ ; https://www.vle.lt/straipsnis/lietuvos-totoriai/
- **Confidence / status:** high / verified.

### 10. `lietuvos-totoriu-istorijos-muziejus-channel`
- **Name:** Lietuvos totorių istorijos muziejus
- **Description:** Lithuanian Tatar history museum’s digital channel, combining current community news with a newspaper archive and historical exhibitions.
- **Facts:** maintains an online gallery of “Lietuvos totoriai” issues; publishes current exhibition and community news; based in Kaunas; provides a stable archive reaching recent 2026 material.
- **Primary URL:** https://ltim.lt/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** Lithuania (Kaunas); Lithuanian.
- **Evidence:** https://ltim.lt/ ; https://ltim.lt/galerija/laikrastis-lietuvos-totoriai/
- **Confidence / status:** high / verified.

### 11. `kaunas-tatar-saturday-school`
- **Name:** Kauno totorių vaikų ir jaunimo šeštadieninė mokykla
- **Description:** Saturday school for children and youth run by the Kaunas County Tatar Community.
- **Facts:** explicitly listed on the community’s official site; focuses on youth education; community objectives include restoring national culture, language, history, and literature; located in Kaunas County.
- **Primary URL:** https://totoriai.lt/
- **Category / people:** `lessons` / `tatar`
- **Geography / languages:** Lithuania (Kaunas); Lithuanian, heritage Tatar cultural content.
- **Evidence:** https://totoriai.lt/ ; https://totoriai.lt/ldk-totoriu-istorija/
- **Confidence / status:** high / verified; determine whether classes currently include language or primarily heritage before wording final card.

### 12. `kauno-totoriai-channel`
- **Name:** Kauno totoriai
- **Description:** Kaunas Tatar community editorial site publishing history, books, school activity, and community news.
- **Facts:** operates in Kaunas County localities with Tatar residents; published the book “Lietuvos totoriai” in 2020; organizes educational and cultural activity; maintains substantial historical content.
- **Primary URL:** https://totoriai.lt/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** Lithuania; Lithuanian.
- **Evidence:** https://totoriai.lt/ ; https://totoriai.lt/katb-istorija/
- **Confidence / status:** high / verified.

### 13. `vilnius-tatar-community-publications`
- **Name:** Vilniaus apskrities totorių bendruomenė - publications
- **Description:** Vilnius Tatar community’s research and publishing channel on Lipka Tatar manuscripts, language, history, and culture.
- **Facts:** organization registered in 2004; official profile documents multiple books and catalogues; publication subjects include the oldest Lithuanian Tatar manuscripts; work links Lithuanian, Polish, Turkish, and Tatar heritage.
- **Primary URL:** https://www.vatb.org/
- **Category / people:** `media` / `tatar`
- **Geography / languages:** Lithuania (Vilnius); Lithuanian, Polish, Turkish, Slavic manuscript traditions.
- **Evidence:** https://www.vatb.org/apie
- **Confidence / status:** high / verified.

### 14. `tatar-podcast-eu`
- **Name:** Tatar Podcast - A Centuries-Old Muslim Community
- **Description:** English-language documentary podcast about Polish Tatars’ cultural heritage, everyday life, and religious practice.
- **Facts:** hosted by Leiden professor Maurits Berger and University of Wrocław researcher Ewa Górska; recorded through travel in Poland; includes Kruszyniany; has a dedicated independent site.
- **Primary URL:** https://tatarpodcast.eu/
- **Category / people:** `media` / `tatar`
- **Geography / languages:** Poland / Netherlands; English.
- **Evidence:** https://tatarpodcast.eu/
- **Confidence / status:** high / **duplicate:** same project as existing `tatars-in-poland-podcast-media.md`; do not import.

### 15. `przeglad-tatarski-magazine`
- **Name:** Przegląd Tatarski
- **Description:** Polish periodical devoted to the history, culture, religion, and present-day life of Polish Tatars.
- **Facts:** published within the Polish Tatar institutional ecosystem; title recurs in official Polish minority-publication catalogues; covers Lipka Tatar heritage and current community matters; Polish-language editorial product.
- **Primary URL:** https://ztrp.pl/
- **Category / people:** `media` / `tatar`
- **Geography / languages:** Poland; Polish.
- **Evidence:** https://ztrp.pl/ ; https://www.gov.pl/web/mniejszosci-narodowe-i-etniczne/tatarzy
- **Confidence / status:** medium-high / review; locate stable issue archive and confirm current cadence.

### 16. `rocznik-tatarow-polskich`
- **Name:** Rocznik Tatarów Polskich
- **Description:** Polish Tatar yearbook publishing research and source material on the history and culture of Tatars in the Polish-Lithuanian sphere.
- **Facts:** long-form scholarly/editorial format; connected to the Union of Tatars of the Republic of Poland; centered on Lipka Tatar studies; Polish-language publication.
- **Primary URL:** https://ztrp.pl/
- **Category / people:** `media` / `tatar`
- **Geography / languages:** Poland; Polish.
- **Evidence:** https://ztrp.pl/ ; https://katalogi.bn.org.pl/
- **Confidence / status:** medium / review; verify latest issue and canonical archive before import.

### 17. `ztrp-editorial-channel`
- **Name:** Związek Tatarów Rzeczypospolitej Polskiej - editorial channel
- **Description:** Polish Tatar public information channel publishing community news, heritage material, events, and organizational history.
- **Facts:** aims to preserve ethnic consciousness and integrate people of Tatar descent; promotes Tatar traditions as part of Polish culture; maintains a standalone news-rich website; acts as publisher within the Polish Tatar media network.
- **Primary URL:** https://ztrp.pl/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** Poland; Polish.
- **Evidence:** https://ztrp.pl/stowarzyszenie/ ; https://ztrp.pl/
- **Confidence / status:** high / verified.

### 18. `ncktrp-museum-channel`
- **Name:** Muzeum Kultury Tatarów RP
- **Description:** Museum and educational channel of the National Centre for Tatar Culture in Gdańsk.
- **Facts:** the centre was founded in 2007; museum has operated since 2010; site documents Tatar heritage and public initiatives; the centre also runs educational activity including a Quranic school.
- **Primary URL:** https://ncktrp.pl/
- **Category / people:** `channel` / `tatar`
- **Geography / languages:** Poland (Gdańsk); Polish.
- **Evidence:** https://ncktrp.pl/o-nas/ ; https://ncktrp.pl/
- **Confidence / status:** high / verified.

### 19. `cemaat-media`
- **Name:** Cemaat Media
- **Description:** Independent public Crimean Tatar media project focused on contemporary Crimean Tatar life, identity, culture, and deoccupation.
- **Facts:** explicitly describes itself as the first independent public Crimean Tatar media outlet; publishes in multiple site languages; works with Crimean Tatar filmmakers; produces film and editorial projects in exile/diaspora settings.
- **Primary URL:** https://www.cemaat.media/en/
- **Category / people:** `media` / `crimean-tatar`
- **Geography / languages:** Ukraine / Europe / diaspora; Crimean Tatar, Ukrainian, English.
- **Evidence:** https://www.cemaat.media/en/about ; https://krymskidom.pl/
- **Confidence / status:** high / verified.

### 20. `q-hub-crimean-platform`
- **Name:** Q-hub
- **Description:** Crimean Tatar-founded educational and media platform developing cultural initiatives for displaced Crimeans and the global diaspora.
- **Facts:** founded by Crimean Tatar activists; combines educational, media, and cultural initiatives; serves internally displaced people and Crimean Tatars worldwide; operates as the Crimean Project Foundation.
- **Primary URL:** https://qirimhub.com/
- **Category / people:** `channel` / `crimean-tatar`
- **Geography / languages:** Ukraine / international; Ukrainian, Crimean Tatar, English-facing material.
- **Evidence:** https://qirimhub.com/
- **Confidence / status:** high / verified.

### 21. `crimean-tatar-foundation-usa-channel`
- **Name:** Crimean Tatar Foundation USA - knowledge channel
- **Description:** US-based English-language documentation and public-education platform connecting Crimean Tatar perspectives with universities and international institutions.
- **Facts:** registered US 501(c)(3); established in 2023; mission includes scholarship and documentation; publishes English material on identity, culture, language, rights, and policy.
- **Primary URL:** https://crimeantatarfoundation.org/
- **Category / people:** `channel` / `crimean-tatar`
- **Geography / languages:** USA / international; English.
- **Evidence:** https://crimeantatarfoundation.org/mission/ ; https://crimeantatarfoundation.org/join/
- **Confidence / status:** high / verified.

### 22. `american-crimean-turks-school-language-arts`
- **Name:** School of Language & Arts - American Association of Crimean Turks
- **Description:** New York diaspora school transmitting Crimean Tatar language, dance, and customs to younger generations.
- **Facts:** dedicated language-and-arts school; run by the American Association of Crimean Turks; based around the Brooklyn community hall; combines language with dance and cultural education.
- **Primary URL:** https://www.kirimny.org/home
- **Category / people:** `lessons` / `crimean-tatar`
- **Geography / languages:** USA (New York); Crimean Tatar, English, Turkish.
- **Evidence:** https://www.kirimny.org/home ; https://www.kirimny.org/
- **Confidence / status:** high / **duplicate:** existing `american-assoc-crimean-turks-lessons.md`; do not import.

### 23. `kirim-bulteni`
- **Name:** Kırım Bülteni
- **Description:** Quarterly free bulletin of Turkey’s Crimean Turks Culture and Mutual Aid Association.
- **Facts:** issued quarterly; distributed free; editorial organ of the national association; financially supported by Kırım Vakfı and includes news, essays, announcements, and book coverage.
- **Primary URL:** https://www.kirimdernegi.org.tr/Dosyalar/KIRIM-bulteni/Bulten_67.pdf
- **Category / people:** `media` / `crimean-tatar`
- **Geography / languages:** Turkey; Turkish, Crimean Tatar material.
- **Evidence:** https://www.kirimdernegi.org.tr/Dosyalar/KIRIM-bulteni/Bulten_67.pdf ; https://kirimdernegi.org.tr/Dosyalar/KIRIM-bulteni/Bulten_66.pdf
- **Confidence / status:** high / verified.

### 24. `kirim-dernegi-editorial-channel`
- **Name:** Kırım Derneği editorial channel
- **Description:** Turkey-wide Crimean Tatar cultural channel publishing news, history, events, branch activity, and archival bulletins.
- **Facts:** association founded in Ankara in 1955; has roughly 30 branches; site hosts long-running Kırım Bülteni files; mission includes collecting and publishing Crimean Tatar folklore and culture.
- **Primary URL:** https://www.kirimdernegi.org.tr/
- **Category / people:** `channel` / `crimean-tatar`
- **Geography / languages:** Turkey; Turkish.
- **Evidence:** https://kirimdernegi.org.tr/dernek/tarihce ; https://www.kirimdernegi.org.tr/dernek/tuzuk
- **Confidence / status:** high / verified.

### 25. `genc-tatar-mecmuasi`
- **Name:** Genç Tatar Mecmuası
- **Description:** Digital magazine by a Turkey-based Crimean Tatar youth team publishing history and culture research.
- **Facts:** explicitly identified as a digital magazine; produced by volunteers from different Turkish cities; focuses on historical memory, culture, current issues, and youth; connected to the Genç Tatar video ecosystem.
- **Primary URL:** https://genctatar.com/
- **Category / people:** `media` / `crimean-tatar`
- **Geography / languages:** Turkey; Turkish, Crimean Tatar.
- **Evidence:** https://genctatar.com/hakkimizda/
- **Confidence / status:** high / **duplicate/merge:** existing `genc-tatar-media.md` appears to represent the umbrella project; add magazine facts there rather than a new card.

### 26. `kirilay-animation-channel`
- **Name:** Kırılay
- **Description:** Independent animation project explaining Crimean Tatar and Crimean Khanate history for a Turkish-speaking online audience.
- **Facts:** conceived as an animated series; explicitly centers Crimean Tatar history; creator published an introductory pilot/explainer; name was constructed to evoke Crimea and Kipchak linguistic heritage.
- **Primary URL:** https://www.reddit.com/r/TurkicHistory/comments/1ur4od2/
- **Category / people:** `channel` / `crimean-tatar`
- **Geography / languages:** Turkey / online; Turkish.
- **Evidence:** https://www.reddit.com/r/TurkicHistory/comments/1ur4od2/ ; https://www.reddit.com/r/TarihiSeyler/comments/1urxq8a/
- **Confidence / status:** medium / review; promising but must locate official video channel and confirm more than a pilot before import.

### 27. `krymski-dom-poland-channel`
- **Name:** Krymski Dom
- **Description:** Poland-based Crimean Tatar cultural foundation channel presenting films, books, art, discussions, and diaspora collaborations.
- **Facts:** continues an initiative begun in Lviv in 2014; runs cultural programming in Poland; partners with Polish and Ukrainian institutions; has presented Cemaat Media films and Crimean Tatar artists.
- **Primary URL:** https://krymskidom.pl/
- **Category / people:** `channel` / `crimean-tatar`
- **Geography / languages:** Poland / Ukraine; Polish, Ukrainian, Crimean Tatar.
- **Evidence:** https://krymskidom.pl/
- **Confidence / status:** high / verified.

### 28. `romanyadan-tatarlar-tv`
- **Name:** Romanya'dan Tatarlar
- **Description:** Television programme about the Tatar community, language, and culture of Romania’s Dobruja region.
- **Facts:** produced for Romanian television; title means “Tatars from Romania”; focused on the Dobrujan Tatar community; documented alongside Tatar-language educational broadcasting.
- **Primary URL:** https://www.romania.ro/
- **Category / people:** `media` / `crimean-tatar`
- **Geography / languages:** Romania (Dobruja); Romanian, Dobrujan Tatar, Turkish.
- **Evidence:** https://en.wikipedia.org/wiki/Dobrujan_Tatar (secondary discovery lead)
- **Confidence / status:** medium / review; locate broadcaster archive/official programme page before import.

### 29. `tatarsa-uyrenemiz-romania`
- **Name:** Tatarşa üyrenemĭz
- **Description:** Romanian television learning rubric for the Dobrujan Tatar language.
- **Facts:** title means “We learn Tatar”; created for Romanian broadcast; connected to the Dobrujan Tatar community; represents rare diaspora-produced language instruction.
- **Primary URL:** https://www.romania.ro/
- **Category / people:** `lessons` / `crimean-tatar`
- **Geography / languages:** Romania; Dobrujan Tatar, Romanian.
- **Evidence:** https://en.wikipedia.org/wiki/Dobrujan_Tatar (secondary discovery lead)
- **Confidence / status:** medium-low / review; do not import without a surviving official archive.

### 30. `uctr-romania-channel`
- **Name:** Uniunea Culturală a Tătarilor din România
- **Description:** Romanian Tatar cultural union’s public channel publishing programmes and material on language, culture, religion, and community traditions.
- **Facts:** nongovernmental and non-political; active since 2012; mission explicitly includes preserving linguistic identity; maintains a standalone Romanian-language site.
- **Primary URL:** https://uctr.ro/
- **Category / people:** `channel` / `crimean-tatar`
- **Geography / languages:** Romania; Romanian, Tatar/Turkish community material.
- **Evidence:** https://uctr.ro/despre-noi/ ; https://uctr.ro/
- **Confidence / status:** high / verified.

### 31. `qirim-connect`
- **Name:** Qırım Connect
- **Description:** Multilingual digital directory and connection platform mapping Crimean Tatar communities across the global diaspora.
- **Facts:** explicitly addresses a diaspora spanning Turkey, Germany, Kazakhstan and beyond; supports Crimean Tatar, Russian, and English; designed to connect distributed communities; operates through the Qirim Atlas domain.
- **Primary URL:** https://qirimatlas.com/
- **Category / people:** `language` / `crimean-tatar`
- **Geography / languages:** global; Crimean Tatar, Russian, English.
- **Evidence:** https://qirimatlas.com/
- **Confidence / status:** high / **duplicate:** existing `qirim-atlas-media.md`; update/rename only if the current card is stale.

## Secondary candidates requiring a focused verification pass

These are relevant leads found through official link graphs, publication networks, or institutional descriptions. They should not be imported until the noted check is completed.

### 32. `peremech-lounge-channel`
- **Name:** The Peremech Lounge
- **Description:** English-language North American Tatar community conversation/media project linked by the American Turko-Tatar Association.
- **Facts:** surfaced in ATTA’s official “Other communities” graph; diaspora-facing; English-language naming; distinct from ATTA’s institutional site.
- **Primary URL:** linked from https://www.attasf.org/our-story.html
- **Category / people:** `channel` / `tatar`; USA; English.
- **Evidence:** https://www.attasf.org/our-story.html
- **Confidence / status:** medium / review; resolve outgoing URL and activity.

### 33. `tatars-washington-dc-channel`
- **Name:** Tatars in Washington D.C.
- **Description:** Public social channel for Tatar community culture and events in the Washington metropolitan area.
- **Facts:** linked as a sister community by ATTA; geographically distinct US node; community-facing; potential Sabantuy/event archive.
- **Primary URL:** linked from https://www.attasf.org/our-story.html
- **Category / people:** `channel` / `tatar`; USA; English/Russian/Tatar.
- **Evidence:** https://www.attasf.org/our-story.html
- **Confidence / status:** medium / review social URL and recent posts.

### 34. `tatars-florida-channel`
- **Name:** Tatars in Florida
- **Description:** Public social channel for the Florida Tatar diaspora.
- **Facts:** listed by ATTA among active other communities; geographically distinct; diaspora/event focus; likely multilingual.
- **Primary URL:** linked from https://www.attasf.org/our-story.html
- **Category / people:** `channel` / `tatar`; USA; English/Russian/Tatar.
- **Evidence:** https://www.attasf.org/our-story.html
- **Confidence / status:** medium / review social URL, ownership, cadence.

### 35. `tatars-toronto-channel`
- **Name:** Tatars in Toronto
- **Description:** Public social channel documenting Tatar community activity in Toronto.
- **Facts:** linked by ATTA as a sister community; Canadian diaspora node; distinct from the continent-wide North American Tatar Summit; potential source for local events and creators.
- **Primary URL:** linked from https://www.attasf.org/our-story.html
- **Category / people:** `channel` / `tatar`; Canada; English/Russian/Tatar.
- **Evidence:** https://www.attasf.org/our-story.html
- **Confidence / status:** medium / review.

### 36. `tatars-australia-channel`
- **Name:** Tatars in Australia
- **Description:** Public social channel for Australia’s Tatar diaspora and cultural events.
- **Facts:** linked by ATTA’s official community graph; one of the few Australia-specific leads; community/event focus; separate geography from North American and European projects.
- **Primary URL:** linked from https://www.attasf.org/our-story.html
- **Category / people:** `channel` / `tatar`; Australia; English/Russian/Tatar.
- **Evidence:** https://www.attasf.org/our-story.html
- **Confidence / status:** medium / review social URL and current activity.

### 37. `tatars-germany-channel`
- **Name:** Tatars in Germany
- **Description:** Germany-based diaspora channel for Tatar community communication and cultural events.
- **Facts:** linked by ATTA as a recognized community; Germany is also represented in the European Tatar Forum; likely event and language-preservation focus; distinct national audience.
- **Primary URL:** linked from https://www.attasf.org/our-story.html
- **Category / people:** `channel` / `tatar`; Germany; German, Tatar, Russian.
- **Evidence:** https://www.attasf.org/our-story.html ; https://www.tatarforum.eu/
- **Confidence / status:** medium / review exact organization and social URL.

### 38. `finlandiya-turkleri-birligi-publications`
- **Name:** Finlandiya Türkleri Birligi - publications
- **Description:** Historic Finnish Tatar cultural association’s publishing and cultural-programme surface.
- **Facts:** cultural association founded in 1935; active in sustaining Tatar language and culture; identified by Finnish government sources; part of Finland’s established Tatar publishing ecosystem.
- **Primary URL:** https://tatar.fi/
- **Category / people:** `media` / `tatar`; Finland; Tatar, Finnish.
- **Evidence:** https://rm.coe.int/168008b5b9 ; https://historia.hel.fi/fi/ilmiot/helsingin-asukkaat/helsingin-tataarit
- **Confidence / status:** medium / review: determine current independent publications and canonical page.

### 39. `turk-islam-foreningen-sweden-archive`
- **Name:** Turk-Islam Föreningen i Sverige - Tatar heritage archive
- **Description:** Potential archival/media treatment of Sweden’s first Tatar-founded Muslim and cultural association.
- **Facts:** founded in 1948 by Finnish and Estonian Tatars; served both religious and Tatar cultural functions; helped preserve language and customs; historically Sweden’s first Muslim congregation.
- **Primary URL:** https://www.sverigesradio.se/artikel/6455430
- **Category / people:** `media` / `tatar`; Sweden; Swedish, Finnish, Tatar.
- **Evidence:** https://www.sverigesradio.se/artikel/6455430 ; https://www.mucf.se/sites/default/files/2025/11/islamboken_uppd_2021_0.pdf
- **Confidence / status:** medium-low / rejected as a current project unless a live archive/editorial surface is found.

### 40. `karadeniz-romania-newspaper`
- **Name:** Karadeniz
- **Description:** Reported Romanian Tatar community periodical covering Dobrujan Tatar culture and organizational life.
- **Facts:** associated with Romania’s Tatar institutional ecosystem; Turkish/Tatar title means “Black Sea”; diaspora/community focus; likely Romanian and Turkish/Tatar content.
- **Primary URL:** https://www.udttmr.ro/
- **Category / people:** `media` / `crimean-tatar`; Romania; Romanian, Turkish/Dobrujan Tatar.
- **Evidence:** https://www.udttmr.ro/ ; https://en.wikipedia.org/wiki/Democratic_Union_of_Turkic-Muslim_Tatars_of_Romania
- **Confidence / status:** medium / review publication archive and current cadence.

### 41. `renkler-romania-magazine`
- **Name:** Renkler
- **Description:** Reported cultural magazine from Romania’s Turkish-Tatar/Dobrujan publishing network.
- **Facts:** title means “Colours”; linked to minority cultural publishing in Dobruja; relevant to Crimean/Dobrujan Tatar heritage; multilingual regional context.
- **Primary URL:** https://www.udttmr.ro/
- **Category / people:** `media` / `crimean-tatar`; Romania; Romanian, Turkish/Tatar.
- **Evidence:** https://www.udttmr.ro/
- **Confidence / status:** low-medium / review; confirm publisher, issue archive, and whether Tatar rather than broader Turkish scope.

### 42. `tatar-tv-romania`
- **Name:** Tatar TV Romania
- **Description:** Candidate online video channel for Romanian Tatar community news and culture.
- **Facts:** discovered through Romanian Tatar media terminology; expected Dobruja focus; potentially community-run; potentially Romanian/Tatar bilingual.
- **Primary URL:** https://www.youtube.com/results?search_query=Tatar+TV+Romania
- **Category / people:** `channel` / `crimean-tatar`; Romania; Romanian, Tatar/Turkish.
- **Evidence:** https://uctr.ro/ ; https://www.udttmr.ro/
- **Confidence / status:** low / review; channel ownership and activity not established, do not import yet.

### 43. `crimean-tatar-cultural-association-canada-channel`
- **Name:** Qirim Tatar Cultural Association of Canada
- **Description:** Candidate Canadian Crimean Tatar cultural web archive/community channel.
- **Facts:** historically operated at `tatarworld.com`; represented Canadian Crimean Tatar community life; cited in reference literature; distinct from Volga-Tatar Toronto and North American Summit projects.
- **Primary URL:** http://www.tatarworld.com/
- **Category / people:** `channel` / `crimean-tatar`; Canada; English, Turkish/Crimean Tatar.
- **Evidence:** https://en.wikipedia.org/wiki/Crimean_Tatars (secondary lead)
- **Confidence / status:** low / rejected for now: canonical site needs live-status and ownership verification.

## Rejected / merge list

| Lead | Decision | Reason |
|---|---|---|
| North American Tatar Summit | existing | `north-american-tatar-summit-language.md` |
| ATA New York newsletter | existing | `american-tatar-association-newsletter-media.md` |
| American Association of Crimean Turks school | existing | `american-assoc-crimean-turks-lessons.md` |
| Tatar Podcast / Tatars in Poland: Adopted Homeland | duplicate | same podcast as `tatars-in-poland-podcast-media.md` |
| Qırım Connect / Qirim Atlas | duplicate/rebrand | existing `qirim-atlas-media.md` |
| Genç Tatar Mecmuası | merge | umbrella project already in `genc-tatar-media.md` |
| ATR, QHA, Emel | existing | already represented in dataset |
| Generic national/city associations without an editorial or teaching surface | excluded | cannot honestly fit current categories |
| Turk-Islam Föreningen i Sverige | historical only | no current independent media/education surface verified |
| Tatarworld Canada | dormant/unverified | live canonical surface not established |
| “Tartaria The Netherlands” | excluded | pseudohistorical “Tartaria” channel, unrelated to the people/catalog mission |
| Historical periodicals such as Terciman and Alem-i Nisvan | excluded | not current projects; outside present-day discovery scope |

## Language and source metrics

### Languages actually queried or used to interpret sources

`en`, `fi`, `de`, `pl`, `lt`, `sv`, `fr`, `nl`, `tr`, `ro`, plus Tatar/Crimean-Tatar transliterations and Russian terms in cross-checking. Queries for `no`, `da`, `es`, `it`, `cs`, `lv`, and `et` were considered in the country pass but did not yield a sufficiently verified, category-compatible candidate in this track. They should not be counted as successful discovery languages.

### Candidate geography

- USA/Canada: 9 leads (including 2 existing/duplicate and 4 social-channel verification leads).
- UK/Western Europe: 6 leads.
- Finland/Sweden: 5 leads.
- Poland/Lithuania: 11 leads (one duplicate).
- Turkey: 4 strong leads plus one pilot animation.
- Romania: 5 leads, two strong and three needing archive verification.
- Australia: 1 social-channel lead.

### Source classes actually used

- First-party project and organization sites.
- Government and national-minority department publications (Finland, Lithuania, Poland).
- Public broadcaster reporting (Sveriges Radio).
- Charity/registry discovery for the UK.
- Museum and university-linked sites.
- Official event programmes and partner graphs.
- Social/community link graph from the American Turko-Tatar Association.
- Secondary encyclopedic sources only as leads; candidates relying solely on them are marked review/rejected.

## Gaps for the next pass

1. Resolve the outgoing social links on ATTA’s “Other communities” page using an interactive logged-in browser, then inspect posting cadence and ownership for Washington D.C., Florida, Toronto, Australia, and Germany.
2. Locate stable official archives for `Przegląd Tatarski`, `Rocznik Tatarów Polskich`, `Karadeniz`, `Renkler`, `Romanya'dan Tatarlar`, and `Tatarşa üyrenemĭz`.
3. Search Czech, Latvian, Estonian, French, Dutch, Spanish, Italian, Norwegian, and Danish NGO/social registries directly; ordinary web indexing produced noise or historical references rather than category-compatible active projects.
4. Separate Lipka-Tatar heritage media from generic Muslim institutions: many Baltic/Polish organizations are culturally relevant but do not produce a distinct catalog-compatible project.
5. Finland’s strongest gap is not discovery but canonicalization: the community clearly produces courses and publications, but individual stable landing pages need to be identified before import.

## Import recommendation

Start with candidates **1-7, 9-13, 17-25, 27, 30** after a final URL/status check. This yields about 22 category-compatible new cards without relying on weak social leads. Treat items 14, 22, 25, and 31 as duplicate/merge work, and do not import items 28-29 or 32-43 until their explicit review notes are resolved.
