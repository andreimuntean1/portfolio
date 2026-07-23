# MOCKUP — design brief for Claude Design ("The Atelier")

This is the content/structure/states brief for designing every page of the
andreimuntean.dev revamp. Upload this **together with `DESIGN.md`**:

- **`DESIGN.md`** is the visual language — palette, type, shape, motion
  tokens, the mark assets. It wins on any *value* (a color, a radius, a
  weight).
- **This document** is what to design — every page, every block in order,
  every state, real (or clearly-flagged placeholder) copy, and the open
  decisions left to you. It wins on *structure and content*.

Direction: **1c, "The Atelier."** Stay unique and handcrafted — warm umber/
copper, visible-hand serif, round grotesque body, no purple, no gradients,
no Inter.

---

## 0. What this site is for

Andrei Muntean, AI-native full-stack engineer, workshop metaphor. The site's
job is to **convert freelance clients** (founders/product owners deciding
whether to hire him) — employers are a secondary audience. The AI-native
angle is named up front (not hidden, not oversold) and backed everywhere by
craft evidence: tests, docs, handovers, real numbers. Full positioning is in
`SPEC.md` §1 if you want the long version; you shouldn't need it — this
document already carries what's relevant to layout and tone.

---

## 1. Global elements

Design these once as a component set; every page reuses them.

### 1.1 Navigation

Persistent top nav. Left: wordmark (`assets/marks/wordmark.svg`, links
home). Right: **Work · Process · About · Contact**, then a language
switcher (**EN/RO**, small, low-emphasis — a toggle or two-letter pair, your
call). Mobile: collapses to a disclosure menu (hamburger or similar) —
design both the closed and open state.

States to design: default, scrolled (old site darkened/blurred the nav on
scroll — decide if this direction wants that same treatment or something
quieter), active-route (current page's nav link visually distinct), hover,
focus-visible (keyboard focus ring — accessibility requirement, must be
visible, on-brand, not a generic blue outline). The language switcher needs
a clear current-locale state.

Also needed: a **skip-to-content link** — visually hidden until keyboard
focus, then visible as the very first focusable element. Accessibility is a
CI-enforced requirement on this project, so this element must actually be
designed (on-brand pill/tab that drops in at the top), not left as browser
default.

### 1.2 Footer

Wordmark, **availability line** (see 1.4), email (`contact@andreimuntean.dev`),
LinkedIn + GitHub icons, colophon link, a short font-credit line (e.g. "Set
in Basteleur, Apfel Grotezk & Fragment Mono — full credits →"). Single
column on mobile, multi-column or single row on desktop — your call.

### 1.3 Buttons

Two variants, both already speced in `DESIGN.md` §Motion — design their
rest, hover, focus-visible, and disabled states:

- **Primary** (pill, copper fill, umber text) — "Get in touch" style CTAs.
- **Secondary** (pill or rounded-rect outline, copper border) — "See work,"
  "Read the case study" style.

A **link-style** CTA (underline, no button chrome) is also needed for
in-body links inside case studies and process copy.

### 1.4 Availability component

A short status line appearing in three places (hero, /contact, footer):
placeholder copy **"2 slots open · Q4 2026"** (illustrative — real value is
config-driven and will change). Needs a design for: open (slots available),
and full/waitlist (e.g. "Booked through Q4 — new inquiries join a
waitlist"). A small live-status feel (dot, pulse, whatever reads as "current"
without looking like a stock-ticker) would fit the workshop-ledger tone;
your call on treatment.

### 1.5 Cards

Two card types, both need default + hover states:

- **Flagship card** (large): title, one-line outcome/summary, up to 3
  metric chips *(optional — some flagships won't have metrics yet)*, stack
  tags, a status stamp/mini-badge. Used on Home and /work.
  - **Motion note:** the card's title morphs into the case-study page
    title via a shared-element page transition. Keep the two title
    treatments visually continuous (same face and weight, compatible
    scale) so the morph reads as one object traveling, not two swapping.
- **Entry card** (compact): title, year, one paragraph, stack tags, status
  label, links (demo/GitHub/Figma — 0 to 3 of these, optional each). Used
  only on /work. **Retired projects must look honestly labeled** — not
  hidden, not apologized for, just clearly marked (e.g. a muted "retired"
  tag), consistent with the workshop-ledger honesty the brand voice
  commits to.

See §4 (Content variety) for the real project list both card types must
accommodate, including title lengths and which optional fields are present
or absent per project — design against that range, not just one ideal case.

### 1.6 Small components

- **Status chip** — three values: `shipped`, `in-workshop`, `retired`.
  Each needs a distinct look (color/weight/icon), but all three must read
  as "part of the same system," not three unrelated badge designs.
- **Metric chip** — a label + value pair (e.g. "Load time" / "1.2s").
  *All metric numbers you see below are illustrative placeholders* —
  the layout must work whether a project has 0, 1, 2, or 3 metrics.
- **Stack tag** — a single small pill/label per technology (e.g. "React,"
  "TypeScript," "Flutter").
- **Quote block** — client testimonial: quote text, author name, author
  role/company *(role optional)*.
- **Maker's note** — a lowercase margin aside in Fragment Mono italic,
  prefixed `n.b. —` (e.g. *n.b. — client renewed twice.*). Appears inline
  within case-study prose, not boxed off as a separate section — should
  read like a handwritten margin comment, not a callout card.
- **Agent notes block** — a structured 3-part block: **what agents did**
  / **what I decided** / **what verified it** (tests, review, staging).
  This is the single most important component for the AI-native story —
  it needs to read as credible engineering process, not a marketing badge.
  Needs a clear visual identity distinct from the maker's note (this is a
  block, not a margin aside).
- **Shipping stamp** — `assets/marks/shipping-stamp.svg`, appears at the
  foot of every case study, -4° rotation baked into the asset already.

### 1.7 Form fields

For the /contact form (§3.6): text input, email input, textarea, submit
button. States: default, focus, filled, error (with inline error copy
below the field, not just a red border), disabled/submitting. Design a
single reusable "field" pattern.

### 1.8 Responsive breakpoints

No breakpoints exist yet in the new design system (the old site's were
discarded with everything else). Proposed set — adjust if a design
naturally wants something else, just tell us what you used:

| Name | Width | Notes |
|---|---|---|
| Mobile | 375–430px | Design mobile first for every page |
| Tablet | 768–834px | |
| Desktop | 1024–1280px | |
| Wide | 1440px+ | Content column caps around 1240px max-width; the canvas can extend full-bleed (background, blobs-equivalent texture if any) beyond that |

### 1.9 Romanian text-length guardrail

Every page is designed once in EN but must also hold Romanian copy, which
typically runs **15–25% longer** than English for the same meaning. Headline
containers, button labels, and card titles should be checked against a
longer string, not just the EN draft, so nothing clips or wraps awkwardly.
Where useful, we've marked a rough RO equivalent in §3 so you can eyeball
the worst case.

---

## 2. Marks & assets usage map

All in `/assets/marks` and `/assets/fonts` (see `DESIGN.md` for the full
index and licensing). Quick usage map:

| Asset | Where it's used |
|---|---|
| `wordmark.svg` / `wordmark-ivory.svg` | Nav (home link), footer |
| `roundel.svg` / `roundel-solid.svg` | Favicon, social/OG default image, maybe an about-page detail |
| `shipping-stamp.svg` | Foot of every case-study page |

No other imagery exists yet. **Two things need new visual treatment from
you, not asset recreation from us:**

1. **Profile photo treatment** — for /about. The old site used a plain
   rounded-rect/circle photo; propose how a photo sits inside this warmer,
   more textured direction (frame, duotone, paper-edge, whatever fits —
   your call entirely).
2. **Social link icons** (GitHub, LinkedIn) — need a copper/ivory flat-icon
   treatment consistent with the mark system. Simple is fine; these are
   small footer/about elements, not a focal point.

---

## 3. Pages

For each page: purpose, blocks in order, real or placeholder copy, states,
motion notes, open decisions that are explicitly yours to make.

Every page below is EN. The RO mirror (`/ro/...`) is **the same layout,
same blocks, same order** — only copy changes — so you only need to design
the EN version of each page once; no separate RO mockup required.

### 3.1 Home — `/`

**Purpose:** first impression + fastest path to "this person can build what
I need."

1. **Hero.** Eyebrow (Fragment Mono, small, tracked): *"from the workshop
   of Andrei Muntean."* Headline (Basteleur, large): *"Made with care,
   shipped with agents."* (confirmed brand copy, pulled from the approved
   1c direction — not a placeholder). Support line: *"Full-stack engineer
   — design-minded, AI-native. Six-week handovers, documentation included,
   no mystery boxes."* (also confirmed brand copy). Availability line
   (§1.4). Primary CTA "Get in touch" → /contact. Secondary CTA "See the
   work" → /work.
   - RO headline is noticeably shorter than the EN one in early drafts —
     don't assume RO is always longer; check both directions.
   - **Motion:** signature moment #1 — wordmark/headline "ink-in" on load
     (settles instantly under reduced-motion).
2. **Featured work.** 3 flagship cards (§1.5) — CarHeltau, Cursed Vision
   Films, Wedding website (the current flagship set; see §4). Section
   label could use the ledger-style numeral treatment from the source
   design doc (e.g. small "01 / WORK" eyebrow) — your call.
3. **Process strip.** Condensed 3–4 step version of /process's engagement
   flow (Discovery → Build → Handover, or however you want to compress it),
   each step one line, linking through to /process.
4. **Trust band.** 1–2 client quotes (§1.6 Quote block) pulled from
   whichever flagships have one *(placeholder quotes only exist for
   layout — real ones arrive at content pass; design for 1 and for 2, since
   we don't yet know the final count)*.
5. **Contact teaser.** Availability restated + a CTA into /contact.

### 3.2 Work index — `/work`

**Purpose:** the full catalog — proof of range and honesty (including what
didn't survive).

1. **Flagship section** — 3 large cards (§1.5), link to their case-study
   pages.
2. **Entry section** — 5 compact cards (§1.5): Fota Industrial, Priv,
   Photography Portfolio *(in-workshop — "coming soon," no link, no
   detail page)*, bioRO *(retired)*, Leida *(retired)*. No detail pages for
   any entry — cards only.
3. **Optional ledger touch** — entry numbering (`№ 001`, `№ 002`…) in the
   Fragment Mono label style from the source design doc. **This is your
   call to make** — SPEC.md explicitly leaves it open; use it if it
   strengthens the workshop-ledger feel, skip it if it clutters the grid.

### 3.3 Case study — `/work/[slug]` (flagships only)

**Purpose:** the actual sales document — proves judgment, not just output.

Template blocks in order (`*(opt)*` = renders only when that project has
the data — **design both the with and the without state** for every
optional block, since different flagships will use different subsets):

1. **Spec-sheet header** — client name *(opt — personal projects omit
   it)*, year, role, stack tags, timeline *(opt)*, status chip, links
   (demo/GitHub/Figma — any subset).
2. **Outcome banner** *(opt)* — up to 3 metric chips.
3. **Brief** — who the client was, the problem, the stakes. Prose.
4. **Constraints** — budget/timeline/tech/content realities. Prose, maybe
   a short list.
5. **Approach & decisions** — what was chosen, *and what was rejected and
   why*. This is the judgment section — give it real visual weight, not
   just another prose block; it's the part that differentiates a case
   study from a portfolio blurb.
6. **Agent notes** *(opt but expected on recent work)* — the structured
   did/decided/verified block from §1.6.
7. **Gallery** *(opt)* — screenshots/Figma frames/diagrams, 1 to many.
8. Maker's notes (§1.6) sprinkled through the prose sections above — not
   a section of their own.
9. **Quote** *(opt)* — client testimonial block.
10. **Reflection** — what I'd do differently. Short, honest, prose.
11. **Footer** — shipping stamp (motion moment #2: presses in on scroll
    into view), then a contextual CTA into /contact.

**Design against two real content shapes**, not one, so the template's
range is proven:

- **CarHeltau** — has: client name, timeline, metrics, agent notes, no
  Figma link. Metrics-heavy, technical.
- **Wedding website** — has: no client name (personal project), a quote
  *(from a guest, illustrative)*, Figma + GitHub links, no metrics.
  Narrative-heavy, personal-charm register.

### 3.4 Process — `/process`

**Purpose:** the client-facing sales page for *how* Andrei works — this is
where the agentic story gets its credibility, not just its headline.

1. Short restatement of the positioning for a buyer specifically ("here's
   what working together looks like").
2. **Engagement flow** — Discovery → Proposal → Build (weekly demos) →
   Handover (docs, tests, training). **Motion moment #3**: this timeline
   draws itself in on scroll (settles instantly under reduced-motion) —
   design it as a sequence of connected steps/nodes that supports that
   kind of progressive reveal.
3. **The rig** — how the workshop actually runs day to day: Claude Code,
   skills/hooks, `CLAUDE.md` conventions, review discipline, CI gates.
   Frame this as *why clients get speed without slop*, not as a tools list
   — the craft/guardrail pairing from the voice rules applies hardest
   here.
4. **Guarantees** — what every project ships with: repo ownership,
   documentation, tests, no mystery boxes. A short, confident list.
5. CTA → /contact.

### 3.5 About — `/about`

**Purpose:** the human behind the bench — this is the page that makes
"hire the person, not the pipeline" land.

Blocks: photo (new treatment, see §2), path — self-taught, based in
Bucharest, started building in 2021 (five years in, as of 2026), what
"craft" means to Andrei in his own words, a paragraph of off-screen life,
links to /resume and /cv, closing CTA.

*(All biographical copy above is factual, drawn from the old site and this
project's history — draft the actual paragraphs freely; they're not
locked, just not fictional.)*

### 3.6 Contact — `/contact`

**Purpose:** the conversion point. Needs every state designed, not just the
empty form.

Fields: name, email, "What are we building?" (textarea). *(A honeypot field
also exists in the markup for spam defense — it's invisible by design,
nothing to draw.)*

States: **empty/default**, **filled**, **field-level error** (e.g. missing
email — inline message under the field, on-brand not alarm-red-generic),
**submitting** (button busy state), **success** (confirmation message
replacing or overlaying the form — warm, personal tone, not a generic
"thank you"), **submit-failed** (network/server error — apologetic, offers
the direct email as fallback).

Also on this page: direct email fallback (always visible, not hidden behind
the form), availability line, response-time expectation (e.g. "I read
everything within a day or two"), and a small **"vorbesc română"** note (on
the EN version only — the RO version's equivalent note says English is
fine too).

### 3.7 Colophon — `/colophon`

**Purpose:** the credibility footnote — required by font licensing, also
quietly reinforces the AI-native/craft story.

Stack summary (plain language, not a changelog), full font credits
(Velvetyne — Basteleur; Collletttivo — Apfel Grotezk; Wei Huang — Fragment
Mono, each OFL-licensed), a short "built with the same rig it describes"
story, a link to the public repo, analytics disclosure (Vercel Analytics,
cookieless). Quiet, plain page — no need for a hero moment here.

### 3.8 404

On-brand "lost in the workshop" copy (playful, not apologetic — matches the
maker's-note tone), single CTA back home.

### 3.9 Resume / CV — `/resume`, `/cv`

**No design needed.** These are server redirects straight to a PDF file
(placeholder until Andrei supplies the real resume/CV) — nothing renders
in the browser as a page.

### 3.10 OG / social share image

One template, filled per-page with that page's title + one-line summary:
umber background, Basteleur title, copper accents, roundel mark placed
consistently (e.g. corner). 1200×630. Needs to work for the home page
("Andrei Muntean — Made with care, shipped with agents"), a case study
("CarHeltau — [one-line summary]"), and a plain page (About, Process) —
design one flexible template, not three.

---

## 4. Content variety appendix

The real project set your card designs (§1.5) and the case-study template
(§3.3) must accommodate — deliberately uneven, because the honest range is
part of the brand:

| Project | Tier | Status | Has client name | Has metrics | Has quote | Links |
|---|---|---|---|---|---|---|
| CarHeltau | flagship | shipped | yes | yes (illustrative) | no | demo |
| Cursed Vision Films | flagship | shipped | yes | yes (illustrative) | no | demo |
| Wedding website | flagship | shipped | no (personal) | no | yes (illustrative) | demo, github, figma |
| Fota Industrial | entry | shipped | yes | — | — | demo |
| Priv | entry | shipped | no (personal) | — | — | github only |
| Photography Portfolio | entry | in-workshop | no (personal) | — | — | none yet — "coming soon" |
| bioRO | entry | retired | no (personal) | — | — | demo, github, figma |
| Leida | entry | retired | yes | — | — | demo |

Note the title-length range too when checking layouts: "Priv" (short) vs.
"Cursed Vision Films" (long) vs. "Photography Portfolio" (medium, and
still evolving — it's a working title).

---

## 5. Deliverables checklist

What we need back, organized the way Claude Design already organizes a
project (component library + pages):

**Foundations / components**
- [ ] Nav (all states, mobile + desktop)
- [ ] Footer
- [ ] Buttons — primary, secondary, link-style (all states)
- [ ] Availability component (open + full/waitlist)
- [ ] Flagship card + Entry card (all optional-field combinations that
      matter, retired state)
- [ ] Status chip (3 values), metric chip, stack tag
- [ ] Quote block, maker's note, agent-notes block
- [ ] Form field (all states from §3.6)

**Pages** (desktop + mobile for each)
- [ ] Home
- [ ] Work index
- [ ] Case study — CarHeltau content (metrics-heavy variant)
- [ ] Case study — Wedding website content (narrative-heavy variant)
- [ ] Process
- [ ] About
- [ ] Contact (all states)
- [ ] Colophon
- [ ] 404
- [ ] OG image template (3 sample fills: home, a case study, a plain page)

If anything above conflicts with `DESIGN.md`'s token values, the token
value wins; flag the conflict back to us rather than quietly overriding it.
