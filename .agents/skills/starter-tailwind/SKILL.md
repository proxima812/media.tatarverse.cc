---
name: starter-tailwind
description: Правила стилей — Tailwind CSS v4, семантические токены, никакого vanilla CSS и tailwind.config.js. Использовать при любой правке разметки, классов, src/styles/tailwind.css или при добавлении цветов и шрифтов.
---

# Tailwind v4

Единственный источник стилей — `src/styles/tailwind.css`, подключается в `Layout.astro`.
Конфигурация — **в CSS**, через `@theme`. Файла `tailwind.config.js` нет и быть не должно:
это Tailwind v3, здесь он не работает.

Подключение — через `@tailwindcss/vite` в `astro.config.mjs`.
Пакет `@astrojs/tailwind` устарел (он для v3) и удалён — не возвращать.

## Семантические токены

Цвета ходят **парами** «поверхность + текст на ней», и в разметке используется пара целиком:

```
bg-background  →  text-foreground            страница
bg-primary     →  text-primary-foreground    акценты, кнопки
bg-secondary   →  text-secondary-foreground  вторичные действия
bg-muted       →  text-muted-foreground      карточки, вторичный UI
border-border                                границы
```

Правила:

- Перекрасить проект = поменять значения в `@theme`. Больше нигде.
- **Не** хардкодить цвет: `bg-[#111]`, `text-zinc-900` — мимо системы.
- **Не** ставить `text-primary` на body только потому, что «получилось тёмное».
  `primary` — акцент, `foreground` — основной текст. Это разные роли.
- Нужен новый цвет — добавить пару в `@theme`, а не точечный класс.

Цвета в `oklch()` — предсказуемая светлота, легко строить шкалы.

## Что писать в CSS, а что классами

Vanilla CSS — только для того, что Tailwind не выражает. Сейчас это ровно два
свойства (`tab-size`, `-webkit-tap-highlight-color`) в `@layer base`.

- Reset не писать: Preflight v4 уже делает `box-sizing`, сброс отступов, границ,
  `text-size-adjust` и базовый шрифт. Дублирование было — его убрали.
- Повторяющийся паттерн → `@utility`, как `no-container`.
- Не плодить классы-обёртки вида `.btn` — использовать компонент `.astro`.

## Разметка

- Mobile-first: базовые классы без префикса, дальше `md:`, `lg:`.
- Условные классы — через `cn()` из `@/utils/lib/cn` (clsx + tailwind-merge).
  `tailwind-merge` v3 — версия под v4, v2 была под v3.
- Не строить имена классов конкатенацией (`text-${color}-500`) — Tailwind не
  увидит их при сканировании.
- Произвольные значения (`w-[37px]`) — только когда шкалы правда не хватает.

## Плагины

`@tailwindcss/typography` (класс `prose` для markdown-контента) и
`@toolwind/corner-shape` подключены через `@plugin` в CSS.
