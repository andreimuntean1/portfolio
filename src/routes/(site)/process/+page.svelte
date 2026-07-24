<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message/href below correct after a client-side language
   // switch, matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   const contactHref = $derived(resolvedHref(localizeHref('/contact', { locale })));
</script>

<article class="page">
   <h1 class="page__heading">{m.nav_process({}, { locale })}</h1>
   <p class="page__intro">{m.process_intro({}, { locale })}</p>

   <!-- Engagement flow (SPEC §5 Process, item 2) — a plain, static, accessible
        ordered list today; Task 18 adds the scroll-drawing reveal on top of
        this same markup (settling instantly under reduced-motion), not built
        here. -->
   <ol class="timeline">
      <li class="timeline__step">
         <p class="timeline__label">{m.process_step_discovery({}, { locale })}</p>
      </li>
      <li class="timeline__step">
         <p class="timeline__label">{m.process_step_proposal({}, { locale })}</p>
      </li>
      <li class="timeline__step">
         <p class="timeline__label">{m.process_step_build({}, { locale })}</p>
      </li>
      <li class="timeline__step">
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
