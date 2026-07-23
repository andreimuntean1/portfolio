# Design — "The Atelier"

Visual design system for the andreimuntean.dev revamp, extracted from rebrand
direction **1c ("The Atelier")** of the *Design system rebranding directions*
Claude Design project. Three directions were explored (1a "The Ledger", 1b
"Phosphor", 1c "The Atelier") — 1c is the one we're building against.

This replaces the old dark-navy/blurred-blob identity entirely: new palette,
new type, new mark, new tech stack (TBD). Nothing from the previous
implementation carries over except the general idea of "dark, confident,
personal portfolio."

## Brand identity

"A workshop that ships software." Umber and copper, letterforms with a
visible hand, typewriter notes in the margins — the friendliest proof that
agent-assisted delivery and handcraft coexist. Warmer and more textured than
the old navy/glassmorphism look: less corporate, more maker's-bench.

The logotype is lowercase **"am"** (initials) set close in the display serif —
the same idea as the old mark, carried into the new type system.

## Color palette

| Token | Value | Usage |
|---|---|---|
| `$color-umber` | `#1e1712` | Canvas — page background |
| `$color-bench` | `#281e16` | Surface — cards, panels |
| `$color-walnut` | `#3a2c1f` | Chips, wells, nested surfaces |
| `$color-seam` | `#443626` | Borders, hairlines, dividers |
| `$color-ivory` | `#f1e8d8` | Primary text on dark |
| `$color-copper` | `#c5854e` | Accent — CTAs, marks, links, emphasis |
| `$color-copper-hover` | `#d99a63` | Copper on hover/active |

Secondary text uses ivory at reduced opacity (`rgba(241, 232, 216, 0.72)` for
body copy, `rgba(241, 232, 216, 0.55)` for labels/meta/margin notes) rather
than a separate gray scale — keeps everything derived from one text color.

**No purple, no gradients, no Inter.** Warm, flat, editorial.

## Typography

Three typefaces, all self-hosted (`/assets/fonts`, no Google Fonts
dependency):

- **Basteleur** (Velvetyne, OFL) — display serif with a visible hand.
  Headlines, the wordmark, section titles. Weights: 400 "Moonlight" cut, 700
  "Bold" cut. Its capital **A** is a deliberately eccentric single-story form
  (reads close to a lowercase *a*) — that's the typeface's actual design, not
  a rendering bug; it's part of what gives this direction its handmade
  character.
- **Apfel Grotezk** (Collletttivo, OFL) — round, airy grotesque for body copy,
  nav, buttons, labels. Weights: 400 Regular, 500 Mittel, 700 Fett.
- **Fragment Mono** (Wei Huang, OFL) — margin notes, entry numbers, data
  labels. Chosen over the doc's default (Xanh Mono) and the alternate
  (Compagnon) because it's the mono already used elsewhere in the direction
  for data/labels, keeping the system to two mono touchpoints instead of
  three. Weight 400, regular + italic (italic used for maker's-note asides,
  e.g. *"n.b. — client renewed twice."*).

### Type scale (reference sizes, adjust responsively per component)

| Token | Size | Usage |
|---|---|---|
| `$font-size-display-lg` | 2.75rem (~44px) | Hero/section headlines (Basteleur) |
| `$font-size-display-md` | 2.125rem (~34px) | Card/subsection headlines |
| `$font-size-body-lg` | 1rem (~16px) | Lead body copy |
| `$font-size-body-md` | 0.875rem (~14px) | Default body copy |
| `$font-size-label` | 0.75rem (~12px) | Eyebrow labels, section numerals |
| `$font-size-micro` | 0.6875rem (~11px) | Margin notes, captions |

Letter-spacing is load-bearing in this system, not incidental:

- `-0.05em` — wordmark ("am" set close, headers/logo lockup)
- `-0.04em` — "am" inside the roundel mark
- `0.2em` — uppercase section labels ("PALETTE", "TYPE", "MARK"...)
- `0.24em` — tracked caps on the shipping stamp ("SHIPPED")

## Shape

- `10px` — small chips, palette swatches
- `14px` — cards, panels, secondary buttons
- `20px` — outer card / section containers
- `999px` (pill) — primary buttons, badges, direction tags

Rounded throughout, same identity principle as the old system (no sharp
corners), but tighter radii than before (max 20px vs the old 35px) — reads
more "crafted object," less "soft blob."

## Motion — "Handset"

- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring, slight overshoot)
- Duration: `320ms`
- Primary button hover: `transform: scale(1.05)`, background lightens to
  `$color-copper-hover`
- Card/secondary hover: `transform: translateY(-3px) scale(1.02)`, border
  brightens to copper
- Always gate behind `prefers-reduced-motion`

## Iconography & marks

Three marks, all rebuilt as true vector outlines from the real Basteleur/
Fragment Mono font files (not raster tracing) — see `/assets/marks`:

| Asset | Description |
|---|---|
| `wordmark.svg` / `.png` | "am" set close, Basteleur Bold, `-0.05em` tracking, copper fill, transparent background. Primary lockup for headers/nav. |
| `wordmark-ivory.svg` / `.png` | Same wordmark, ivory fill — for placement over copper or busy backgrounds. |
| `roundel.svg` / `.png` | "am" (Basteleur Bold, `-0.04em`) inside a copper circle stroke, transparent background. Avatars, stamps, general mark use. |
| `roundel-solid.svg` / `.png` | Roundel on a rounded-square umber card — app-icon / favicon-ready. |
| `shipping-stamp.svg` / `.png` | "AM" (Basteleur Bold) + "SHIPPED" (Fragment Mono, `0.24em` tracking), inside a copper-stroked rounded rect, rotated -4°. Case-study footers. |

No other imagery in the "03 MARK" section of the source doc — icons for
external links (GitHub, LinkedIn, Figma, etc.) and the profile photo carry
over as a *concept* from the old site but have no new assets yet; source or
recreate them in copper/ivory flat style to match when building the new UI.

## Design tokens

All of the above is codified in `/styles/_variables.scss` — colors, type,
spacing, radii, motion, and an `atelier-font-faces` mixin that declares all
seven `@font-face` rules against `/assets/fonts`. This file is plain SCSS
with no framework coupling; port the values into CSS custom properties or a
JS theme object if the eventual stack isn't Sass-based.

## Assets index

```
assets/
  fonts/
    ApfelGrotezk-Regular.woff2
    ApfelGrotezk-Mittel.woff2
    ApfelGrotezk-Fett.woff2
    Basteleur-Bold.woff2
    Basteleur-Moonlight.woff2
    FragmentMono-Regular.woff2
    FragmentMono-Italic.woff2
  marks/
    wordmark.svg / wordmark.png
    wordmark-ivory.svg / wordmark-ivory.png
    roundel.svg / roundel.png
    roundel-solid.svg / roundel-solid.png
    shipping-stamp.svg / shipping-stamp.png
styles/
  _variables.scss
```

## Licensing

Basteleur and Apfel Grotezk are licensed by their foundries under the OFL;
Fragment Mono (Wei Huang) is OFL as well. All are self-hosted here — no
Google Fonts dependency for the final site. **Attribution is required** in
site credits per the OFL terms; carry a credits line (e.g. in the footer or
an `/about` page) crediting Velvetyne (Basteleur), Collletttivo (Apfel
Grotezk), and Wei Huang (Fragment Mono).

## Open for the next stage

This doc and the assets/tokens above are stack-agnostic on purpose — nothing
here assumes Svelte, React, or any other framework. Whatever's chosen next
should:

1. Load `atelier-font-faces` (or its ported equivalent) once, globally.
2. Build components against the token file rather than hard-coded values.
3. Recreate the social/link icons and hero photo treatment in the new
   palette — those didn't have an equivalent in the "03 MARK" section and
   still need a design pass.
