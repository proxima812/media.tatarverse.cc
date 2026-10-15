---
name: media.tatarverse
description: Журнал проектов - минималистичная система на линиях, где цвет работает как сигнал категории
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.205 0 0)"
  subtle: "oklch(0.985 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.48 0 0)"
  faint: "oklch(0.64 0 0)"
  border: "oklch(0.935 0 0)"
  border-strong: "oklch(0.895 0 0)"
  sign: "oklch(0.205 0 0)"
  tone-blue: "oklch(0.58 0.2 258)"
  tone-purple: "oklch(0.55 0.19 305)"
  tone-pink: "oklch(0.63 0.2 2)"
  tone-teal: "oklch(0.6 0.11 184)"
  tone-amber: "oklch(0.68 0.15 70)"
  tone-green: "oklch(0.61 0.15 152)"
  tone-orange: "oklch(0.65 0.19 45)"
  tone-indigo: "oklch(0.54 0.19 277)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  2xs: "0.375rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  pill: "9999px"
components:
  button-solid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  category-tile:
    backgroundColor: "tone 12%"
    textColor: "tone"
    rounded: "{rounded.xs}"
  chip-category:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.pill}"
  input-search:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    height: "2.5rem / 3.5rem"
  header-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    height: "64px"
---

# Design System: media.tatarverse

## Overview

**Creative North Star: "Журнал"**

Каталог читается как журнал о проектах трех народов: огромный заголовок,
под ним поиск и ряды проектов по категориям, как развороты. Образцы -
Vercel, Dub и Mobbin: белая страница, почти черный текст, тонкие линии,
много воздуха и крупная плотная типографика. Интерфейс почти ахроматический,
а цвет в нем есть ровно в одном месте: тон категории красит ее иконку в
тонированном квадрате и точку бейджа. Так категория узнается раньше, чем
прочитана подпись.

Глубина набирается линиями, а не тенями: разделитель `border`, контур поля
`border-strong`, одна ступень подложки `subtle`. Тень одна - `shadow-lift`,
и она только отрывает логотип от обложки.

Знаки народов (`tat`, `bash`, `qrim`) - белые SVG на темном круге `sign`.
Три народа получают одинаковую форму, размер и место; различие несет только
сам знак. На главной знаки стоят прямо в строке заголовка, в тонированных
квадратах.

**Key Characteristics:**
- Inter для текста, Geist Mono для чисел, доменов, ярлыков и клавиш
- Нейтральная шкала по образцу Geist плюс восемь тонов категорий
- Линии вместо корпусов: строки, ряды и секции разделены `border`
- Пилюля для действий и чипов, квадрат со сквирклом для обложек и логотипов
- Светлая тема по умолчанию, темная собрана на тех же токенах

## Colors

### Neutral
- **Страница** (`--color-background`) и **текст** (`--color-foreground`).
- **Подложка** (`--color-subtle`): подвал, hover строки списка.
- **Основной** (`--color-primary` + `--color-primary-foreground`): сплошная
  кнопка, нажатый чип, активная буква указателя. Совпадает с `foreground`.
- **Тихий** (`--color-muted` + `--color-muted-foreground`): hover-подложка,
  описание, неактивная навигация.
- **Третья ступень текста** (`--color-faint`): счетчики, домены, ярлыки.
  На нем не держится чтение, только вспомогательное.
- **Линии** (`--color-border`, `--color-border-strong`): обычная делит
  строки и секции, плотная очерчивает поле, чип и логотип.
- **Знак** (`--color-sign`): темный круг под белым знаком народа, темный в
  обеих темах, потому что перекрасить SVG-знак нечем.

### Тоны категорий
Восемь хроматических токенов `--color-tone-*`, каждый закреплен за
категорией в `src/lib/taxonomy.ts` (`tone`):

| Категория | Тон | Иконка |
|---|---|---|
| Канал | pink | `tabler:device-tv` |
| Автор | teal | `tabler:pencil` |
| Медиа | blue | `tabler:news` |
| Языковой проект | purple | `tabler:language` |
| Уроки | amber | `tabler:school` |
| Графика | orange | `tabler:palette` |
| Сообщество | green | `tabler:users` |
| Музыка | indigo | `tabler:music` |

Классы тонов собраны целиком в `src/lib/ui/tone.ts` (`TONE_CLASSES`):
Tailwind находит классы сканированием, склеенное имя он бы не увидел.

### Named Rules
**Правило сигнала.** Цвет только у категории: квадрат иконки (подложка
12%, штрих в тон, контур 24%) и точка бейджа. Кнопки, текст и ссылки
цветными не бывают. Единственные исключения: синий ореол фокуса у поля
поиска и зеленая галочка «скопировано» у трека.

**Правило пары.** Цвета ходят парами «поверхность + текст на ней».
Хардкод (`bg-[#111]`, `text-zinc-900`) запрещен: перекраска - это правка
значений в `src/styles/tailwind.css`.

## Typography

**Text Font:** Inter (переменное начертание, `cyrillic`, `cyrillic-ext`, `latin`)
**Mono Font:** Geist Mono (400-600, только `latin`: в моно идут цифры, домены
и латинские ярлыки)

### Hierarchy
- **Display** (600, `clamp(2.5rem,5.5vw,4.5rem)`, `leading-[0.98]`,
  `tracking-[-0.05em]`): H1 каждой страницы. На главной крупнее, со знаками
  народов в строке.
- **Headline** (600, `text-2xl` → `sm:text-3xl`, `tracking-[-0.035em]`):
  заголовки секций и рядов.
- **Title** (500, `text-base`, `tracking-[-0.01em]`): название проекта в
  карточке и строке.
- **Body** (400, `text-sm`, `text-muted-foreground`): описания, лиды
  (`text-lg`).
- **Label** (Geist Mono, `text-xs`, иногда `uppercase tracking-wider`,
  `text-faint`): счетчики, домены, ярлык над заголовком, клавиши.

Счетчик страницы стоит справа от H1 моноширинным: число цветом
`foreground`, слово `muted-foreground`.

## Elevation

Плоско. Секции и строки разделены `border-t`/`border-b`, липкие панели -
`bg-background/90` с `backdrop-blur-md` и линиями сверху и снизу.
`shadow-lift` - единственная тень, под логотипом на обложке.

## Shape

Закрытая шкала радиусов (`--radius-*: initial`):

- `rounded-full`: кнопки, чипы, поле поиска, точки, буквы указателя
- `rounded-2xs` (6px): клавиши, мелкие квадраты категорий
- `rounded-xs` (8px) и `rounded-sm` (12px): квадраты категорий, строки списков
- `rounded-md` (16px): обложки, логотипы, кадры артистов
- `rounded-lg` (24px) и `rounded-xl` (32px): крупные обложки страницы проекта

`corner-squircle` идет в пару к шагу от `md`. Мелкие скругления и пилюли
остаются обычными.

## Motion

Кривые Эмиля Ковальски из темы: `ease-snappy` для отклика, `ease-glide`
для перемещения, `ease-drawer` для панелей.

- Длительности 150-300 мс, анимируются только `transform` и `opacity`.
- Нажатие: `active:scale-[0.97]` у кнопок, `0.96` у чипов.
- Наведение: стрелка сдвигается на 2px, кадр артиста растет до 1.03.
- Вход первого экрана главной: `animate-rise` у заголовка и `animate-pop`
  у знаков, один раз за визит.
- Клавиатурные действия (`/`, `⌘K`) не анимируются.
- `motion-reduce:` снимает масштаб нажатия и наведения.

## Components

### Buttons
- **Solid:** `primary`, пилюля. **Outline:** контур `border-strong`.
  **Ghost:** без фона, тихий текст, hover - `muted`.
- Фокус: `ring-2` цветом `foreground` с отступом по фону.

### Chips
- **Категория:** контурная пилюля с точкой тона.
- **Народ (фильтр):** контурная пилюля со знаком и моноширинным счетчиком;
  нажатая - `primary`.
- **Тег:** контурная пилюля, в фильтре со счетчиком.

### CategoryTile
Иконка категории в тонированном квадрате, размеры `sm`, `md`, `lg`.
Стоит у заголовка ряда, в переключателе категорий и в шапке страницы
категории.

### SearchField
Пилюля с лупой и клавишей-подсказкой (`/` на главной и в каталоге, `⌘K` на
странице поиска). Фокус: контур темнеет, вокруг синий ореол 18%.

### ProjectCover (сигнатурный компонент)
Обложка 16:10 с мэш-градиентом и логотипом по центру, под ней бейдж
категории, название (ссылка растянута на всю карточку), описание в две
строки, моноширинный домен и знаки народов. Тот же компонент - в рядах
главной, сетке каталога, сохраненном и похожих проектах.

### Строка списка
Логотип, название, описание в одну строку, стрелка справа; строки на
линиях, hover - `subtle`. Используется в списке каталога и указателе поиска.

### Navigation
- **Шапка:** липкая полоса во всю ширину, 64px, `border-b`. Слева логотип
  и ссылки, справа поиск, сохраненное со счетчиком, сегментный переключатель
  языка, переключатель темы и сплошная «Добавить проект».
- **Подвал:** `bg-subtle`, `border-t`, группы ссылок с моноширинными
  заголовками.

## Themes

Светлая тема - по умолчанию. Темная переопределяет те же токены под
`[data-theme=dark]` (фон `#0a0a0a`, линии около `#242424`, приглушенный
текст `#a1a1a1`, тоны ярче). Тема ставится инлайн-скриптом в `<head>` до
отрисовки: сначала выбор из `localStorage`, иначе `prefers-color-scheme`.

## Do's and Don'ts

### Do:
- **Do** брать цвет только из семантических токенов парами.
- **Do** давать категории ее тон через `TONE_CLASSES`, а не `tone-${name}`.
- **Do** делить секции и строки линиями, а не корпусами с тенями.
- **Do** писать числа, домены и ярлыки моноширинным.
- **Do** проверять прием на обеих локалях и в обеих темах.
- **Do** уважать `prefers-reduced-motion`.

### Don't:
- **Don't** красить тоном кнопки, текст или ссылки.
- **Don't** добавлять тени для глубины: глубина - это линия.
- **Don't** вводить третье шрифтовое семейство.
- **Don't** тянуть SaaS-блеск: светящиеся кнопки, градиентный текст.
- **Don't** использовать этно-орнамент и флаговые цвета как декор.
- **Don't** давать одному народу визуальный приоритет над другими.
- **Don't** хардкодить цвета и радиусы в обход токенов.
