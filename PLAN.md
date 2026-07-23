# andreimuntean.dev Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Atelier portfolio per `SPEC.md` — bilingual (EN/RO) SvelteKit site with schema-validated MDX case studies, inquiry form, OG/SEO/llms.txt machinery, token-driven motion, and a CI quality bar — ready to receive Claude Design's visual pass.

**Architecture:** Statically prerendered SvelteKit 2 (Svelte 5 runes) app on Vercel; all content in `/content` as zod-validated MDX (build fails on bad frontmatter — the agent-proofing contract); the only server function is the contact form action. Design tokens from `styles/_variables.scss` are the single styling source; pages ship functional-but-plain first, then a gated design-application pass applies Claude Design's output.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript (strict), mdsvex, zod v4, Paraglide JS 2 (inlang), SCSS + stylelint, Resend, satori + @resvg/resvg-js, @sveltejs/enhanced-img, Vitest, Playwright + axe, GitHub Actions + Lighthouse CI, `@sveltejs/adapter-vercel`.

## Global Constraints

Apply to every task. Source: `SPEC.md` §13 (full rules live in the skills created in Task 1 — load them before writing code or committing).

- Svelte 5 **runes only** (`$state`, `$derived`, `$effect`, `$props`, `$bindable`); no `export let`, no stores for new state.
- TypeScript: no implicit `any`; exported/returned values get **explicit types**; `??` default over `||`; no object-rest or deep destructuring; arrows always parenthesized, spaced, **no implicit returns**, never class fields; `const` default.
- Formatting: **3-space indent**, no tabs; braces always; dangling commas in multi-line literals; single trailing newline; opening brace on statement line.
- Naming: `camelCase` members, `_camelCase` private, `UPPER_SNAKE_CASE` constants, `PascalCase` classes/components (`ProjectCard.svelte`), `kebab-case` other files.
- SCSS: BEM classes, max nesting 3, no ID selectors, no bare elements outside `_base.scss`, **tokens only** — zero hard-coded colors/sizes/easings.
- Commits: `type: Subject line` (§13.2 types), header ≤ 72 chars, body wrapped at 90 explaining *why*; one logical change per commit; **no Claude attribution trailers** (global CLAUDE.md rule, wins over everything).
- i18n: EN is source of truth; published content needs both locales; `draft: true` may be EN-only.
- Motion: everything gated behind `prefers-reduced-motion`.
- A11y and perf are CI-enforced (Lighthouse ≥ 95 perf/a11y/SEO, per-page JS < 60KB gz).
- Node 22, npm. Site URL constant: `https://andreimuntean.dev`.

**Design gate:** Tasks 1–18 and 20–22 need no design input. Task 19 is **GATED** on Andrei uploading `DESIGN.md` + `MOCKUP.md` to Claude Design and importing the results back.

---

## Phase 0 — Guardrails

### Task 1: Repo skills + CLAUDE.md

**Files:**
- Create: `.claude/skills/code-style/SKILL.md`
- Create: `.claude/skills/commit-style/SKILL.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: `SPEC.md` §13 (rule source).
- Produces: skills every later task must load before writing code / committing.

- [ ] **Step 1: Write the code-style skill**

`.claude/skills/code-style/SKILL.md`:

````markdown
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
````

- [ ] **Step 2: Write the commit-style skill**

`.claude/skills/commit-style/SKILL.md`:

````markdown
---
name: commit-style
description: Use before creating any git commit or doing history cleanup in this repo — enforces the adopted commit-message format, one-change-per-commit rule, and fixup/autosquash rebase workflow
---

# Commit style — andreimuntean.dev

## Message format

```
type: Subject line in sentence case
                                      <- blank line
Body wrapped at 90 chars explaining WHY, not how (diff shows how).
Markdown OK; space before list markers.
```

- Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build`
  `ci` `chore` `revert` `config` `sub(type)`.
- Header (type + subject) ≤ 72 chars. Imperative-ish, capitalized subject.
- Issue refs `(#123)` at end of subject once GitHub issues exist — omit
  until then.
- **No attribution trailers of any kind** — no Co-Authored-By, no
  "Generated with" lines. Global user rule; always wins.

## History rules

- One commit = one logical change. Never "fixed X and added Y".
- Never a "fix review comments" commit — amend the actual commit:

```bash
git add -p
git commit --fixup=<sha-of-commit-being-fixed>
git rebase -i $(git merge-base origin/main HEAD) --autosquash
```

- Rebase off the merge-base, not main's tip, unless there's a real
  conflict.
- Formatting-only changes get their own commit, never mixed with
  functional changes.
````

- [ ] **Step 3: Write CLAUDE.md**

`CLAUDE.md`:

````markdown
# andreimuntean.dev — The Atelier

Bilingual (EN default, RO at /ro) portfolio. SvelteKit 2 + Svelte 5 runes,
TypeScript, SCSS tokens, MDX content, prerendered except the contact form
action. Deployed on Vercel. Full requirements: `SPEC.md`. Visual system:
`DESIGN.md`. Design brief: `MOCKUP.md`.

## Before you write anything

- Code or commits → load `.claude/skills/code-style` /
  `.claude/skills/commit-style` first. Non-negotiable.
- `.svelte` files → prefer the Svelte MCP server (`@sveltejs/mcp`,
  svelte.dev/docs/ai) to check runes-era correctness.

## Commands

- `npm run dev` / `npm run build` / `npm run preview`
- `npm run check` — svelte-check
- `npm run lint` — eslint + stylelint + prettier check
- `npm test` — vitest unit tests
- `npm run test:e2e` — playwright (+ axe a11y checks)

## Content workflow (the CMS is this repo)

- Projects live in `content/projects/<slug>/{en.mdx,ro.mdx}` + `assets/`.
- **EN is the source of truth.** Write EN first, translate to RO; Andrei
  (native speaker) reviews RO before merge. Published content needs both
  locales; `draft: true` may be EN-only and is excluded from builds.
- Frontmatter is zod-validated at build (`src/lib/content/schema.ts`) and
  cross-locale checked (`tier`, `status`, `year`, `links`, metric values,
  `featured`, `entryNo` must match). **A bad file fails the build — run
  `npm run build` before committing content.**
- Availability line: `content/site/config.json` → `availability.{en,ro}`.
- Voice (SPEC §1): first person, plain, numbers over adjectives; no
  "passionate"/"cutting-edge"/"blazing"; maker's notes lowercase
  `n.b. — ...`; every AI-leverage claim paired with its guardrail.

## Styling

Tokens only — everything traces to `src/styles/_variables.scss`. BEM,
max-nesting 3, ITCSS layer order. Hard-coded values fail stylelint.
````

- [ ] **Step 4: Commit**

```bash
git add .claude CLAUDE.md
git commit -m "docs: Add repo skills and CLAUDE.md for agentic development

Code-style and commit-style skills carry the enforceable versions of
SPEC.md §13 so they load lazily at write/commit time instead of inflating
every spec read. CLAUDE.md documents the content workflow that makes this
repo its own CMS."
```

---

## Phase 1 — Scaffold & tokens

### Task 2: SvelteKit scaffold + tooling

**Files:**
- Create: SvelteKit app skeleton at repo root (`src/`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `package.json`, `eslint.config.js`, `.prettierrc`, `playwright.config.ts`, `vitest` setup)
- Modify: `.gitignore`

**Interfaces:**
- Produces: working `npm run dev|build|check|lint|test|test:e2e` scripts every later task relies on.

- [ ] **Step 1: Scaffold in a temp dir and move into repo root**

```bash
cd /Users/andrei/Developer/coding/public/websites/portfolio
npx sv create tmp-app --template minimal --types ts --no-add-ons --no-install
rsync -a tmp-app/ ./ --exclude .git
rm -rf tmp-app
```

- [ ] **Step 2: Add official add-ons (accept defaults; paraglide: locales `en,ro`, no demo)**

```bash
npx sv add prettier eslint vitest playwright mdsvex paraglide --no-install
npm install
```

- [ ] **Step 3: Install remaining deps**

```bash
npm i zod resend @vercel/analytics
npm i -D @sveltejs/adapter-vercel sass stylelint stylelint-config-standard-scss stylelint-order satori @resvg/resvg-js wawoff2 @axe-core/playwright @sveltejs/enhanced-img @lhci/cli
```

- [ ] **Step 4: Configure formatting to the adopted standard**

`.prettierrc`:

```json
{
   "tabWidth": 3,
   "useTabs": false,
   "singleQuote": true,
   "trailingComma": "all",
   "printWidth": 100,
   "plugins": [ "prettier-plugin-svelte" ],
   "overrides": [ { "files": "*.svelte", "options": { "parser": "svelte" } } ]
}
```

Append to the generated `eslint.config.js` rules block:

```js
rules: {
   'no-var': 'error',
   'prefer-const': 'error',
   'eqeqeq': [ 'error', 'always' ],
   'curly': [ 'error', 'all' ],
   'arrow-parens': [ 'error', 'always' ],
   'arrow-body-style': [ 'error', 'always' ],
   '@typescript-eslint/explicit-module-boundary-types': 'error',
   '@typescript-eslint/no-explicit-any': 'error',
},
```

- [ ] **Step 5: Wire adapter-vercel + mdsvex `.mdx` in `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
   extensions: [ '.svelte', '.mdx' ],
   preprocess: [
      vitePreprocess(),
      mdsvex({
         extensions: [ '.mdx' ],
         layout: './src/lib/content/MdxLayout.svelte',
      }),
   ],
   kit: {
      adapter: adapter({ runtime: 'nodejs22.x' }),
   },
};

export default config;
```

(`MdxLayout.svelte` arrives in Task 6 — create an empty passthrough now so the config resolves:)

```svelte
<!-- src/lib/content/MdxLayout.svelte -->
<slot />
```

- [ ] **Step 6: Restore full `.gitignore`** (sv may have overwritten):

```
.DS_Store
node_modules
/build
/.svelte-kit
/.vercel
/package
.env
.env.*
!.env.example
/test-results
/playwright-report
/.lighthouseci
vite.config.ts.timestamp-*
```

- [ ] **Step 7: Add `lint` + stylelint scripts to `package.json`**

```json
"lint": "prettier --check . && eslint . && stylelint \"src/**/*.scss\"",
"format": "prettier --write .",
"test": "vitest run",
"test:e2e": "playwright test"
```

- [ ] **Step 8: Verify everything runs**

```bash
npm run check    # expected: 0 errors
npm run build    # expected: build succeeds
npm run lint     # expected: passes (fix any scaffold formatting fallout with npm run format)
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "build: Scaffold SvelteKit 2 app with adopted tooling

sv-created skeleton with prettier/eslint/vitest/playwright/mdsvex/
paraglide add-ons, adapter-vercel, and lint rules encoding the SPEC §13
standards (3-space indent, explicit boundary types, no implicit returns)."
```

### Task 3: Design tokens, ITCSS skeleton, fonts, stylelint

**Files:**
- Create: `src/styles/_variables.scss` (moved), `src/styles/_mixins.scss`, `src/styles/_reset.scss`, `src/styles/_base.scss`, `src/styles/_motion.scss` (empty for now), `src/styles/main.scss`, `.stylelintrc.json`
- Create: `static/fonts/*.woff2` (moved), `static/marks/*` (pngs), `src/lib/assets/marks/*.svg` (moved)
- Modify: `src/app.html`
- Delete: `assets/`, `styles/` (old locations)

**Interfaces:**
- Produces: SCSS tokens importable as `@use '$styles/variables' as *;` (vite alias `$styles` → `src/styles`), fonts served from `/fonts/*`, marks importable from `$lib/assets/marks/`.

- [ ] **Step 1: Move assets**

```bash
mkdir -p src/styles static/fonts static/marks src/lib/assets/marks
git mv styles/_variables.scss src/styles/_variables.scss
git mv assets/fonts/* static/fonts/
git mv assets/marks/*.png static/marks/
git mv assets/marks/*.svg src/lib/assets/marks/
rmdir assets/fonts assets/marks assets styles
```

- [ ] **Step 2: Split the `atelier-font-faces` mixin out of `_variables.scss` into `_mixins.scss`** (cut the whole `@mixin atelier-font-faces` block and paste into `src/styles/_mixins.scss`; change the default: `$font-path: '/fonts'`).

- [ ] **Step 3: Create the remaining layers**

`src/styles/_reset.scss`:

```scss
*,
*::before,
*::after {
   box-sizing: border-box;
   margin: 0;
}

img,
svg,
video {
   display: block;
   max-width: 100%;
}
```

`src/styles/_base.scss`:

```scss
@use 'variables' as *;

html {
   color-scheme: dark;
   scroll-behavior: smooth;
}

body {
   background: $color-umber;
   color: $color-ivory;
   font-family: $font-body;
   font-size: $font-size-body-lg;
   line-height: $line-height-body;
   -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
   font-family: $font-display;
   font-weight: $weight-bold;
   line-height: $line-height-tight;
}

a {
   color: $color-copper;
   text-decoration: none;
}

::selection {
   background: $color-walnut;
   color: $color-ivory;
}

@media (prefers-reduced-motion: reduce) {
   html {
      scroll-behavior: auto;
   }
}
```

`src/styles/main.scss`:

```scss
@use 'mixins' as *;
@use 'reset';
@use 'base';
@use 'motion';

@include atelier-font-faces;
```

- [ ] **Step 4: Alias + global import.** In `vite.config.ts` add:

```ts
resolve: {
   alias: { $styles: '/src/styles' },
},
```

Import `../styles/main.scss` in `src/routes/+layout.svelte` (Task 8 rebuilds this file; add the import now so styles apply during development).

- [ ] **Step 5: Preload critical faces in `src/app.html`** (inside `<head>`):

```html
<link rel="preload" href="/fonts/Basteleur-Bold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/ApfelGrotezk-Regular.woff2" as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 6: stylelint config** — `.stylelintrc.json`:

```json
{
   "extends": [ "stylelint-config-standard-scss" ],
   "plugins": [ "stylelint-order" ],
   "rules": {
      "max-nesting-depth": 3,
      "selector-max-id": 0,
      "color-no-hex": true,
      "scss/no-global-function-names": true,
      "order/properties-alphabetical-order": null
   },
   "ignoreFiles": [ "src/styles/_variables.scss" ]
}
```

(`color-no-hex` + ignoring `_variables.scss` = hex values legal only in the token file — the tokens-only rule, lint-enforced.)

- [ ] **Step 7: Verify**

```bash
npm run lint     # stylelint passes
npm run dev      # page renders umber background, Apfel body font
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: Port design tokens into ITCSS layers with lint enforcement

Tokens stay the single styling source: color-no-hex everywhere except
_variables.scss makes hard-coded values a lint failure. Fonts move to
static/, marks to lib assets, critical faces preloaded."
```

---

## Phase 2 — Content pipeline

### Task 4: Frontmatter schema + cross-locale validators (TDD)

**Files:**
- Create: `src/lib/content/schema.ts`, `src/lib/content/validate.ts`
- Test: `src/lib/content/schema.test.ts`, `src/lib/content/validate.test.ts`

**Interfaces:**
- Produces:
  - `projectFrontmatterSchema` (zod), types `ProjectFrontmatter`, `Tier`, `Status`
  - `validateProjectPair(slug: string, en: ProjectFrontmatter, ro: ProjectFrontmatter): string[]`
  - `validateRegistry(pairs: Record<string, { en?: ProjectFrontmatter; ro?: ProjectFrontmatter }>): string[]`

- [ ] **Step 1: Write failing schema tests** — `src/lib/content/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { projectFrontmatterSchema } from './schema';

const VALID = {
   title: 'CarHeltau',
   summary: 'Automotive contract automation.',
   tier: 'flagship',
   status: 'shipped',
   year: 2024,
   client: 'CarHeltau',
   role: 'Design & full-stack build',
   stack: [ 'Vue', 'Node.js' ],
   links: { demo: 'https://carheltau.ro/contract-online' },
   featured: 1,
   entryNo: 5,
};

describe('projectFrontmatterSchema', () => {
   it('accepts a valid flagship', () => {
      expect(projectFrontmatterSchema.parse(VALID)).toMatchObject({ tier: 'flagship' });
   });

   it('rejects unknown keys (agent typo protection)', () => {
      expect(() => { projectFrontmatterSchema.parse({ ...VALID, sumary: 'typo' }); }).toThrow();
   });

   it('rejects a bad status', () => {
      expect(() => { projectFrontmatterSchema.parse({ ...VALID, status: 'done' }); }).toThrow();
   });

   it('rejects more than 3 metrics', () => {
      const metrics = [ 1, 2, 3, 4 ].map((n) => { return { label: `m${n}`, value: String(n) }; });

      expect(() => { projectFrontmatterSchema.parse({ ...VALID, metrics }); }).toThrow();
   });

   it('rejects a non-URL link', () => {
      expect(() => { projectFrontmatterSchema.parse({ ...VALID, links: { demo: 'not-a-url' } }); }).toThrow();
   });
});
```

- [ ] **Step 2: Run to verify failure** — `npm test` → FAIL (`./schema` not found).

- [ ] **Step 3: Implement `src/lib/content/schema.ts`**

```ts
import { z } from 'zod';

export const tierSchema = z.enum([ 'flagship', 'entry' ]);
export const statusSchema = z.enum([ 'shipped', 'in-workshop', 'retired' ]);

export const linksSchema = z.strictObject({
   demo: z.url().optional(),
   github: z.url().optional(),
   figma: z.url().optional(),
});

export const metricSchema = z.strictObject({
   label: z.string().min(1),
   value: z.string().min(1),
});

export const quoteSchema = z.strictObject({
   text: z.string().min(1),
   author: z.string().min(1),
   role: z.string().min(1).optional(),
});

export const projectFrontmatterSchema = z.strictObject({
   title: z.string().min(1),
   summary: z.string().min(1),
   tier: tierSchema,
   status: statusSchema,
   year: z.number().int().gte(2020).lte(2100),
   client: z.string().min(1).optional(),
   role: z.string().min(1),
   stack: z.array(z.string().min(1)).min(1),
   links: linksSchema.default({}),
   timeline: z.string().min(1).optional(),
   metrics: z.array(metricSchema).max(3).optional(),
   quote: quoteSchema.optional(),
   featured: z.number().int().positive().optional(),
   entryNo: z.number().int().positive().optional(),
   draft: z.boolean().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Tier = z.infer<typeof tierSchema>;
export type Status = z.infer<typeof statusSchema>;
```

- [ ] **Step 4: Run** — `npm test` → schema tests PASS.

- [ ] **Step 5: Write failing validator tests** — `src/lib/content/validate.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { ProjectFrontmatter } from './schema';
import { validateProjectPair, validateRegistry } from './validate';

function fm(overrides: Partial<ProjectFrontmatter> = {}): ProjectFrontmatter {
   return {
      title: 'X',
      summary: 'S',
      tier: 'entry',
      status: 'shipped',
      year: 2024,
      role: 'Build',
      stack: [ 'Vue' ],
      links: {},
      ...overrides,
   };
}

describe('validateProjectPair', () => {
   it('passes when structural fields agree', () => {
      expect(validateProjectPair('x', fm(), fm({ title: 'X (ro)' }))).toEqual([]);
   });

   it('fails when status differs', () => {
      const errors = validateProjectPair('x', fm(), fm({ status: 'retired' }));

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('status');
   });

   it('fails when metric values differ but not when labels differ', () => {
      const en = fm({ metrics: [ { label: 'Load time', value: '1.2s' } ] }),
            roOK = fm({ metrics: [ { label: 'Timp de încărcare', value: '1.2s' } ] }),
            roBad = fm({ metrics: [ { label: 'Timp de încărcare', value: '9.9s' } ] });

      expect(validateProjectPair('x', en, roOK)).toEqual([]);
      expect(validateProjectPair('x', en, roBad)).toHaveLength(1);
   });
});

describe('validateRegistry', () => {
   it('requires ro unless draft', () => {
      expect(validateRegistry({ x: { en: fm() } })).toHaveLength(1);
      expect(validateRegistry({ x: { en: fm({ draft: true }) } })).toEqual([]);
   });

   it('always requires en', () => {
      expect(validateRegistry({ x: { ro: fm() } })).toHaveLength(1);
   });

   it('rejects duplicate entryNo and featured across projects', () => {
      const pairs = {
         a: { en: fm({ entryNo: 1, featured: 1 }), ro: fm({ entryNo: 1, featured: 1 }) },
         b: { en: fm({ entryNo: 1, featured: 1 }), ro: fm({ entryNo: 1, featured: 1 }) },
      };

      const errors = validateRegistry(pairs);

      expect(errors.some((e) => { return e.includes('entryNo'); })).toBe(true);
      expect(errors.some((e) => { return e.includes('featured'); })).toBe(true);
   });
});
```

- [ ] **Step 6: Run** — `npm test` → validate tests FAIL.

- [ ] **Step 7: Implement `src/lib/content/validate.ts`**

```ts
import type { ProjectFrontmatter } from './schema';

const MUST_MATCH = [ 'tier', 'status', 'year', 'featured', 'entryNo' ] as const;

function sameJSON(a: unknown, b: unknown): boolean {
   return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/**
 * Check that the structural fields of a project's EN and RO frontmatter agree.
 *
 * @param slug - project folder name, used in error messages
 * @param en - parsed EN frontmatter
 * @param ro - parsed RO frontmatter
 * @return error messages; empty when the pair is consistent
 */
export function validateProjectPair(
   slug: string,
   en: ProjectFrontmatter,
   ro: ProjectFrontmatter,
): string[] {
   const errors: string[] = [];

   for (const field of MUST_MATCH) {
      if (!sameJSON(en[field], ro[field])) {
         errors.push(`${slug}: "${field}" differs between en and ro`);
      }
   }

   if (!sameJSON(en.links, ro.links)) {
      errors.push(`${slug}: "links" differ between en and ro`);
   }

   const enValues = (en.metrics ?? []).map((m) => { return m.value; }),
         roValues = (ro.metrics ?? []).map((m) => { return m.value; });

   if (!sameJSON(enValues, roValues)) {
      errors.push(`${slug}: metric values differ between en and ro (labels may differ)`);
   }

   return errors;
}

/**
 * Validate the whole registry: locale completeness, pair consistency, and
 * uniqueness of entryNo/featured across projects.
 *
 * @param pairs - map of slug to the frontmatter found per locale
 * @return error messages; empty when the registry is publishable
 */
export function validateRegistry(
   pairs: Record<string, { en?: ProjectFrontmatter; ro?: ProjectFrontmatter }>,
): string[] {
   const errors: string[] = [];
   const seenEntryNos = new Map<number, string>(),
         seenFeatured = new Map<number, string>();

   for (const [ slug, pair ] of Object.entries(pairs)) {
      if (!pair.en) {
         errors.push(`${slug}: missing en.mdx (EN is the source of truth)`);
         continue;
      }

      if (!pair.ro) {
         if (pair.en.draft !== true) {
            errors.push(`${slug}: missing ro.mdx (only draft projects may be EN-only)`);
         }
         continue;
      }

      errors.push(...validateProjectPair(slug, pair.en, pair.ro));

      if (pair.en.entryNo !== undefined) {
         const holder = seenEntryNos.get(pair.en.entryNo);

         if (holder) {
            errors.push(`${slug}: entryNo ${pair.en.entryNo} already used by ${holder}`);
         }
         seenEntryNos.set(pair.en.entryNo, slug);
      }

      if (pair.en.featured !== undefined) {
         const holder = seenFeatured.get(pair.en.featured);

         if (holder) {
            errors.push(`${slug}: featured ${pair.en.featured} already used by ${holder}`);
         }
         seenFeatured.set(pair.en.featured, slug);
      }
   }

   return errors;
}
```

- [ ] **Step 8: Run** — `npm test` → all PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/content
git commit -m "feat: Add zod frontmatter schema and cross-locale validators

strictObject rejects typo'd keys and the pair validator enforces the
EN/RO structural contract from SPEC §6 — a malformed or inconsistent
content file becomes a build failure, not a silently broken page."
```

### Task 5: Content registry + seed content (all 8 projects, both locales)

**Files:**
- Create: `src/lib/content/projects.ts`, `src/lib/content/site.ts`
- Create: `content/projects/<slug>/{en.mdx,ro.mdx}` for slugs: `carheltau`, `cursed-vision-films`, `wedding-website`, `fota-industrial`, `priv`, `photography-portfolio`, `bioro`, `leida`
- Create: `content/site/config.json`
- Test: `src/lib/content/projects.test.ts`

**Interfaces:**
- Consumes: `projectFrontmatterSchema`, `validateRegistry` (Task 4).
- Produces:
  - `type Locale = 'en' | 'ro'`, `type ProjectMeta = ProjectFrontmatter & { slug: string }`
  - `getAllProjects(locale: Locale): ProjectMeta[]` (entryNo ascending)
  - `getFlagships(locale: Locale): ProjectMeta[]`, `getEntries(locale: Locale): ProjectMeta[]`
  - `getFeatured(locale: Locale): ProjectMeta[]` (featured order)
  - `getProject(locale: Locale, slug: string): ProjectMeta | undefined`
  - `getFlagshipSlugs(): string[]`
  - `loadProjectBody(locale: Locale, slug: string): Promise<typeof import('*.svelte').default>`
  - `getSiteConfig(): SiteConfig` — `{ availability: { en: string; ro: string }; email: string; responseTime: { en: string; ro: string }; socials: { github: string; linkedin: string } }`

- [ ] **Step 1: Implement `src/lib/content/projects.ts`**

```ts
import { projectFrontmatterSchema, type ProjectFrontmatter } from './schema';
import { validateRegistry } from './validate';

export type Locale = 'en' | 'ro';
export type ProjectMeta = ProjectFrontmatter & { slug: string };

const metadataModules = import.meta.glob(
   [ '/content/projects/*/en.mdx', '/content/projects/*/ro.mdx' ],
   { eager: true, import: 'metadata' },
) as Record<string, unknown>;

const bodyModules = import.meta.glob('/content/projects/*/*.mdx');

function buildRegistry(): Record<Locale, ProjectMeta[]> {
   const pairs: Record<string, { en?: ProjectFrontmatter; ro?: ProjectFrontmatter }> = {};

   for (const [ path, metadata ] of Object.entries(metadataModules)) {
      const match = path.match(/\/content\/projects\/([^/]+)\/(en|ro)\.mdx$/);

      if (!match) {
         throw new Error(`Unexpected content path: ${path}`);
      }

      const [ , slug, locale ] = match;
      const parsed = projectFrontmatterSchema.safeParse(metadata);

      if (!parsed.success) {
         throw new Error(`Invalid frontmatter in ${path}:\n${parsed.error.message}`);
      }

      pairs[slug] = pairs[slug] ?? {};
      pairs[slug][locale as Locale] = parsed.data;
   }

   const errors = validateRegistry(pairs);

   if (errors.length > 0) {
      throw new Error(`Content registry invalid:\n - ${errors.join('\n - ')}`);
   }

   const byLocale: Record<Locale, ProjectMeta[]> = { en: [], ro: [] };

   for (const [ slug, pair ] of Object.entries(pairs)) {
      if (pair.en?.draft === true) {
         continue;
      }
      byLocale.en.push({ ...pair.en as ProjectFrontmatter, slug });
      byLocale.ro.push({ ...pair.ro as ProjectFrontmatter, slug });
   }

   for (const locale of [ 'en', 'ro' ] as const) {
      byLocale[locale].sort((a, b) => { return (a.entryNo ?? 999) - (b.entryNo ?? 999); });
   }

   return byLocale;
}

const REGISTRY = buildRegistry();

export function getAllProjects(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale];
}

export function getFlagships(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale].filter((p) => { return p.tier === 'flagship'; });
}

export function getEntries(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale].filter((p) => { return p.tier === 'entry'; });
}

export function getFeatured(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale]
      .filter((p) => { return p.featured !== undefined; })
      .sort((a, b) => { return (a.featured ?? 0) - (b.featured ?? 0); });
}

export function getProject(locale: Locale, slug: string): ProjectMeta | undefined {
   return REGISTRY[locale].find((p) => { return p.slug === slug; });
}

export function getFlagshipSlugs(): string[] {
   return getFlagships('en').map((p) => { return p.slug; });
}

export async function loadProjectBody(
   locale: Locale,
   slug: string,
): Promise<import('svelte').Component> {
   const key = `/content/projects/${slug}/${locale}.mdx`;
   const loader = bodyModules[key];

   if (!loader) {
      throw new Error(`No case-study body at ${key}`);
   }

   const module = (await loader()) as { default: import('svelte').Component };

   return module.default;
}
```

- [ ] **Step 2: Implement `src/lib/content/site.ts`**

```ts
import { z } from 'zod';
import rawConfig from '/content/site/config.json';

const siteConfigSchema = z.strictObject({
   availability: z.strictObject({ en: z.string().min(1), ro: z.string().min(1) }),
   email: z.email(),
   responseTime: z.strictObject({ en: z.string().min(1), ro: z.string().min(1) }),
   socials: z.strictObject({ github: z.url(), linkedin: z.url() }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

const CONFIG = siteConfigSchema.parse(rawConfig);

export function getSiteConfig(): SiteConfig {
   return CONFIG;
}
```

- [ ] **Step 3: Seed `content/site/config.json`**

```json
{
   "availability": {
      "en": "2 slots open · Q4 2026",
      "ro": "2 locuri libere · T4 2026"
   },
   "email": "contact@andreimuntean.dev",
   "responseTime": {
      "en": "I read everything within a day or two.",
      "ro": "Citesc tot în cel mult o zi sau două."
   },
   "socials": {
      "github": "https://github.com/andreimuntean1",
      "linkedin": "https://www.linkedin.com/in/andreimuntean1"
   }
}
```

- [ ] **Step 4: Seed project files.** Full example — `content/projects/carheltau/en.mdx`:

```mdx
---
title: CarHeltau
summary: Contract paperwork that used to take an afternoon now takes minutes.
tier: flagship
status: shipped
year: 2024
client: CarHeltau
role: Design & full-stack build
stack:
   - Vue
   - Node.js
   - Stripe
links:
   demo: https://carheltau.ro/contract-online
featured: 1
entryNo: 5
---

## Brief

Placeholder — real case-study copy lands at the content pass (SPEC §15).

## Constraints

Placeholder.

## Approach & decisions

Placeholder.

## Reflection

Placeholder.
```

`content/projects/carheltau/ro.mdx` — identical structural fields, RO copy:

```mdx
---
title: CarHeltau
summary: Actele de contract care durau o după-amiază durează acum câteva minute.
tier: flagship
status: shipped
year: 2024
client: CarHeltau
role: Design & implementare full-stack
stack:
   - Vue
   - Node.js
   - Stripe
links:
   demo: https://carheltau.ro/contract-online
featured: 1
entryNo: 5
---

## Context

Placeholder — copy real la etapa de conținut (SPEC §15).

## Constrângeri

Placeholder.

## Abordare și decizii

Placeholder.

## Retrospectivă

Placeholder.
```

Remaining 7 projects use the same file shape (same body skeleton, per-locale `role` translated). Frontmatter values (stack/year are best-guesses — flagged for the SPEC §15 content pass):

| slug | tier | status | year | client | stack | links | featured | entryNo | summary EN / RO |
|---|---|---|---|---|---|---|---|---|---|
| `bioro` | entry | retired | 2023 | — | React, Figma | demo `https://bioro.vercel.app/`, github `https://github.com/andreimuntean1/bioro`, figma (old JSON URL) | — | 1 | QR-code transparency for local producers. / Transparență prin cod QR pentru producători locali. |
| `leida` | entry | retired | 2023 | Leida | HTML, SCSS, JavaScript | demo `https://dev.leida.ro` | — | 2 | Landing page for premium HoReCa equipment. / Landing page pentru echipamente HoReCa premium. |
| `wedding-website` | flagship | shipped | 2024 | — | Vue, Netlify | demo `https://andreisiandreea.netlify.app`, github `https://github.com/andreimuntean1/andreisiandreea`, figma (old JSON URL) | 3 | 3 | Our wedding's guest space — photos, videos, messages. / Spațiul invitaților nunții noastre — poze, video, mesaje. |
| `fota-industrial` | entry | shipped | 2024 | Fota Industrial | Vue, Node.js | demo `https://fotaindustrial.ro` | — | 4 | B2B catalog platform with a custom CMS. / Platformă B2B de catalog cu CMS propriu. |
| `carheltau` | flagship | shipped | 2024 | CarHeltau | Vue, Node.js, Stripe | demo (above) | 1 | 5 | (above) |
| `cursed-vision-films` | flagship | shipped | 2025 | Cursed Vision Films | React, JavaScript | demo `https://www.cursedvisionfilms.com` | 2 | 6 | A cinematography site brought back to speed. / Un site de cinematografie readus la viteză. |
| `priv` | entry | shipped | 2025 | — | Flutter, Supabase | github `https://github.com/andreimuntean1/priv` | — | 7 | Private real-time messaging for exactly two people. / Mesagerie privată în timp real pentru exact două persoane. |
| `photography-portfolio` | entry | in-workshop | 2026 | — | SvelteKit, Claude Code | (none) | — | 8 | Photography portfolio with an agent-built CMS — on the bench now. / Portofoliu foto cu CMS construit cu agenți — acum pe banc. |

- [ ] **Step 5: Registry smoke test** — `src/lib/content/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getEntries, getFeatured, getFlagships, getFlagshipSlugs } from './projects';

describe('content registry', () => {
   it('loads 3 flagships and 5 entries per locale', () => {
      expect(getFlagships('en')).toHaveLength(3);
      expect(getFlagships('ro')).toHaveLength(3);
      expect(getEntries('en')).toHaveLength(5);
   });

   it('features carheltau, cursed-vision-films, wedding-website in order', () => {
      expect(getFeatured('en').map((p) => { return p.slug; })).toEqual([
         'carheltau',
         'cursed-vision-films',
         'wedding-website',
      ]);
   });

   it('exposes flagship slugs for prerender entries', () => {
      expect(getFlagshipSlugs()).toContain('carheltau');
   });
});
```

- [ ] **Step 6: Run** — `npm test` → PASS (registry parses all 16 files). Then `npm run build` → succeeds.

- [ ] **Step 7: Negative check (prove the contract):** temporarily change `status` in `content/projects/leida/ro.mdx` to `shipped`, run `npm run build` → expect failure containing `leida: "status" differs`. Revert.

- [ ] **Step 8: Commit**

```bash
git add src/lib/content content
git commit -m "feat: Add content registry and seed all eight projects in both locales

Eager metadata glob parses every frontmatter through the schema at module
init, so prerendering a single page validates the entire content set.
Seed copy is placeholder; structural fields are real pending the SPEC §15
content pass."
```

### Task 6: MDX components + layout

**Files:**
- Create: `src/lib/content/MdxLayout.svelte` (replace passthrough), `src/lib/components/mdx/MakerNote.svelte`, `AgentNotes.svelte`, `Metrics.svelte`, `Quote.svelte`, `Figure.svelte`, `Stamp.svelte`
- Create: `src/styles/components/_mdx.scss`
- Modify: `vite.config.ts` (enhanced-img)

**Interfaces:**
- Produces: components auto-available inside every `.mdx` body (no imports needed in content files — the agent-friendliness point). `Figure` resolves co-located images: `<Figure src="hero.png" caption="..." />` relative to the project's `assets/` folder via eager enhanced glob.

- [ ] **Step 1: Add enhanced-img plugin** in `vite.config.ts`:

```ts
import { enhancedImages } from '@sveltejs/enhanced-img';
// plugins: [ enhancedImages(), paraglideVitePlugin(...), sveltekit() ] — order: enhancedImages first
```

- [ ] **Step 2: Components.** `MakerNote.svelte`:

```svelte
<script lang="ts">
   let { children }: { children: import('svelte').Snippet } = $props();
</script>

<aside class="maker-note"><span class="maker-note__prefix">n.b. —</span> {@render children()}</aside>
```

`AgentNotes.svelte`:

```svelte
<script lang="ts">
   let { did, decided, verified }: { did: string; decided: string; verified: string } = $props();
</script>

<section class="agent-notes">
   <h3 class="agent-notes__title">Agent notes</h3>
   <dl class="agent-notes__grid">
      <dt>What agents did</dt>
      <dd>{did}</dd>
      <dt>What I decided</dt>
      <dd>{decided}</dd>
      <dt>What verified it</dt>
      <dd>{verified}</dd>
   </dl>
</section>
```

`Metrics.svelte`:

```svelte
<script lang="ts">
   let { items }: { items: { label: string; value: string }[] } = $props();
</script>

<ul class="metrics">
   {#each items as metric (metric.label)}
      <li class="metrics__item">
         <span class="metrics__value">{metric.value}</span>
         <span class="metrics__label">{metric.label}</span>
      </li>
   {/each}
</ul>
```

`Quote.svelte`:

```svelte
<script lang="ts">
   let { text, author, role }: { text: string; author: string; role?: string } = $props();
</script>

<figure class="quote">
   <blockquote class="quote__text">{text}</blockquote>
   <figcaption class="quote__author">{author}{#if role} · {role}{/if}</figcaption>
</figure>
```

`Stamp.svelte` (inline SVG so Task 18 can animate it):

```svelte
<script lang="ts">
   import stamp from '$lib/assets/marks/shipping-stamp.svg?raw';
</script>

<div class="stamp" aria-label="Shipped">
   <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
   {@html stamp}
</div>
```

`Figure.svelte`:

```svelte
<script lang="ts">
   const images = import.meta.glob('/content/projects/*/assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: { enhanced: true },
      import: 'default',
   }) as Record<string, string>;

   let { src, caption, slug }: { src: string; caption: string; slug: string } = $props();

   const resolved = $derived(images[`/content/projects/${slug}/assets/${src}`]);
</script>

<figure class="figure">
   {#if resolved}
      <enhanced:img src={resolved} alt={caption} sizes="(min-width: 1024px) 960px, 100vw" />
   {/if}
   <figcaption class="figure__caption">{caption}</figcaption>
</figure>
```

- [ ] **Step 3: `MdxLayout.svelte`** — module-exported components are usable in MDX without imports:

```svelte
<script module lang="ts">
   export { default as MakerNote } from '$lib/components/mdx/MakerNote.svelte';
   export { default as AgentNotes } from '$lib/components/mdx/AgentNotes.svelte';
   export { default as Metrics } from '$lib/components/mdx/Metrics.svelte';
   export { default as Quote } from '$lib/components/mdx/Quote.svelte';
   export { default as Figure } from '$lib/components/mdx/Figure.svelte';
   export { default as Stamp } from '$lib/components/mdx/Stamp.svelte';
</script>

<slot />
```

- [ ] **Step 4: Token-based styles** in `src/styles/components/_mdx.scss` (BEM, tokens only — `.maker-note` in `$font-mono` italic `$color-copper`, `.metrics__value` in `$font-display`, `.agent-notes` on `$color-bench` with `$radius-md` and `$border-hairline`, etc.). Add `@use 'components/mdx';` to `main.scss`.

- [ ] **Step 5: Verify** — add one `<MakerNote>test</MakerNote>` to `carheltau/en.mdx` temporarily, `npm run dev`, confirm it renders; remove it. `npm run lint && npm run check` pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Add MDX component set with import-free availability in content

MdxLayout module-exports the six case-study components so agents writing
content never manage imports; Figure resolves co-located assets through
the enhanced-img pipeline."
```

---

## Phase 3 — i18n

### Task 7: Paraglide locales, URL strategy, messages, switcher helper

**Files:**
- Modify: `project.inlang/settings.json`, `vite.config.ts` (plugin options), `src/hooks.ts`, `src/hooks.server.ts` (as generated by `sv add paraglide`)
- Create/Modify: `messages/en.json`, `messages/ro.json`
- Create: `src/lib/i18n.ts`

**Interfaces:**
- Consumes: paraglide runtime generated at `src/lib/paraglide/`.
- Produces:
  - `messages/*` keys used by all pages: `nav_work`, `nav_process`, `nav_about`, `nav_contact`, `skip_to_content`, `cta_get_in_touch`, `cta_see_work`, `cta_see_resume`, `footer_colophon`, `footer_font_credits`, `form_name`, `form_email`, `form_message`, `form_submit`, `form_error_name`, `form_error_email`, `form_error_message`, `form_success_title`, `form_success_body`, `form_failure_body`, `contact_language_note`, `status_shipped`, `status_in_workshop`, `status_retired`, `work_flagships_heading`, `work_entries_heading`, `home_eyebrow`, `home_headline`, `home_support`, `not_found_title`, `not_found_cta`
  - `src/lib/i18n.ts`: `currentLocale(): Locale`, `altHref(path: string): string` (same path, other locale), `t` re-export of messages.

- [ ] **Step 1: Configure strategy** — in `vite.config.ts` paraglide plugin options:

```ts
paraglideVitePlugin({
   project: './project.inlang',
   outdir: './src/lib/paraglide',
   strategy: [ 'url', 'baseLocale' ],
}),
```

`project.inlang/settings.json`: `"baseLocale": "en"`, `"locales": [ "en", "ro" ]`. Default URL pattern = base locale unprefixed, `ro` under `/ro` — exactly SPEC §8; no custom urlPatterns needed.

- [ ] **Step 2: Fill `messages/en.json`** (all keys above; EN values from MOCKUP copy, e.g. `"home_headline": "Made with care, shipped with agents."`, `"home_eyebrow": "from the workshop of Andrei Muntean"`, `"home_support": "Full-stack engineer — design-minded, AI-native. Six-week handovers, documentation included, no mystery boxes."`, `"contact_language_note": "Vorbesc română — write in Romanian if that's easier."`). Fill `messages/ro.json` with RO translations (`"home_headline": "Făcut cu grijă, livrat cu agenți."`, `"contact_language_note": "English is fine too — scrie în engleză dacă îți e mai ușor."`, rest translated straightforwardly). Andrei reviews RO at content pass.

- [ ] **Step 3: `src/lib/i18n.ts`**

```ts
import { getLocale, localizeHref } from '$lib/paraglide/runtime';
import type { Locale } from '$lib/content/projects';

export function currentLocale(): Locale {
   return getLocale() as Locale;
}

/**
 * Same path in the other locale — powers the nav language switcher and
 * hreflang alternates.
 *
 * @param path - localized or unlocalized pathname
 * @return href for the opposite locale
 */
export function altHref(path: string): string {
   const other: Locale = currentLocale() === 'en' ? 'ro' : 'en';

   return localizeHref(path, { locale: other });
}
```

- [ ] **Step 4: Verify** — `npm run dev`, open `/` and `/ro`; `getLocale()` differs (temporarily log in a page). `npm run check` passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Configure Paraglide with EN-default and RO-prefixed URL strategy

One route tree serves both locales; messages carry every UI string so
page components stay copy-free, and altHref gives the switcher and
hreflang the mirrored path in one call."
```

---

## Phase 4 — Routes (functional, token-plain; design pass comes in Task 19)

### Task 8: Root layout, (site) group, Nav, Footer, view transitions

**Files:**
- Create: `src/routes/+layout.svelte` (rebuild), `src/routes/+layout.ts`, `src/routes/(site)/+layout.svelte`, `src/lib/components/SiteNav.svelte`, `src/lib/components/SiteFooter.svelte`, `src/lib/components/Availability.svelte`
- Create: `src/styles/components/_nav.scss`, `_footer.scss`

**Interfaces:**
- Consumes: `getSiteConfig`, messages, `altHref`, marks.
- Produces: `(site)` layout wrapping all v1 routes (future `(app)`/`(auth)` groups sit beside it per SPEC §11); `<main id="content">` target for the skip link.

- [ ] **Step 1: `src/routes/+layout.ts`**

```ts
export const prerender = true;
```

- [ ] **Step 2: `src/routes/+layout.svelte`** — global shell:

```svelte
<script lang="ts">
   import '../styles/main.scss';
   import { onNavigate } from '$app/navigation';
   import { dev } from '$app/environment';
   import { injectAnalytics } from '@vercel/analytics/sveltekit';

   let { children }: { children: import('svelte').Snippet } = $props();

   injectAnalytics({ mode: dev ? 'development' : 'production' });

   onNavigate((navigation) => {
      if (!document.startViewTransition) {
         return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         return;
      }

      return new Promise((resolve) => {
         document.startViewTransition(() => {
            resolve();
            return navigation.complete;
         });
      });
   });
</script>

{@render children()}
```

- [ ] **Step 3: `(site)` layout** — skip link + nav + `<main id="content">` + footer:

```svelte
<script lang="ts">
   import SiteNav from '$lib/components/SiteNav.svelte';
   import SiteFooter from '$lib/components/SiteFooter.svelte';
   import * as m from '$lib/paraglide/messages';

   let { children }: { children: import('svelte').Snippet } = $props();
</script>

<a class="skip-link" href="#content">{m.skip_to_content()}</a>
<SiteNav />
<main id="content">
   {@render children()}
</main>
<SiteFooter />
```

- [ ] **Step 4: `SiteNav.svelte`** — wordmark (inline `wordmark.svg?raw`, link home via `localizeHref('/')`), links Work/Process/About/Contact via `localizeHref`, `aria-current="page"` when `page.url.pathname` matches, language switcher `<a href={altHref(page.url.pathname)}>` labeled `EN/RO` with current locale marked, mobile disclosure `<details>`-based (accessible default; design pass restyles). `SiteFooter.svelte` — wordmark, `<Availability />`, email link, GitHub/LinkedIn from config, colophon link, font-credit line (`m.footer_font_credits()`). `Availability.svelte`:

```svelte
<script lang="ts">
   import { getSiteConfig } from '$lib/content/site';
   import { currentLocale } from '$lib/i18n';

   const availability = $derived(getSiteConfig().availability[currentLocale()]);
</script>

<p class="availability"><span class="availability__dot" aria-hidden="true"></span>{availability}</p>
```

- [ ] **Step 5: Verify** — dev server: skip link appears on Tab, nav routes 404 for now (pages come next), `/ro` nav shows RO strings. `npm run check && npm run lint` pass.

- [ ] **Step 6: Commit** — `feat: Add site shell with nav, footer, skip link and view transitions`

### Task 9: Home page

**Files:**
- Create: `src/routes/(site)/+page.ts`, `src/routes/(site)/+page.svelte`, `src/lib/components/ProjectCard.svelte`, `src/styles/components/_card.scss`, `_hero.scss`

**Interfaces:**
- Consumes: `getFeatured`, `getSiteConfig`, messages.
- Produces: `ProjectCard` with `{ project: ProjectMeta; variant: 'flagship' | 'entry' }` props — reused by Task 10. Card title carries `style:view-transition-name={'title-' + project.slug}`.

- [ ] **Step 1: `+page.ts`**

```ts
import { getFeatured } from '$lib/content/projects';
import { currentLocale } from '$lib/i18n';

export function load(): { featured: ReturnType<typeof getFeatured> } {
   return { featured: getFeatured(currentLocale()) };
}
```

- [ ] **Step 2: `+page.svelte`** — sections per MOCKUP §3.1: hero (`m.home_eyebrow()`, `<h1 class="hero__headline">{m.home_headline()}</h1>`, support, `<Availability />`, primary CTA → `localizeHref('/contact')`, secondary → `/work`), featured `ProjectCard` loop (flagship variant), process strip (3 steps hardcoded from messages `home_step_1..3` — add those keys to both message files), trust band placeholder renders only if a featured project has `quote` (none seeded — block hidden, correct per optional-block contract), contact teaser.
- [ ] **Step 3: `ProjectCard.svelte`** — flagship variant: title (+view-transition-name), summary, ≤3 `Metrics` if present, stack tags, status chip, wraps in `<a>` to `/work/[slug]` only when `tier === 'flagship'`; entry variant: compact — title, year, summary, stack, status chip, external links list; `status !== 'shipped'` renders the status chip with `status_*` message.
- [ ] **Step 4: Verify** — `/` and `/ro` render hero + 3 cards; `npm run build` passes.
- [ ] **Step 5: Commit** — `feat: Add home page with featured work and process strip`

### Task 10: Work index

**Files:**
- Create: `src/routes/(site)/work/+page.ts`, `+page.svelte`

**Interfaces:** consumes `getFlagships`/`getEntries` + `ProjectCard`.

- [ ] **Step 1:** `+page.ts` returns `{ flagships, entries }` for `currentLocale()`.
- [ ] **Step 2:** `+page.svelte` — flagship section (large cards), entries section (compact cards, `№ ${String(entryNo).padStart(3, '0')}` ledger label in mono — final keep/kill call is Claude Design's, markup carries it for now), retired/in-workshop chips visible.
- [ ] **Step 3:** Verify both locales; commit — `feat: Add work index with flagship and entry sections`

### Task 11: Case-study pages

**Files:**
- Create: `src/routes/(site)/work/[slug]/+page.ts`, `+page.svelte`, `src/styles/components/_case-study.scss`

**Interfaces:**
- Consumes: `getProject`, `loadProjectBody`, `getFlagshipSlugs`, MDX components, `Stamp`.

- [ ] **Step 1: `+page.ts`**

```ts
import { error } from '@sveltejs/kit';
import { getFlagshipSlugs, getProject, loadProjectBody } from '$lib/content/projects';
import { currentLocale } from '$lib/i18n';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
   return getFlagshipSlugs().map((slug) => { return { slug }; });
};

export async function load({ params }: { params: { slug: string } }): Promise<{
   project: NonNullable<ReturnType<typeof getProject>>;
   body: import('svelte').Component;
}> {
   const locale = currentLocale(),
         project = getProject(locale, params.slug);

   if (!project || project.tier !== 'flagship') {
      error(404, 'Not part of the workshop');
   }

   return { project, body: await loadProjectBody(locale, params.slug) };
}
```

- [ ] **Step 2: `+page.svelte`** — spec-sheet header from frontmatter (client?, year, role, stack, timeline?, status chip, links — each optional field conditionally rendered), `Metrics` banner if `project.metrics`, `<h1 style:view-transition-name={'title-' + project.slug}>`, `<svelte:component this={data.body} />` — wait, Svelte 5: `{@const Body = data.body}<Body />` — use the capitalized-variable pattern:

```svelte
{#if data.body}
   {@const Body = data.body}
   <Body slug={data.project.slug} />
{/if}
```

then `Quote` if frontmatter has one, `Stamp` + CTA footer.
- [ ] **Step 3:** Verify `/work/carheltau`, `/ro/work/carheltau` render; `/work/priv` → 404. `npm run build` prerenders 3 slugs × 2 locales.
- [ ] **Step 4:** Commit — `feat: Add flagship case-study pages with optional-block template`

### Task 12: Process, About, Colophon, Contact skeleton, 404

**Files:**
- Create: `content/site/{process,about,colophon}.{en,ro}.mdx` (frontmatter: `title`, `description`; bodies per MOCKUP §3.4/3.5/3.7, placeholder-but-structured copy), `src/lib/content/pages.ts` (glob loader like `loadProjectBody` for `/content/site/<page>.<locale>.mdx`), routes `src/routes/(site)/{process,about,colophon}/+page.{ts,svelte}`, `src/routes/(site)/contact/+page.svelte` (form markup only — action in Task 14), `src/routes/+error.svelte`

- [ ] **Step 1:** `pages.ts` — `loadSitePage(page: 'process' | 'about' | 'colophon', locale: Locale): Promise<{ metadata: { title: string; description: string }; default: Component }>` via glob on `/content/site/*.mdx`.
- [ ] **Step 2:** Three content routes render body inside a prose wrapper; process page timeline markup as `<ol class="timeline">` (4 steps — Discovery/Proposal/Build/Handover from messages) ready for Task 18's draw animation.
- [ ] **Step 3:** `+error.svelte` — `m.not_found_title()` ("Lost in the workshop." / "Rătăcit prin atelier."), CTA home.
- [ ] **Step 4:** Contact page: form (`method="POST"`, `use:enhance` deferred to Task 14), fields name/email/message with labels from messages, hidden `company` honeypot (`class="visually-hidden"` + `tabindex="-1"` + `autocomplete="off"`), hidden `startedAt` value stamped on mount, email fallback link, `<Availability />`, response-time line, language note.
- [ ] **Step 5:** Verify all routes both locales, 404 page on bad URL. Commit — `feat: Add process, about, colophon, contact skeleton and 404`

### Task 13: Resume/CV redirects + placeholder PDFs

**Files:**
- Create: `src/routes/(site)/resume/+server.ts`, `src/routes/(site)/cv/+server.ts`, `static/files/resume-en.pdf`, `static/files/cv-ro.pdf`

- [ ] **Step 1: Placeholder PDFs** (minimal valid single blank page):

```bash
mkdir -p static/files
printf '%%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\ntrailer<</Root 1 0 R>>\n%%%%EOF\n' > static/files/resume-en.pdf
cp static/files/resume-en.pdf static/files/cv-ro.pdf
```

- [ ] **Step 2: Redirect endpoints** — `resume/+server.ts`:

```ts
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export function GET(): never {
   redirect(302, '/files/resume-en.pdf');
}
```

`cv/+server.ts` identical with `/files/cv-ro.pdf`. 302 on purpose — placeholders will be replaced; nothing should cache them permanently.

- [ ] **Step 3:** Verify `curl -I localhost:5173/resume` → 302 + Location. Commit — `feat: Add resume and cv redirects with placeholder PDFs`

---

## Phase 5 — Form backend

### Task 14: Inquiry parsing (TDD) + form action + Resend

**Files:**
- Create: `src/lib/server/inquiry.ts`, `src/routes/(site)/contact/+page.server.ts`
- Modify: `src/routes/(site)/contact/+page.svelte` (enhance + states)
- Test: `src/lib/server/inquiry.test.ts`

**Interfaces:**
- Produces: `parseInquiry(data: FormData, now?: number): InquiryResult` where

```ts
type InquiryResult =
   | { kind: 'spam' }
   | { kind: 'invalid'; errors: Partial<Record<'name' | 'email' | 'message', string>>; values: Record<string, string> }
   | { kind: 'valid'; inquiry: { name: string; email: string; message: string } };
```

- [ ] **Step 1: Failing tests** — `src/lib/server/inquiry.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MIN_SUBMIT_MS, parseInquiry } from './inquiry';

function form(fields: Record<string, string>): FormData {
   const data = new FormData();

   for (const [ key, value ] of Object.entries(fields)) {
      data.set(key, value);
   }
   return data;
}

const NOW = 1_000_000;

const GOOD = {
   name: 'Ana',
   email: 'ana@example.com',
   message: 'We need a booking platform.',
   company: '',
   startedAt: String(NOW - MIN_SUBMIT_MS - 1),
};

describe('parseInquiry', () => {
   it('accepts a legitimate submission', () => {
      expect(parseInquiry(form(GOOD), NOW)).toEqual({
         kind: 'valid',
         inquiry: { name: 'Ana', email: 'ana@example.com', message: 'We need a booking platform.' },
      });
   });

   it('flags a filled honeypot as spam', () => {
      expect(parseInquiry(form({ ...GOOD, company: 'Botz Inc' }), NOW).kind).toBe('spam');
   });

   it('flags a too-fast submission as spam', () => {
      expect(parseInquiry(form({ ...GOOD, startedAt: String(NOW - 500) }), NOW).kind).toBe('spam');
   });

   it('returns field errors with preserved values', () => {
      const result = parseInquiry(form({ ...GOOD, email: 'nope' }), NOW);

      expect(result.kind).toBe('invalid');

      if (result.kind === 'invalid') {
         expect(result.errors.email).toBeTruthy();
         expect(result.values.name).toBe('Ana');
      }
   });
});
```

- [ ] **Step 2:** `npm test` → FAIL.

- [ ] **Step 3: Implement `src/lib/server/inquiry.ts`**

```ts
import { z } from 'zod';

export const MIN_SUBMIT_MS = 3000;

const inquirySchema = z.object({
   name: z.string().trim().min(2, 'form_error_name'),
   email: z.email('form_error_email'),
   message: z.string().trim().min(10, 'form_error_message'),
});

export type InquiryResult =
   | { kind: 'spam' }
   | { kind: 'invalid'; errors: Partial<Record<'name' | 'email' | 'message', string>>; values: Record<string, string> }
   | { kind: 'valid'; inquiry: { name: string; email: string; message: string } };

/**
 * Validate a contact submission: honeypot + minimum-time spam checks first,
 * then field validation.
 *
 * @param data - raw form data
 * @param now - injectable clock for tests (default Date.now())
 * @return spam (silently swallowed), invalid (field errors), or valid
 */
export function parseInquiry(data: FormData, now: number = Date.now()): InquiryResult {
   const honeypot = String(data.get('company') ?? ''),
         startedAt = Number(data.get('startedAt') ?? 0);

   if (honeypot !== '' || !Number.isFinite(startedAt) || now - startedAt < MIN_SUBMIT_MS) {
      return { kind: 'spam' };
   }

   const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
   };

   const parsed = inquirySchema.safeParse(values);

   if (!parsed.success) {
      const errors: Partial<Record<'name' | 'email' | 'message', string>> = {};

      for (const issue of parsed.error.issues) {
         const field = issue.path[0] as 'name' | 'email' | 'message';

         errors[field] = errors[field] ?? issue.message;
      }
      return { kind: 'invalid', errors, values };
   }

   return { kind: 'valid', inquiry: parsed.data };
}
```

(Error strings are message keys — the page maps them through paraglide so form errors localize.)

- [ ] **Step 4:** `npm test` → PASS.

- [ ] **Step 5: Action** — `src/routes/(site)/contact/+page.server.ts`:

```ts
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { parseInquiry } from '$lib/server/inquiry';
import { getSiteConfig } from '$lib/content/site';
import type { Actions } from './$types';

export const prerender = false;

export const actions: Actions = {
   default: async ({ request }) => {
      const result = parseInquiry(await request.formData());

      if (result.kind === 'spam') {
         return { sent: true }; // pretend success; never tip off bots
      }

      if (result.kind === 'invalid') {
         return fail(400, { errors: result.errors, values: result.values });
      }

      if (env.RESEND_API_KEY) {
         const resend = new Resend(env.RESEND_API_KEY);

         await resend.emails.send({
            from: 'workshop@andreimuntean.dev',
            to: getSiteConfig().email,
            replyTo: result.inquiry.email,
            subject: `Inquiry from ${result.inquiry.name}`,
            text: result.inquiry.message,
         });
      } else {
         console.warn('[contact] RESEND_API_KEY missing — inquiry logged only');
      }

      return { sent: true };
   },
};
```

- [ ] **Step 6: Page states** — `use:enhance` on the form; `$props()` gets `form`; render: field errors under inputs (mapped via `m[form.errors.email]()` pattern), submitting state on button (`disabled` + `m.form_submitting()` — add key), success block replacing form when `form?.sent` (`m.form_success_title()` + body), failure copy with email fallback if the action throws (SvelteKit `form` null + error page avoided via try/catch → return `fail(500, { failed: true })`; render `m.form_failure_body()`).

- [ ] **Step 7:** Verify: dev submit without key logs + shows success; `email: 'nope'` shows inline error; fill honeypot via devtools → success shown, nothing logged as valid. Commit — `feat: Add contact form action with honeypot and Resend delivery`

---

## Phase 6 — SEO, OG, machine-readable surfaces

### Task 15: Seo component + JSON-LD builders (TDD)

**Files:**
- Create: `src/lib/seo/meta.ts`, `src/lib/seo/Seo.svelte`
- Test: `src/lib/seo/meta.test.ts`
- Modify: every `(site)` page to mount `<Seo ... />`

**Interfaces:**
- Produces:
  - `SITE_URL = 'https://andreimuntean.dev'`
  - `pageTitle(title?: string): string` — `"X — Andrei Muntean"` or default full title
  - `canonicalUrl(localizedPath: string): string`
  - `alternates(unlocalizedPath: string): { hreflang: string; href: string }[]` (en, ro, x-default)
  - `jsonLdPerson(): object`, `jsonLdCreativeWork(project: ProjectMeta, url: string): object`, `jsonLdBreadcrumbs(items: { name: string; url: string }[]): object`
  - `ogImagePath(locale: Locale, pageId: string): string` → `/og/${locale}/${pageId}.png`
  - `Seo.svelte` props: `{ title?: string; description: string; pageId: string; jsonLd?: object[] }` — renders `<svelte:head>` title/meta/canonical/hreflang/og/twitter + JSON-LD scripts.

- [ ] **Step 1: Failing tests** for `pageTitle`, `alternates`, `ogImagePath`, `jsonLdCreativeWork` shape (`@type: 'CreativeWork'`, `name`, `url`, `dateCreated`). 
- [ ] **Step 2:** Implement `meta.ts` (pure functions; `alternates('/work')` → `[{ hreflang: 'en', href: 'https://andreimuntean.dev/work' }, { hreflang: 'ro', href: 'https://andreimuntean.dev/ro/work' }, { hreflang: 'x-default', href: '.../work' }]` via `localizeHref`).
- [ ] **Step 3:** `Seo.svelte` + mount on all pages (home `jsonLdPerson`, case studies `jsonLdCreativeWork` + `jsonLdBreadcrumbs`, about `jsonLdPerson`).
- [ ] **Step 4:** Tests pass; view-source shows tags. Commit — `feat: Add SEO component with canonical, hreflang and JSON-LD`

### Task 16: OG image generation

**Files:**
- Create: `scripts/convert-og-fonts.mjs`, `src/lib/server/og/fonts/Basteleur-Bold.ttf` + `ApfelGrotezk-Regular.ttf` (generated, committed), `src/lib/server/og/template.ts`, `src/lib/server/og/pages.ts`, `src/routes/og/[...page]/+server.ts`

**Interfaces:**
- Consumes: registry (`getFlagships`), messages titles.
- Produces: prerendered PNGs at `/og/{en|ro}/{home|work|process|about|contact|colophon}.png` and `/og/{locale}/work/{slug}.png`; `ogImagePath` (Task 15) already points at them.

- [ ] **Step 1: Font conversion script** (`wawoff2` — satori can't read woff2):

```js
// scripts/convert-og-fonts.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import wawoff2 from 'wawoff2';

const FONTS = [
   [ 'static/fonts/Basteleur-Bold.woff2', 'src/lib/server/og/fonts/Basteleur-Bold.ttf' ],
   [ 'static/fonts/ApfelGrotezk-Regular.woff2', 'src/lib/server/og/fonts/ApfelGrotezk-Regular.ttf' ],
];

await mkdir('src/lib/server/og/fonts', { recursive: true });

for (const [ src, dest ] of FONTS) {
   const ttf = await wawoff2.decompress(await readFile(src));

   await writeFile(dest, Buffer.from(ttf));
   console.log(`converted ${src} -> ${dest}`);
}
```

Run `node scripts/convert-og-fonts.mjs` once; commit the ttfs.

- [ ] **Step 2: `pages.ts`** — `ogEntries(): { page: string }[]` (static pages × locales + `work/<slug>` × locales from `getFlagshipSlugs()`), `ogDataFor(page: string): { title: string; summary: string }` (throws on unknown → 404 during prerender catches drift).

- [ ] **Step 3: Endpoint** — `src/routes/og/[...page]/+server.ts`:

```ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import { error } from '@sveltejs/kit';
import basteleurUrl from '$lib/server/og/fonts/Basteleur-Bold.ttf?url';
import apfelUrl from '$lib/server/og/fonts/ApfelGrotezk-Regular.ttf?url';
import { ogDataFor, ogEntries } from '$lib/server/og/pages';
import { ogTemplate } from '$lib/server/og/template';
import type { RequestHandler, EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
   return ogEntries();
};

export const GET: RequestHandler = async ({ params }) => {
   const page = params.page.replace(/\.png$/, ''),
         data = ogDataFor(page);

   if (!data) {
      error(404, 'No such OG page');
   }

   const [ basteleur, apfel ] = await Promise.all([
      read(basteleurUrl).arrayBuffer(),
      read(apfelUrl).arrayBuffer(),
   ]);

   const svg = await satori(ogTemplate(data), {
      width: 1200,
      height: 630,
      fonts: [
         { name: 'Basteleur', data: basteleur, weight: 700, style: 'normal' },
         { name: 'Apfel Grotezk', data: apfel, weight: 400, style: 'normal' },
      ],
   });

   const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

   return new Response(png, { headers: { 'content-type': 'image/png' } });
};
```

`template.ts` returns satori's object tree: umber `#1e1712` background div, copper `#c5854e` eyebrow, Basteleur title, Apfel summary, roundel SVG data-URI bottom-right. (Hex literals allowed here — satori objects aren't SCSS; note the token values in a comment referencing `_variables.scss`.)

- [ ] **Step 4:** `npm run build` → `.vercel/output` contains the PNGs; open one, sanity-check. Commit — `feat: Generate branded OG images at build for every page and locale`

### Task 17: llms.txt, sitemap.xml, robots.txt

**Files:**
- Create: `src/lib/server/llms.ts`, `src/routes/llms.txt/+server.ts`, `src/routes/sitemap.xml/+server.ts`, `src/routes/robots.txt/+server.ts`
- Test: `src/lib/server/llms.test.ts`

- [ ] **Step 1:** `buildLlmsTxt(flagships: ProjectMeta[]): string` — hand-authored header (who Andrei is, positioning line, links to /work /process /contact + resume PDF) + generated `## Projects` list (`- [Title](https://andreimuntean.dev/work/slug): summary`). Test asserts header line + one project line.
- [ ] **Step 2:** Endpoints, all `prerender = true`; sitemap lists every EN path + `/ro` mirror with `xhtml:link rel="alternate" hreflang` pairs (loop over static paths + flagship slugs); robots: `User-agent: *\nAllow: /\nSitemap: https://andreimuntean.dev/sitemap.xml`.
- [ ] **Step 3:** Build; check the three files in output. Commit — `feat: Add llms.txt, sitemap with hreflang pairs, and robots.txt`

---

## Phase 7 — Motion

### Task 18: System motion layer + three signature moments (v1 implementations)

**Files:**
- Create: `src/lib/motion/reveal.ts`, fill `src/styles/_motion.scss`
- Modify: hero (Task 9), `Stamp.svelte`, process timeline (Task 12)

**Interfaces:**
- Produces: `reveal` Svelte action — `use:reveal` / `use:reveal={{ delay: 120 }}` adds `.is-revealed`; CSS classes `.reveal`, `.is-revealed`, `.hero__headline--ink`, `.stamp--pressed`, `.timeline--drawn`.

- [ ] **Step 1: `reveal.ts`**

```ts
type RevealOptions = { delay?: number };

/**
 * Add `.is-revealed` when the node enters the viewport. Under reduced
 * motion (or no IntersectionObserver) the class applies immediately —
 * content is never hidden from anyone.
 */
export function reveal(node: HTMLElement, options: RevealOptions = {}): { destroy(): void } {
   const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   node.classList.add('reveal');

   if (reduced || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-revealed');
      return { destroy(): void {} };
   }

   const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
         if (entry.isIntersecting) {
            window.setTimeout(() => { node.classList.add('is-revealed'); }, options.delay ?? 0);
            observer.disconnect();
         }
      }
   }, { threshold: 0.2 });

   observer.observe(node);

   return {
      destroy(): void {
         observer.disconnect();
      },
   };
}
```

- [ ] **Step 2: `_motion.scss`** — tokens only:

```scss
@use '../variables' as *;

.reveal {
   opacity: 0;
   transform: translateY($space-3);
   transition: opacity $duration-interactive $ease-spring, transform $duration-interactive $ease-spring;

   &.is-revealed {
      opacity: 1;
      transform: none;
   }
}

@media (prefers-reduced-motion: reduce) {
   .reveal {
      opacity: 1;
      transform: none;
      transition: none;
   }
}
```

plus button/card hover rules (`scale(1.05)` primary, `translateY(-3px) scale(1.02)` card — per DESIGN.md), `.stamp` press-in keyframe (scale 1.4→1 + opacity, `$ease-spring`, triggered by `.is-revealed` via `use:reveal` on the stamp wrapper), hero ink-in (headline `clip-path: inset(0 0 100% 0)` → `inset(0)` on load, `@starting-style` or a mounted class), timeline draw (`.timeline` `::before` connector `scale-y` 0→1 staggered with step reveals). All wrapped in the same reduced-motion guard.

- [ ] **Step 3:** Apply `use:reveal` to home sections, work cards, case-study blocks, stamp, timeline. Verify with devtools reduced-motion emulation: everything instant + visible. Commit — `feat: Add motion system and v1 signature moments behind reduced-motion gates`

---

## Phase 8 — Design application (**GATED: Claude Design output required**)

### Task 19: Apply Claude Design's visual pass

Precondition: Andrei uploads `DESIGN.md` + `MOCKUP.md` to Claude Design, imports the produced designs back (screens or design-system export).

**Files:** modify `src/styles/**` and component markup as the designs dictate — no new logic.

- [ ] **Step 1:** Reconcile tokens — if the designs refine any value, update `_variables.scss` only (DESIGN.md stays authoritative; conflicts get flagged to Andrei, not silently absorbed).
- [ ] **Step 2:** Apply in MOCKUP §5 order: components first (nav incl. mobile menu + skip-link style, footer, buttons × states, availability, both card types × optional-field states, chips/tags, quote, maker's note, agent notes, form fields × states), then pages (home, work, both case-study variants, process, about, contact × states, colophon, 404).
- [ ] **Step 3:** Acceptance per page = MOCKUP checklist: every listed state exists; focus-visible styled; RO strings don't clip (`/ro` walkthrough); title morph reads correctly (card ↔ case study); reduced-motion still sane.
- [ ] **Step 4:** Refine the three signature moments to match designed treatments.
- [ ] **Step 5:** One commit per component-set/page group (`style: Apply atelier design to <scope>`), lint green throughout (tokens-only rule catches hex smuggling).

---

## Phase 9 — Quality bar, CI, deploy

### Task 20: Playwright suite + axe

**Files:**
- Create: `e2e/site.spec.ts`, `e2e/contact.spec.ts`, `e2e/a11y.spec.ts`
- Modify: `playwright.config.ts` (webServer: `npm run build && npm run preview`, port 4173)

- [ ] **Step 1: `site.spec.ts`** — nav flow (home → work → carheltau case study, expect `h1` contains "CarHeltau"), locale switch (`/work` → switcher → URL `/ro/work`, heading in RO), 404 (`/work/nope` shows not-found title), resume redirect (`request.get('/resume')` → 302 → pdf), llms.txt contains "Andrei".
- [ ] **Step 2: `contact.spec.ts`** — happy path (fill 3 fields, wait > spam window via `startedAt` override: set input value back 5s with `page.evaluate`, submit, success visible); invalid email → inline error; honeypot filled → still "success" (silent swallow).
- [ ] **Step 3: `a11y.spec.ts`**:

```ts
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
   '/', '/work', '/work/carheltau', '/process', '/about', '/contact', '/colophon',
   '/ro', '/ro/work', '/ro/work/carheltau', '/ro/process', '/ro/about', '/ro/contact', '/ro/colophon',
];

for (const route of ROUTES) {
   test(`axe: ${route}`, async ({ page }) => {
      await page.goto(route);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
   });
}
```

- [ ] **Step 4:** `npm run test:e2e` → all green locally. Commit — `test: Add e2e coverage for flows, form paths, locales and axe a11y`

### Task 21: GitHub Actions CI + Lighthouse budgets

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`

- [ ] **Step 1: `lighthouserc.json`**

```json
{
   "ci": {
      "collect": {
         "startServerCommand": "npm run preview",
         "startServerReadyPattern": "Local",
         "url": [
            "http://localhost:4173/",
            "http://localhost:4173/work",
            "http://localhost:4173/work/carheltau",
            "http://localhost:4173/ro"
         ],
         "numberOfRuns": 1
      },
      "assert": {
         "assertions": {
            "categories:performance": [ "error", { "minScore": 0.95 } ],
            "categories:accessibility": [ "error", { "minScore": 0.95 } ],
            "categories:seo": [ "error", { "minScore": 0.95 } ],
            "cumulative-layout-shift": [ "error", { "maxNumericValue": 0.05 } ],
            "largest-contentful-paint": [ "warn", { "maxNumericValue": 1500 } ],
            "resource-summary:script:size": [ "error", { "maxNumericValue": 61440 } ]
         }
      }
   }
}
```

- [ ] **Step 2: `.github/workflows/ci.yml`**

```yaml
name: CI

on:
   push:
      branches: [ main ]
   pull_request:

jobs:
   verify:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
              node-version: 22
              cache: npm
         - run: npm ci
         - run: npm run check
         - run: npm run lint
         - run: npm test
         - run: npm run build
         - run: npx playwright install --with-deps chromium
         - run: npm run test:e2e
         - run: npx lhci autorun
```

- [ ] **Step 3:** Push a branch, confirm the workflow passes end to end. Commit — `ci: Add GitHub Actions pipeline with Lighthouse budget enforcement`

### Task 22: Vercel wiring + launch checklist

- [ ] **Step 1:** Vercel project: framework SvelteKit, Node 22; env var `RESEND_API_KEY` (production + preview); Analytics enabled in dashboard (code from Task 8 already injects).
- [ ] **Step 2:** Deploy preview; run through: both locales, form (real Resend send to `contact@andreimuntean.dev`), OG image URLs in a share debugger, `/resume` + `/cv`, llms.txt, sitemap.
- [ ] **Step 3:** Andrei's DNS task (outside repo): point old `cv.` / `resume.` subdomains at `/cv` and `/resume` once live.
- [ ] **Step 4:** Do **not** promote to production until Task 19 (design) is applied and Andrei signs off — old prod site keeps running meanwhile (main is unpushed until then).

---

## Self-review (done at plan-writing time)

- **Spec coverage:** §1 voice → CLAUDE.md (T1); §3 form/availability → T5/T8/T14; §4 routes → T8–T13, T16–T17 (llms/sitemap/robots/og); §5 page blocks → T9–T12 + T19 states; §6 content model → T4–T6; §7 agentic workflow → T1; §8 i18n → T7 (+ pair validation T4); §9 architecture → T2–T3, T8, T11, T13–T14; §10 motion → T18 (+T8 transitions); §11 future-proofing → `(site)` group T8; §12 CI → T20–T21; §13 standards → T1–T2 (skills + lint config); §14 SEO → T15–T17; §15 inputs → placeholders flagged in T5/T13; §16 pipeline → design gate T19.
- **Placeholders:** seed copy and PDFs are *deliberate* placeholders per SPEC §15 (content pass), flagged as such — no plan-level TBDs remain.
- **Type consistency:** `Locale`/`ProjectMeta` defined once in `projects.ts`, consumed by T7/T9–T11/T15–T16; `parseInquiry` result union matches T14 page usage; `reveal` signature matches usages in T18.
