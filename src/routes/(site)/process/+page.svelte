<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import Seo from '$lib/seo/Seo.svelte';
   import SectionHeader from '$lib/components/SectionHeader.svelte';
   import { reveal } from '$lib/motion/reveal';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message/href below correct after a client-side language
   // switch, matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   const contactHref = $derived(resolvedHref(localizeHref('/contact', { locale })));

   // Signature moment #3 (MOCKUP §3.4) — the timeline "draws" in step by
   // step rather than all at once. Each `<li>` gets its own `use:reveal`
   // with an increasing delay, so the stagger comes from the action's own
   // `delay` option instead of a separate hand-rolled animation-delay chain.
   const TIMELINE_STEP_DELAY_MS = 120;
</script>

<Seo
   title={m.nav_process({}, { locale })}
   description={data.metadata.description}
   pageId="process"
/>

<article class="page">
   <div class="page__header">
      <p class="page__eyebrow hero__eyebrow--ink" use:reveal>
         <span class="page__eyebrow-rule" aria-hidden="true"></span>
         {m.process_eyebrow({}, { locale })}
      </p>
      <h1 class="page__heading hero__headline--ink" use:reveal>{m.nav_process({}, { locale })}</h1>
      <p class="page__intro">{m.process_intro({}, { locale })}</p>
   </div>

   <SectionHeader num="01" label={m.process_section_engagement({}, { locale })} />

   <!-- Engagement flow (SPEC §5 Process, item 2) — same static, accessible
        ordered list from Task 12; the per-step `use:reveal` above draws the
        connector in on scroll (`src/styles/_motion.scss`), settling
        instantly under reduced-motion. Markup/structure unchanged. -->
   <ol class="timeline">
      <li class="timeline__step" use:reveal={{ delay: TIMELINE_STEP_DELAY_MS * 0 }}>
         <p class="timeline__num" aria-hidden="true"></p>
         <p class="timeline__label">{m.process_step_discovery({}, { locale })}</p>
      </li>
      <li class="timeline__step" use:reveal={{ delay: TIMELINE_STEP_DELAY_MS * 1 }}>
         <p class="timeline__num" aria-hidden="true"></p>
         <p class="timeline__label">{m.process_step_proposal({}, { locale })}</p>
      </li>
      <li class="timeline__step" use:reveal={{ delay: TIMELINE_STEP_DELAY_MS * 2 }}>
         <p class="timeline__num" aria-hidden="true"></p>
         <p class="timeline__label">{m.process_step_build({}, { locale })}</p>
      </li>
      <li class="timeline__step" use:reveal={{ delay: TIMELINE_STEP_DELAY_MS * 3 }}>
         <p class="timeline__num" aria-hidden="true"></p>
         <p class="timeline__label">{m.process_step_handover({}, { locale })}</p>
      </li>
   </ol>

   <div class="page__body">
      {#if data.body}
         {@const Body = data.body}
         <Body />
      {/if}
   </div>

   <a class="cta cta--primary" href={contactHref}>{m.cta_get_in_touch({}, { locale })}</a>
</article>
