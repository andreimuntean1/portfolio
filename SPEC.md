# SPEC — andreimuntean.dev revamp ("The Atelier")

Everything known about this project at this stage. Companion documents:
`DESIGN.md` (visual system, already extracted from Claude Design direction 1c),
`MOCKUP.md` (design brief for Claude Design — produced after this spec is
approved), `PLAN.md` (implementation plan — produced after this spec is
approved).

---

## 1. Positioning

**Andrei Muntean — AI-native full-stack engineer who ships like a workshop:
machine speed, human standards.**

The site's job is to convert **freelance clients first** (founders, product
owners deciding whether to hire Andrei for a build), employers second. The
AI-native story is told at **identity level**: the hero names it, a dedicated
process page shows the agentic rig, and case studies carry agent-notes — but
credibility always comes from craft evidence (tests, docs, handovers,
outcomes), never from the label alone.

Brand metaphor: *the atelier / workshop*. Projects are work that left the
bench. Copy is warm, precise, first-person. Numbers over adjectives.

### Voice rules

- First person, plain sentences, no hype vocabulary ("passionate",
  "cutting-edge", "blazing" are banned).
- Maker's notes: lowercase asides in Fragment Mono italic, prefixed `n.b. —`.
- Every claim about AI leverage is paired with the guardrail that makes it
  safe (e.g. "agents wrote the migration; the test suite gated the merge").
- Outcomes stated as numbers wherever a number exists.

## 2. Goals / non-goals

**Goals**

1. Convert client visits into inquiries (form submissions).
2. Prove the AI-native + craft positioning with evidence, not claims.
3. Case studies as first-class citizens — each flagship project gets its own
   page telling the story of the build.
4. Content updates (projects, case studies, availability) doable by an agent
   editing markdown in one folder, schema-validated at build.
5. Fast (perf budgets in §12), animated (motion system in §10), bilingual
   (EN + RO, §8).
6. Architecture leaves room for future personal features (trips, login) on
   separate routes without a rewrite.

**Non-goals (v1)**

- No blog, no /now page, no RSS.
- No CMS UI (Claude Code + git is the CMS).
- No light/dark toggle — the site is the umber dark theme; the resume PDFs
  are the only "paper" surfaces.
- No comments, no newsletter, no auth, no trips — accounted for in
  architecture (§11), not built.

## 3. Audiences & conversion

| Audience | Priority | What they need | Primary CTA |
|---|---|---|---|
| Freelance clients (founders/PMs, RO + international) | 1 | Outcomes, trust, process clarity, availability | Inquiry form on /contact |
| Employers / senior engineers | 2 | Judgment, decisions, code quality, method depth | Same form (or email), case-study depth |
| Agents / AI crawlers | 3 | Machine-readable summary of who Andrei is | llms.txt |

Conversion mechanics:

- **Inquiry form** (the only dynamic feature in v1): 3 fields — name, email,
  "what are we building?" (textarea). Spam defense: honeypot field +
  minimum-time-to-submit check (no CAPTCHA in v1; escalate to Turnstile only
  if spam actually appears). Delivery: Resend → contact@andreimuntean.dev.
  Nothing stored server-side.
- **Availability line** — a config value (e.g. "2 slots open · Q4 2026")
  surfaced in hero, contact page, and footer. Agent-updatable.
- Every flagship case study ends with a contextual CTA linking to /contact.

## 4. Information architecture

EN is the default locale at `/`; RO mirrors it under `/ro` with identical
path segments (no translated slugs — simpler for agents and redirects;
hreflang handles SEO).

| Route | Purpose |
|---|---|
| `/` | Home — hero, 3–4 featured flagships, process strip, availability, CTA |
| `/work` | Full index — flagship cards + workshop-entry cards |
| `/work/[slug]` | Flagship case-study page (workshop entries have **no** page) |
| `/process` | "How I work" — engagement flow + the agentic rig as its engine |
| `/about` | Deep about — path, values, photo, the human behind the bench |
| `/contact` | Inquiry form + email + availability + "vorbesc română" note (EN side) |
| `/colophon` | How this site is made: stack, fonts + OFL attribution (required by license), agentic build story, source link |
| `/resume` | Redirect → `/files/resume-en.pdf` (placeholder PDF until provided) |
| `/cv` | Redirect → `/files/cv-ro.pdf` (placeholder PDF until provided) |
| `/ro/...` | RO mirror of every content route above (resume/cv redirects shared) |
| `404` | On-brand "lost in the workshop" page, links home |
| `/llms.txt` | Hand-authored header + build-generated project list |
| `/sitemap.xml`, `/robots.txt` | Standard; sitemap covers both locales with hreflang |
| `/og/[...slug].png` | Build-generated OG images (§13) |

**Nav:** wordmark (home) · Work · Process · About · Contact · language
switcher (EN/RO). **Footer:** wordmark, availability line, email, LinkedIn,
GitHub, colophon link, font credits shorthand.

Old-site migration: previous site was a one-pager with anchors — no legacy
redirects needed. The old `cv.` / `resume.` subdomains should eventually
point to `/cv` and `/resume` (DNS task, outside this repo).

## 5. Page specifications

### Home `/`
1. **Hero** — eyebrow in Fragment Mono ("from the workshop of Andrei
   Muntean"), Basteleur headline carrying the positioning (draft: *"Made with
   care, shipped with agents."*), one support sentence, availability line,
   primary CTA (contact) + secondary (see work). Signature motion moment #1
   (wordmark ink-in).
2. **Featured work** — 3–4 flagship cards (title, one-line outcome, metric
   chip if present, stack tags, status stamp mini). Order controlled by
   `featured` field.
3. **Process strip** — 3–4 step condensation of /process (discovery → build
   → handover), each step one line, link to /process.
4. **Trust band** — 1–2 client quotes (from case-study frontmatter).
5. **Contact teaser** — availability + form link.

### Work index `/work`
- Flagship section: large cards → case-study pages.
- Workshop entries section: compact cards (title, year, one paragraph,
  stack, links, status — `retired` shown honestly). No detail pages.
- Optional ledger touch: entry numbering (`№ 001`…) — final call belongs to
  Claude Design via MOCKUP.md.

### Case study `/work/[slug]` (flagships only)
Template blocks, in order — blocks marked *(opt)* render only when the
frontmatter/content provides them:

1. **Spec-sheet header** — client, year, role, stack, timeline *(opt)*,
   status, links (demo/GitHub/Figma).
2. **Outcome banner** *(opt)* — up to 3 metrics.
3. **Brief / scene** — who the client is, the problem, the stakes.
4. **Constraints** — budget, timeline, tech, content realities.
5. **Approach & decisions** — what was chosen and *what was rejected and
   why*. The judgment section.
6. **Agent notes** *(opt but expected on recent work)* — structured block:
   what agents did / what Andrei decided / what verified it (tests, review,
   staging). The AI-native proof block.
7. **Gallery / artifacts** *(opt)* — screenshots, Figma frames, diagrams.
8. **Maker's notes** — margin asides (Fragment Mono italic) sprinkled
   through body sections, not a section of their own.
9. **Quote** *(opt)* — client testimonial.
10. **Reflection** — what I'd do differently.
11. **Footer** — SHIPPED stamp (signature motion moment #2) + contextual
    CTA to /contact.

### Process `/process`
1. Positioning restatement for buyers: what an engagement looks like.
2. **Engagement flow** — discovery → proposal → build (weekly demos) →
   handover (docs, tests, training). Signature motion moment #3 (timeline
   draws itself).
3. **The rig** — how the atelier actually runs: Claude Code, skills/hooks,
   CLAUDE.md conventions, review discipline, CI gates. Framed as *why
   clients get speed without slop*.
4. **Guarantees** — what every project ships with (repo ownership, docs,
   tests, no mystery boxes).
5. CTA.

### About `/about`
Path (self-taught, Bucharest, started 2021), values, what "craft" means
here, photo (new treatment per design), off-screen life paragraph, links to
resume/cv PDFs, CTA.

### Contact `/contact`
Form (3 fields + honeypot), direct email fallback, availability,
response-time expectation, "vorbesc română" note on EN locale (RO locale
notes English is fine too). Success and error states specified in MOCKUP.md.

### Colophon `/colophon`
Stack, fonts with full OFL attribution (Velvetyne — Basteleur; Collletttivo
— Apfel Grotezk; Wei Huang — Fragment Mono), "built with the same rig it
describes" story, link to public repo, analytics disclosure.

## 6. Content model

All content lives in `/content`, schema-validated at build — **the build
fails on malformed frontmatter**, which is the agent-proofing contract.

```
content/
  projects/
    carheltau/
      en.mdx        # EN case study / entry copy
      ro.mdx        # RO mirror
      assets/       # screenshots, exports (co-located)
  site/
    config.json     # availability {en, ro}, email, socials, response time
    home.{en,ro}.md # hero + section copy
    process.{en,ro}.mdx
    about.{en,ro}.mdx
    colophon.{en,ro}.md
```

### Project frontmatter schema (zod, shared EN/RO)

```
title          string
summary        string            # one-liner used on cards
tier           'flagship' | 'entry'
status         'shipped' | 'in-workshop' | 'retired'
year           number
client         string?           # omit for personal projects
role           string
stack          string[]
links          { demo?, github?, figma? }
timeline       string?           # "6 weeks"
metrics        { label, value }[]?    # max 3 surfaced
quote          { text, author, role? }?
featured       number?           # home ordering; absence = not featured
entryNo        number?           # ledger number, stable once assigned
draft          boolean?          # draft ⇒ excluded from build output
```

Cross-locale validator: `en.mdx` and `ro.mdx` of the same project must agree
on `tier`, `status`, `year`, `links`, `metrics` values, `featured`,
`entryNo` — mismatch fails the build. Copy fields (title/summary/body) are
free per locale.

### MDX components available in case-study bodies

`<MakerNote>` (margin aside), `<AgentNotes did= decided= verified=>`,
`<Metrics>`, `<Quote>`, `<Figure src caption>`, `<Stamp>`, standard
headings/prose. mdsvex layout injects the spec-sheet header and footer from
frontmatter automatically — body files contain only the story.

### Initial content set (proposal — confirm/amend at content pass)

| Project | Tier | Status | Notes |
|---|---|---|---|
| CarHeltau | flagship | shipped | payments, PDF contracts, metrics-able |
| Cursed Vision Films | flagship | shipped | perf-rescue story, before/after numbers |
| Wedding website | flagship | shipped | personal charm, real users, Figma + code |
| Fota Industrial | entry | shipped | custom CMS, SEO |
| Priv | entry | shipped | Flutter + Supabase, GitHub only |
| Photography Portfolio | entry | in-workshop | working title; personal project, agent-built CMS — coming soon |
| bioRO | entry | retired | product + Figma + code; no longer maintained |
| Leida | entry | retired | honest labeling |

Atlis dropped from the set entirely (replaced by the Photography Portfolio
entry). bioRO demoted from flagship to a retired entry — no case-study page,
compact card only. Flagship count is now 3 (CarHeltau, Cursed Vision,
Wedding), still inside the "3–4" range the home page spec (§5) allows.

## 7. Agentic content workflow

A repo-root `CLAUDE.md` (written during implementation) documents:

- How to add/edit a project: create folder, write `en.mdx`, translate to
  `ro.mdx`, run build to validate, commit.
- **EN is the source of truth**; RO is derived by agent translation and
  human-reviewed by Andrei (native speaker) before merge.
- How to update availability (one JSON field, both locales).
- Voice rules (§1) so agent-written copy stays on-brand.
- The frontmatter schema and the cross-locale consistency contract.
- Links to the two code-style skills (§13.5) for TS/Svelte/SCSS conventions
  and commit-message conventions — load before writing code or committing.

`llms.txt`: hand-authored identity header + links, plus a build-generated
section listing flagships with one-line summaries. This is part of the
positioning — the AI-native engineer's site is itself agent-readable.

## 8. Internationalization

- Locales: `en` (default, unprefixed), `ro` (prefixed `/ro`).
- UI strings: **Paraglide JS (inlang)** — compile-time, type-safe messages,
  SvelteKit adapter handles locale routing and `<html lang>`.
- Content: per-locale files as in §6. **Publishing a project requires both
  locales** (draft state may be EN-only).
- Language switcher swaps to the same path in the other locale.
- `hreflang` alternates on every page; sitemap lists both.
- Resume PDFs sit outside i18n: `/resume` (EN PDF) and `/cv` (RO PDF) exist
  identically from both locales; labels differ per locale ("Resume" / "CV").

## 9. Tech architecture

- **SvelteKit 2 + Svelte 5 (runes)**, TypeScript, deployed on **Vercel**
  (`@sveltejs/adapter-vercel`).
- **Rendering:** everything prerendered (static) except the `/contact` form
  action (server function). ISR not needed — content changes ship via git.
- **Content pipeline:** mdsvex for MDX; a build-time loader
  (`import.meta.glob`) parses frontmatter through the zod schemas in §6 and
  runs the cross-locale validator. Unit-tested.
- **Styling:** SCSS, building on `styles/_variables.scss` (existing tokens).
  Global `atelier-font-faces` mixin; component styles consume tokens only —
  no hard-coded values.
- **Routing structure:** `src/routes/(site)/...` for everything in this
  spec. Future personal features (trips, auth) get sibling groups —
  `(app)/`, `(auth)/` — with their own layouts; the boundary exists from day
  one so v2 features never touch (site) layouts.
- **Form:** SvelteKit form action, progressive enhancement (works without
  JS), Resend for delivery (`RESEND_API_KEY` env), honeypot + min-time
  check.
- **Page transitions:** `onNavigate` + `document.startViewTransition` —
  native view transitions where supported (Chromium, Safari), instant
  navigation as the fallback (Firefox). Shared-element transition on
  card → case-study title.
- **Images:** `@sveltejs/enhanced-img` for content images (AVIF/WebP,
  responsive sizes). Font files preloaded (2 critical faces max on first
  paint).
- **Fonts/marks:** existing `/assets` moved into the app's static/lib
  structure at implementation; wordmark/roundel/stamp SVGs inlined where
  animated.

## 10. Motion system

Per DESIGN.md tokens (`$ease-spring`, 320ms) with two layers:

**System layer (everywhere):** spring hovers (buttons scale 1.05, cards
translateY(-3px)), scroll-reveal for section content (short fade/rise,
staggered), view transitions between pages, focus-visible states.

**Signature moments (exactly three in v1):**
1. Home hero — wordmark/headline ink-in on load.
2. Case-study footer — SHIPPED stamp presses in when scrolled into view
   (asset exists: `shipping-stamp.svg`).
3. Process page — engagement timeline draws itself on scroll.

`prefers-reduced-motion`: all of the above collapse to instant, opacity-only
states. This is a hard requirement, not a nice-to-have.

## 11. Future-proofing (accounted, not built)

- Route groups reserved for `(app)` features: trips/highlights, login, any
  authed personal tools. Separate layout tree, shared token system.
- Auth choice deferred to v2 (SvelteKit keeps all options open).
- Content model extensible: new collections (e.g. `content/trips/`) follow
  the same schema-validated pattern.
- The inquiry form's server function establishes the serverless pattern any
  future dynamic feature will reuse.

## 12. Quality bar & CI

The repo itself is evidence for the positioning — it must look the way the
site claims Andrei works.

- **CI (GitHub Actions):** typecheck (`svelte-check`), lint (ESLint +
  Prettier), unit tests (Vitest — content loader/validators), E2E smoke
  (Playwright: nav flows, form submit happy + spam paths, locale switch,
  404), accessibility (axe checks on every route in the smoke run).
- **Perf budgets (CI-enforced via Lighthouse CI on preview deploys):**
  Performance ≥ 95, A11y ≥ 95, SEO ≥ 95; LCP < 1.5s on Fast-4G profile;
  CLS < 0.05; per-page JS < 60KB gzipped.
- Vercel preview deployments per PR.

## 13. Code style & conventions

Adopted from [Silvermine's coding standards](https://github.com/silvermine/silvermine-info/blob/master/coding-standards.md)
([TypeScript addendum](https://github.com/silvermine/silvermine-info/blob/master/coding-standards/typescript.md),
[commit-history rules](https://github.com/silvermine/silvermine-info/blob/master/commit-history.md)),
adapted to this stack. This section states *what* the rules are; the
enforceable, agent-loaded version of each rule lives in two project skills
(§13.5) so this document stays a spec, not a style guide.

### 13.1 TypeScript & JavaScript

Adopted in full from the TypeScript standard:

- `const` by default, `let` when reassigned, never `var`. Consecutive
  single-line declarations grouped in one statement; multi-line `const`
  blocks always get their own statement.
- Template literals only where they read better than concatenation; never
  multi-line, never used solely to stringify (`String(x)`, not `` `${x}` ``).
- `async`/`await` preferred over `.then()` chains — but independent awaits
  must run concurrently via `Promise.all`, never accidentally serialized.
- Destructuring: basic object/array and array-with-rest are fine;
  object-rest (`{ a, ...rest }`) and deep/nested destructuring are **banned**
  (silent breakage risk); renaming while destructuring is fine.
- Rest params encouraged over `arguments`; spread encouraged.
- Arrow functions: parentheses always around params, space before/after
  `=>`, **no implicit returns** (always braces + explicit `return`),
  **never as class fields** (breaks `super`, hides `this` binding).
- `??` is the default fallback operator; `||` only when any falsy value
  should trigger the fallback (documented per use).
- Error handling by `instanceof`, not string-matching `err.code`/`err.message`.
- No implicit `any`. Exported/returned values require **explicit** types
  (API-surface clarity). Never `Number`/`String`/`Boolean`/`Object` — always
  the lowercase primitive type. One space after `:` in type annotations,
  none before.
- Constructor parameter properties allowed only for `private` members.

Relevant subset adopted from the general standard (PHP-era and
DB-layer-specific rules dropped as inapplicable — see note below):

- Naming: `camelCase` instance members, `UPPER_SNAKE_CASE` constants,
  `_camelCase` for private/protected, `PascalCase` classes (nouns),
  `kebab-case` filenames — **except** files exporting a class or a Svelte
  component, which use `PascalCase` (`MyClass.ts`, `ProjectCard.svelte`) per
  that rule's own class-file exception and Svelte ecosystem convention.
- Acronyms in names are all-caps (`API`, `LDAP`) except when they'd be the
  leading segment of a camelCase identifier (`apiConfig`, not `APIConfig`);
  `ID` is always capitalized.
- Formatting: 3-space indentation, no tabs, opening brace on the statement
  line, **braces always required** even for single-line
  conditionals/loops, one blank line between unrelated statements, dangling
  commas in multi-line arrays/objects, files end with a single trailing
  newline.
- Functions: name describes what they return or the verb+noun of what they
  do (`getX`, `listX` for a collection, `isX` for booleans); avoid deep
  nesting — return/break early on error conditions; never commit
  commented-out code (git history is the record).
- Doc comments: TSDoc-style header with description + `@param` per
  parameter + `@return` (types omitted from the doc comment since
  TypeScript already declares them in the signature).
- Sanitize/validate anything from user input (the contact form, §3) before
  use — never trust it implicitly.

**Dropped as inapplicable:** `snake_case` statics and PHP array literal
syntax (legacy PHP-era conventions with no TypeScript/Svelte equivalent in
this codebase).

### 13.2 Commit messages & git history

From [commit-history.md](https://github.com/silvermine/silvermine-info/blob/master/commit-history.md),
adopted in full except where the global CLAUDE.md rule (no Claude
attribution trailers) takes precedence — that rule always wins.

- One commit = one logical change. Never mix unrelated changes in a commit.
- No "fix review comments" commits — rebase and fix the actual commit,
  using `git commit --fixup=<sha>` + `git rebase -i --autosquash` off the
  merge-base (`git merge-base origin/main HEAD`), never off `main`'s tip
  unless there's a conflict.
- Message format: `type: Subject line (#issue)` — types: `feat`, `fix`,
  `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`, `sub(type)`. Header ≤ 72 chars; body wrapped at 90 chars,
  explaining **why**, not how (the diff already shows how). Issue-number
  suffix only once GitHub issues exist for this repo — omit it until then.
- Body uses markdown (space before list markers) when listing multiple
  things.

### 13.3 SCSS / CSS architecture

Built on the existing `styles/_variables.scss` tokens, layered
[ITCSS](https://namastedev.com/blog/modern-css-architecture-bem-itcss-and-beyond/)-style
so specificity only ever increases moving down the file order:

```
styles/
  _variables.scss   # settings — tokens only (exists)
  _mixins.scss      # tools — atelier-font-faces + future mixins/functions
  _reset.scss       # generic — minimal reset
  _base.scss        # base — bare element defaults (type, links)
  components/       # one component per partial, e.g. _card.scss, _button.scss
  _utilities.scss   # single-purpose helpers, used sparingly
```

- **[BEM](https://www.valoremreply.com/resources/insights/guide/bem-methodology-a-step-by-step-guide-for-beginners/)**
  for component class names: `.card`, `.card__title`, `.card--featured`. No
  ID selectors for styling. No bare-element selectors outside `_base.scss`.
  Max nesting depth: 3.
- **Tokens only** — no hard-coded colors, sizes, easings, or font stacks in
  component partials; everything traces back to `_variables.scss`. (Same
  rule DESIGN.md already states; restated here because it's now
  lint-enforced, not just documented.)
- Enforced by **stylelint** (`stylelint-config-standard-scss` +
  `stylelint-order`), added to the lint step in CI (§12).

### 13.4 Svelte & SvelteKit conventions

Sourced from the current official docs ([svelte.dev/docs](https://svelte.dev/docs)),
not older tutorials — Svelte 5 changed enough that pre-runes patterns are
actively wrong:

- **Runes only** in new code: `$state`, `$derived`, `$effect`, `$props`,
  `$bindable`. No legacy `export let` / stores for new component-local
  state.
- Cross-component shared state uses a plain TypeScript class with
  **field-level** `$state` (wrapping a class instance in
  `$state(new X())` does *not* make its internal fields reactive — each
  field needs its own rune) — this is the Svelte-5 replacement for the old
  store pattern.
- `$derived` for anything computable from other state; `$effect` reserved
  for actual side effects (DOM/network/subscriptions), never used to
  "derive" a value.
- Props are explicitly typed:
  `let { title, tier }: { title: string; tier: Tier } = $props();`
- Snippets preferred over slots for reusable markup chunks.
- Server `load` functions and form actions typed via the generated
  `./$types` — never hand-rolled types for route data.
- **AI tooling**: install the official
  [Svelte MCP server](https://svelte.dev/docs/ai/overview) (`@sveltejs/mcp`)
  locally so agent-generated Svelte/SvelteKit code is checked against live
  docs and static analysis for common generative-AI mistakes, alongside the
  editor rules Svelte publishes for Claude Code. `CLAUDE.md` (§7) points
  agents at `svelte.dev/docs/ai` before writing any `.svelte` file.

### 13.5 Enforcement & skills

Quick token math on where these rules should live: the curated ruleset
above (§13.1–13.4) runs several thousand tokens once you include the code
examples that make rules like "banned destructuring patterns" or "`??` vs
`||`" unambiguous. `SPEC.md` gets read in full on every planning/design
pass — it already happened twice in one afternoon — so permanently inlining
that many tokens into the spec is paid on every read, including all the
reads that have nothing to do with writing code. A Claude Code skill is
loaded lazily, only when its description matches the task at hand — i.e.
paid exactly at the moments the rules are useful (writing a
`.ts`/`.svelte`/`.scss` file, making a commit), and never otherwise. For a
repo that will see many more "write code" and "make a commit" events than
"reread the spec" events, that's a clear win, so the enforceable versions
move to skills:

- `.claude/skills/code-style/SKILL.md` — §13.1, §13.3, §13.4 (triggers on
  writing TS/Svelte/SCSS in this repo).
- `.claude/skills/commit-style/SKILL.md` — §13.2 (triggers before creating
  a commit in this repo).

Both are created during implementation (PLAN.md), not part of this spec,
and both are linked from the repo's `CLAUDE.md` (§7). ESLint/Prettier/
stylelint/svelte-check in CI (§12) are the automated backstop for the same
rules — skills guide the agent while writing; linting catches anything that
slips through.

---

## 14. SEO, metadata, analytics

- Per-page titles/descriptions from content frontmatter; canonical URLs;
  hreflang pairs.
- **JSON-LD:** `Person` (home/about), `CreativeWork` per flagship,
  `BreadcrumbList` on case studies.
- **OG images:** build-generated per page (satori + resvg, using the local
  Basteleur/Apfel woff2s) — umber background, Basteleur title, copper
  accents, roundel mark. One template, per-page title/summary.
- **Analytics:** Vercel Analytics (zero-config, cookieless). Disclosed in
  colophon. Swappable for Plausible later if wanted.

## 15. Inputs required from Andrei (not blocking build start)

1. Resume PDFs — EN + RO (placeholders ship until then).
2. Profile photo (new treatment direction comes from Claude Design).
3. Per-flagship: metrics, client quotes (ask CarHeltau/Cursed Vision/Fota
   this month), screenshots/Figma exports, agent-workflow anecdotes where
   they exist.
4. RO review of all agent-translated copy.
5. Confirmation of flagship set (§6 table) at content pass.

## 16. Delivery pipeline

1. ~~SPEC.md~~ (this document) → **Andrei approves**.
2. `MOCKUP.md` — full design brief (every page, every block, every state,
   asset usage, motion notes) → uploaded manually to Claude Design along
   with `DESIGN.md`.
3. `PLAN.md` — step-by-step implementation plan with review checkpoints.
4. Claude Design produces page designs → build proceeds per PLAN.md against
   those designs.

### Stack decision record

SvelteKit over Astro: chosen for the unified app model (future login/trips
are first-class routes, not bolted on), native form actions for the inquiry
form, first-class transition/motion control, and existing Svelte fluency.
Astro's built-in content collections were the counter-argument; equivalent
agent-proofing is achieved with the zod build validator (§6). Next.js
rejected: heaviest payload, no unique advantage here. Key references:
[framework comparison](https://dev.to/pockit_tools/nextjs-vs-remix-vs-astro-vs-sveltekit-in-2026-the-definitive-framework-decision-guide-lp5),
[Astro vs SvelteKit](https://www.pkgpulse.com/guides/astro-vs-sveltekit-2026),
[view transitions support](https://events-3bg.pages.dev/jotter/in-all-major-browsers/),
[Keystatic review — rejected as dependency](https://www.luckymedia.dev/insights/keystatic).
