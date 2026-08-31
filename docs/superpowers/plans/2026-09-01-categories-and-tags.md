# Categories and Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the overloaded seven-value tag field with category pages plus a typed, grouped tag vocabulary and AND-based multi-tag filtering.

**Architecture:** A single taxonomy module owns category and tag slugs, groups, labels, and icons. Astro content validation consumes its readonly tuples, catalog pages use categories for static routing, and a dependency-free client filter applies selected tags to already rendered cards while keeping state in the URL.

**Tech Stack:** Astro 7, TypeScript 6 strictest, Astro Content Layer and Zod, Tailwind CSS v4, Bun test.

**Spec:** `docs/superpowers/specs/2026-09-01-categories-and-tags-design.md`

## Global Constraints

- Preserve `/catalog/<category>` and `/en/catalog/<category>` URL slugs.
- Use one centralized typed registry for all category and tag values.
- Require at least one category and one tag on every Russian card.
- Keep `peoples` separate from tags.
- Combine selected tags with AND logic and store them in `?tags=slug,slug`.
- Add no dependency and no vanilla CSS.
- Preserve unrelated tracked and untracked worktree changes.
- Do not commit implementation files that already contain unrelated user changes.

---

### Task 1: Typed taxonomy and filter behavior

**Files:**
- Create: `src/components/Catalog/taxonomy.ts`
- Create: `src/components/Catalog/tagFilter.ts`
- Create: `src/components/Catalog/tagFilter.test.ts`
- Modify: `src/content.config.ts`
- Modify: `src/components/Catalog/labels.ts`
- Replace: `src/components/Catalog/tagIcons.ts` with `src/components/Catalog/categoryIcons.ts`
- Replace: `src/components/Catalog/tags.ts` with `src/components/Catalog/categories.ts`

**Interfaces:**
- Produces: `CATEGORY_VALUES`, `TAG_VALUES`, `TAG_GROUP_VALUES`, `Category`, `Tag`, `TagGroup`, `CATEGORY_DEFINITIONS`, `TAG_DEFINITIONS`.
- Produces: `parseTagQuery(raw: string | null, available: readonly Tag[]): Tag[]`.
- Produces: `cardsWithAllTags<T extends { data: { tags: readonly Tag[] } }>(cards: readonly T[], selected: readonly Tag[]): T[]`.
- Produces: `getAllCategories(cards)`, `cardsByCategory(cards, category)`, `getAvailableTags(cards)`.

- [ ] **Step 1: Write failing unit tests for query parsing and AND filtering**

```ts
import { describe, expect, test } from "bun:test";
import { cardsWithAllTags, parseTagQuery } from "./tagFilter";

describe("tag filtering", () => {
  test("keeps valid unique tags in query order", () => {
    expect(parseTagQuery("poet,music,unknown,poet", ["poet", "music"])).toEqual(["poet", "music"]);
  });

  test("requires every selected tag", () => {
    const cards = [
      { id: "both", data: { tags: ["poet", "music"] } },
      { id: "one", data: { tags: ["poet"] } },
    ] as const;
    expect(cardsWithAllTags(cards, ["poet", "music"]).map((card) => card.id)).toEqual(["both"]);
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `bun test src/components/Catalog/tagFilter.test.ts`

Expected: FAIL because `tagFilter.ts` does not exist.

- [ ] **Step 3: Add the registry and minimal pure filter helpers**

Use readonly slug tuples and exhaustive `satisfies Record<...>` metadata. Implement query parsing with a `Set` of available tags and AND filtering with `selected.every((tag) => card.data.tags.includes(tag))`.

- [ ] **Step 4: Run unit tests**

Run: `bun test src/components/Catalog/tagFilter.test.ts`

Expected: PASS.

- [ ] **Step 5: Wire the content schema and category helpers**

Change the card schema to:

```ts
categories: z.array(z.enum(CATEGORY_VALUES)).min(1),
tags: z.array(z.enum(TAG_VALUES)).min(1),
```

Use taxonomy definitions for localized labels and category icons. Category helper functions operate only on `card.data.categories`; tag helpers operate only on `card.data.tags`.

### Task 2: Migrate and classify all card content

**Files:**
- Create: `scripts/migrate-card-taxonomy.mjs`
- Modify: every `src/data/cards/*.md` file, only its taxonomy frontmatter lines
- Modify: `src/data/markdown/add.md`
- Modify: `src/data/markdown-en/add.md`

**Interfaces:**
- Consumes: category and tag slugs from `taxonomy.ts`.
- Produces: every Russian card with non-empty `categories` and `tags` arrays.

- [ ] **Step 1: Make schema validation fail against legacy cards**

Run: `bun run check`

Expected: FAIL because legacy cards have no `categories` field and use category slugs in `tags`.

- [ ] **Step 2: Write a narrow migration script**

The script must:

```js
const legacyCategories = new Set([
  "author", "channel", "media", "language", "lessons", "graphics", "community",
]);
```

For each Russian card, rename the existing `tags` array to `categories`, derive controlled tags from explicit frontmatter text and filename rules, and fail instead of writing if no controlled tag can be assigned. It must not touch card prose or English card files.

- [ ] **Step 3: Run the migration and inspect its summary**

Run: `node scripts/migrate-card-taxonomy.mjs`

Expected: one line per card showing its category and assigned tags, followed by totals and zero unclassified cards.

- [ ] **Step 4: Audit low-information and role-sensitive assignments**

Inspect all cards tagged with roles, `free`, `open-source`, `nonprofit`, audience tags, and cards receiving only a generic format tag. Remove unsupported inferences and add topic or format tags only where card text supports them.

- [ ] **Step 5: Validate the migrated collection**

Run: `bun run check`

Expected: PASS with no schema errors.

### Task 3: Category routing and terminology

**Files:**
- Rename: `src/pages/catalog/[tag].astro` to `src/pages/catalog/[category].astro`
- Rename: `src/pages/en/catalog/[tag].astro` to `src/pages/en/catalog/[category].astro`
- Modify: `src/pages/catalog/index.astro`
- Modify: `src/pages/en/catalog/index.astro`
- Modify: `src/components/Catalog/Catalog.astro`
- Modify: `src/components/Catalog/CatalogToolbar.astro`
- Modify: `src/i18n/locales/ru.ts`
- Modify: `src/i18n/locales/en.ts`
- Modify: `src/components/CatalogStats/CatalogStats.astro`
- Modify: `src/components/partials/StickyList.astro`
- Modify: `src/components/partials/StatField.astro`
- Modify: `src/components/partials/StepRail.astro`

**Interfaces:**
- Consumes: `getAllCategories`, `cardsByCategory`, `categoryLabel`, `categoryIcon`.
- Produces: static category routes and category-based toolbar props named `categories` and `activeCategory`.

- [ ] **Step 1: Rename route files and internal parameters without changing slugs**

`getStaticPaths` returns `{ params: { category }, props: { category, cards, categories } }`. Both locales filter with `cardsByCategory` and build headings with `categoryLabel`.

- [ ] **Step 2: Rename catalog component and toolbar props**

Replace tag terminology used for the seven navigation links with category terminology, including `data-category-*` hooks, comments, localized copy, and the mobile dialog ID.

- [ ] **Step 3: Update counts and marketing copy**

Category statistics count `card.data.categories`. User-facing copy says categories rather than seven tags. Tag counts, when shown, count `card.data.tags` separately.

- [ ] **Step 4: Run type checking**

Run: `bun run check`

Expected: PASS with no references to the removed category-as-tag API.

### Task 4: Grouped multi-tag filter UI

**Files:**
- Create: `src/components/Catalog/CatalogTagFilter.astro`
- Modify: `src/components/Catalog/Catalog.astro`
- Modify: `src/components/Catalog/CatalogGrid.astro`
- Modify: `src/components/Catalog/CatalogList.astro`
- Modify: `src/components/Catalog/CatalogCard.astro`
- Modify: `src/components/Catalog/CatalogRow.astro`

**Interfaces:**
- Consumes: `getAvailableTags`, `TAG_GROUP_VALUES`, `TAG_DEFINITIONS`, `parseTagQuery` semantics.
- Produces: `catalog:before-filter` and `catalog:filter` events with `{ tags: string[] }` detail.
- Produces: `[data-catalog-item][data-tags]` on grid and list representations.

- [ ] **Step 1: Render accessible grouped checkboxes**

Render only tag groups and values present in the page cards. Use native checkboxes, group headings, selected count, and a clear button. Use semantic Tailwind tokens and existing button/dialog patterns.

- [ ] **Step 2: Implement URL-backed selection**

On setup, parse `URLSearchParams.get("tags")`, ignore unknown values, check valid inputs, update the URL with `history.replaceState`, and dispatch a filter event after every change. Serialize tags in rendered option order for stable links.

- [ ] **Step 3: Make lazy grid filtering complete**

Before filtering, `CatalogGrid` reveals all template chunks and removes its sentinel. Apply the selected-tag AND predicate to every grid and list item using the comma-separated `data-tags` value. Hidden items use the native `hidden` attribute.

- [ ] **Step 4: Add result count and empty state**

Count unique cards from the list representation, update the page result count, and show localized empty copy when no card matches. Clearing filters restores every card.

- [ ] **Step 5: Run unit and type checks**

Run: `bun test src/components/Catalog/tagFilter.test.ts && bun run check`

Expected: PASS.

### Task 5: Card presentation, search, and related projects

**Files:**
- Modify: `src/components/Catalog/CardDetail.astro`
- Modify: `src/components/Catalog/CatalogCard.astro`
- Modify: `src/components/Catalog/CatalogRow.astro`
- Modify: `src/components/Catalog/CatalogGlossary.astro`
- Modify: `src/components/Catalog/related.ts`
- Create: `src/components/Catalog/related.test.ts`

**Interfaces:**
- Consumes: category and tag localized labels.
- Produces: card UI that presents categories separately from tags and search text containing both.
- Produces: related score weighted by shared categories, then tags, then peoples.

- [ ] **Step 1: Write a failing related-score behavior test**

Create fixtures where a shared category outranks only a shared people, and shared tags break ties between cards in the same category. Run `bun test src/components/Catalog/related.test.ts` and verify failure against legacy scoring.

- [ ] **Step 2: Update related scoring**

Use `sharedCategories * 3 + sharedTags * 2 + sharedPeoples`, keeping the public `getRelatedCards` interface unchanged.

- [ ] **Step 3: Separate category and tag presentation**

Show category labels and descriptive tag labels as distinct groups in card, row, and detail components. Add both sets to glossary search indexing.

- [ ] **Step 4: Run focused tests and type checking**

Run: `bun test src/components/Catalog/tagFilter.test.ts src/components/Catalog/related.test.ts && bun run check`

Expected: PASS.

### Task 6: Full verification and worktree audit

**Files:**
- Verify only, except for fixes directly caused by this feature

**Interfaces:**
- Consumes: all previous tasks.
- Produces: validated static RU and EN catalog output.

- [ ] **Step 1: Scan taxonomy invariants**

Run searches that confirm every Russian card has `categories` and `tags`, no legacy category slug remains in `tags`, and English card frontmatter contains neither field.

- [ ] **Step 2: Run full project verification**

Run: `bun run verify`

Expected: PASS for lint, Astro type checking, build, SEO validation, and card translation validation.

- [ ] **Step 3: Inspect generated routes and markup**

Confirm representative RU and EN category pages exist in `dist`, category links use unchanged URLs, grouped tag controls render, and card elements contain typed tag data.

- [ ] **Step 4: Audit the final diff**

Use `git diff --check`, `git diff --stat`, and targeted diffs. Confirm unrelated dirty files and pre-existing content changes were not overwritten or staged.
