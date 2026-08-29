---
name: starter-typescript
description: Правила типизации - strict, template literal types для идентификаторов, discriminated unions для состояний, минимум assertions, где допустима runtime-валидация. Использовать при правке любых .ts файлов и фронтматтера .astro.
---

# TypeScript

`astro/tsconfigs/strictest` (суперсет `strict`: `noUncheckedIndexedAccess`,
`noImplicitOverride`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`,
`noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`,
`allowUnreachableCode: false`, `allowUnusedLabels: false` - разом, без ручных
дублирующих флагов в `tsconfig.json`). Проверка: `bun run check` (`astro check`).

Версия зафиксирована на 6.x: `@astrojs/check` заявляет peer `typescript ^5 || ^6`,
на TS 7 проверка типов перестанет работать. Не поднимать мажор, пока это не изменится.

## Делать невалидное состояние невыразимым

Это главный прием стартера. Проверка типом дешевле проверки в рантайме.

**Discriminated union вместо флага рядом с данными:**

```ts
// так - включить без ID нельзя
export type AnalyticsProvider<TId> =
  | { readonly enabled: false }
  | { readonly enabled: true; readonly id: TId };

// не так - можно включить и забыть ID
interface Bad { enabled: boolean; id?: string }
```

**Template literal types для идентификаторов:**

```ts
export type SiteUrl = `https://${string}/`;   // протокол и слэш на конце
export type GtmId = `GTM-${string}`;          // не любой string
export type HexColor = `#${string}`;
export type Locale = `${string}-${string}`;
```

Это уже ловило реальный баг: `gtmId` был описан как `number | \`${number}\``,
и валидный `GTM-ABC1234` не проходил компиляцию.

## Аннотация или satisfies

`main.config.ts` объявлен как `const config: AppConfig = {...}` - **с аннотацией**.

`satisfies` сохранил бы литеральные типы, и `config.features.ai` имел бы тип
`false`, а не `boolean`. Тогда компонент, читающий выключенную фичу, ловил бы
ошибку «свойства не существует», хотя код корректен. Компоненты должны
писаться против **контракта**, а не против сегодняшних значений.

`satisfies` уместен для локальных литералов, где литеральный тип полезен
(например `satisfies Person` в `SEO.astro`).

## Ограничения

- `any` - нет. Не знаешь тип - `unknown` и сузить.
- `as` - только там, где знание недоступно компилятору, с комментарием почему.
  `!` (non-null) - избегать: был `site!` в роуте, который падал бы без `site`.
- Публичные типы - `readonly` для конфигурационных структур.
- Экспортировать типы там, где они живут (`src/config/types.ts`), а не реэкспортом
  через несколько файлов.

## Runtime-валидация

Только для того, что типы проверить не могут:

- формат строки (regex на GTM ID, ключ IndexNow, HEX, локаль);
- существование файла в `public/`;
- диапазоны чисел.

Живет в `src/config/validate.ts`, вызывается из `astro.config.mjs` - падает на
старте dev/build, а не на проде. Ошибки собираются в список и выводятся разом:
чинить три опечатки за один проход быстрее, чем за три.

Zod здесь не нужен: `astro/zod` есть в дереве зависимостей, но ради нескольких
regex тянуть схемы в конфиг - лишняя сложность.
