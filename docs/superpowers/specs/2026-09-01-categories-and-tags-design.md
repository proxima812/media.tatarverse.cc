# Categories and tags

## Goal

Separate the current seven project categories from descriptive tags. Category pages remain the main catalog navigation. Each category page gets a multi-select tag filter that combines selected tags with AND logic.

## Data model

Russian card frontmatter remains the source of truth. Each card has:

```yaml
categories: ["author"]
tags: ["poet", "songwriter", "music"]
```

`categories` is a non-empty array using the existing stable slugs:

- `author`
- `channel`
- `media`
- `language`
- `lessons`
- `graphics`
- `community`

`tags` is a non-empty array from one centralized typed registry. The registry stores stable English slugs, a group, and Russian and English labels. Both fields are validated by the Astro content schema. English card files do not duplicate categories or tags.

## Tag registry

The controlled vocabulary is grouped for navigation. It is comprehensive for the current catalog but remains intentionally extensible through one typed registry.

### Roles

`blogger`, `journalist`, `editor`, `writer`, `poet`, `playwright`, `translator`, `teacher`, `linguist`, `researcher`, `historian`, `local-historian`, `musician`, `performer`, `songwriter`, `composer`, `producer`, `director`, `actor`, `presenter`, `podcaster`, `artist`, `illustrator`, `designer`, `photographer`, `craftsperson`, `developer`, `activist`.

### Topics

`language`, `literature`, `poetry`, `music`, `history`, `culture`, `traditions`, `folklore`, `heritage`, `identity`, `religion`, `education`, `science`, `news`, `politics`, `society`, `travel`, `cuisine`, `fashion`, `art`, `design`, `architecture`, `theatre`, `cinema`, `humor`, `children`, `youth`, `technology`, `artificial-intelligence`.

### Formats

`website`, `app`, `mobile-app`, `bot`, `blog`, `video`, `podcast`, `radio`, `television`, `newspaper`, `magazine`, `newsletter`, `book`, `audiobook`, `library`, `archive`, `database`, `encyclopedia`, `map`, `course`, `school`, `event`, `festival`, `museum`, `performance`, `shop`.

### Language technologies

`dictionary`, `text-corpus`, `translator-tool`, `transliteration`, `keyboard`, `font`, `ocr`, `speech-recognition`, `text-to-speech`, `language-model`, `dataset`.

### Audiences

`for-children`, `for-youth`, `for-adults`, `for-beginners`, `for-advanced-learners`, `for-teachers`, `for-researchers`, `for-diaspora`.

### Features

`open-source`, `free`, `bilingual`, `multilingual`, `interactive`, `educational`, `nonprofit`.

Peoples remain in the separate `peoples` field and are not duplicated as tags.

## Catalog navigation

The existing URLs stay stable: `/catalog/<category>` and `/en/catalog/<category>`. Internal route parameters, helpers, labels, icons, comments, and component props are renamed from tag terminology to category terminology.

The catalog index and every category page display the same category navigation. Categories with no cards are not generated.

## Tag filtering

Every catalog page exposes a grouped multi-select tag control. Available options are limited to tags present in the cards on that page. Selecting multiple tags keeps a card only when it contains every selected tag.

The selection is encoded in a comma-separated query parameter:

```text
/catalog/author?tags=poet,music
```

The client reads the initial query, validates values against options rendered on the page, updates the URL with `history.replaceState`, and filters the already rendered static cards. No framework or dependency is added. Clearing the selection removes the query parameter. An empty result uses the existing localized empty-state pattern.

Search text includes category and tag labels. Card, row, detail, glossary, and related-project logic use the separated fields. Related-project scoring gives categories more weight than tags, with peoples as an additional signal.

## Migration and tagging rules

Every existing Russian card moves its current `tags` values to `categories`. Each card is then assigned at least one controlled tag based only on its name, description, facts, URL type, and clearly stated function.

Tagging favors precision over volume:

- Do not infer a profession, audience, license, price, or organizational status without evidence.
- Use topic tags for what the project substantially covers, not for incidental words.
- Use format tags only when the format is explicit.
- Use language-technology tags for the actual tool or resource type.
- Apply the same rules to tracked and currently untracked cards in the collection.

## Interface and accessibility

The existing visual language and Tailwind tokens are preserved. The filter uses native checkboxes grouped with headings, exposes the selected count, supports keyboard use, and provides a clear-all action. Category links remain normal links. Tag filtering is progressive enhancement: without JavaScript, all cards in the category remain visible.

## Validation

Run `bun run verify` after migration. In addition, verify that:

- every card has at least one valid category and tag;
- no legacy category value remains in `tags`;
- generated category routes and English alternates still exist;
- direct URLs with one tag, several tags, unknown tags, and no tags behave safely;
- category counts and tag labels are correct in both locales;
- existing unrelated worktree changes remain untouched.
