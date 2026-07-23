---
name: code-style
description: Use when writing or editing any TypeScript, Svelte, or SCSS file in this repo — enforces the adopted Silvermine-derived code standards, Svelte 5 runes rules, and the BEM/ITCSS/token SCSS architecture
---

# Code style — andreimuntean.dev

## TypeScript / JavaScript

- `const` default; `let` only when reassigned; never `var`.
- No implicit `any`. Exported or returned values get **explicit** types:
  `export function getX(): string { ... }`.
- Lowercase primitive types only (`string`, not `String`). `x: string` —
  no space before the colon, one after.
- `??` is the default fallback. Use `||` only when any falsy value should
  trigger the fallback, and say why in a comment if not obvious.
- Template literals only where they read better; never multi-line; never
  just to stringify — use `String(x)`.
- `async/await` over `.then()`, but independent awaits run concurrently:
  `const [ a, b ] = await Promise.all([ fnA(), fnB() ]);`
- Destructuring: basic object/array OK, array-rest OK, renaming OK.
  **Banned:** object-rest (`{ a, ...rest }`) and deep destructuring
  (`{ bar: { bas } }`).
- Arrows: `(a) => { return a * a; }` — parens always, spaces around `=>`,
  **no implicit returns**, never as class fields.
- Errors: check with `instanceof CustomError`, never string-match
  `err.message`/`err.code`.
- Constructor parameter properties only for `private` members.

## Formatting

- 3-space indent, spaces not tabs. Opening brace on statement line.
- Braces required even for one-line `if`/loops.
- Dangling comma in every multi-line array/object. `[]`/`{}` empty, no
  inner spaces; spaced when non-empty: `[ 1, 2 ]`, `{ a: 1 }`.
- One blank line between unrelated statements; group related ones.
- Files end with exactly one newline. Unix line endings.
- Return/break early on error conditions instead of nesting. Positive
  condition names (`isOpen`, never `isNotOpen`).
- Never commit commented-out code.

## Naming

- `camelCase` variables/functions; `_camelCase` private/protected;
  `UPPER_SNAKE_CASE` constants; `PascalCase` classes (nouns).
- Files: `kebab-case.ts`; classes and Svelte components `PascalCase`
  (`ProjectCard.svelte`); tests `name.test.ts` beside source.
- Acronyms all-caps (`API`) except leading position (`apiConfig`); `ID`
  always capitalized (`userID`).
- Functions named by what they return or do: `getX`, `listX` (collection),
  `isX` (boolean), strong-verb+noun otherwise.
- Doc comments: TSDoc `/** ... */` with description, `@param` per param,
  `@return` — no types in the doc comment (TS signature carries them).

## Svelte 5

- Runes only: `$state`, `$derived`, `$effect`, `$props`, `$bindable`.
  No `export let`, no stores for new state.
- Shared state: plain TS class with **field-level** `$state` — wrapping an
  instance in `$state(new X())` does NOT make fields reactive.
- `$derived` for computable values; `$effect` only for real side effects,
  never to derive.
- Typed props: `let { title }: { title: string } = $props();`
- Snippets over slots. Route data types from `./$types`, never hand-rolled.
- Before writing any `.svelte` file, consult the Svelte MCP server /
  svelte.dev/docs/ai if available — pre-runes patterns are actively wrong.

## SCSS

- ITCSS layer order: `_variables` → `_mixins` → `_reset` → `_base` →
  `components/*` → `_utilities`. Specificity only increases downward.
- BEM: `.card`, `.card__title`, `.card--featured`. Max nesting 3. No ID
  selectors. No bare element selectors outside `_base.scss`.
- **Tokens only** — every color/size/easing/font traces to
  `_variables.scss`. Hard-coded values are lint failures, not style
  preferences.
