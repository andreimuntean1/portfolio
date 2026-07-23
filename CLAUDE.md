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
