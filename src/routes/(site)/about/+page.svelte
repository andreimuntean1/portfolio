<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import Seo from '$lib/seo/Seo.svelte';
   import { jsonLdPerson } from '$lib/seo/meta';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message/href below correct after a client-side language
   // switch, matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   const contactHref = $derived(resolvedHref(localizeHref('/contact', { locale })));

   // `/resume` and `/cv` (SPEC §3.9) are server redirects owned by a later
   // task and don't exist as routes yet — same forward-reference situation
   // `vite.config.ts`'s `handleHttpError` comment already documents for
   // `/process`/`/about`/`/contact`/`/colophon` in Tasks 8-9; the prerender
   // allowlist there has been extended to cover these two as well.
   const resumeHref = $derived(resolvedHref(localizeHref('/resume', { locale })));
   const cvHref = $derived(resolvedHref(localizeHref('/cv', { locale })));
</script>

<Seo
   title={m.nav_about({}, { locale })}
   description={data.metadata.description}
   pageId="about"
   jsonLd={[jsonLdPerson()]}
/>

<article class="page">
   <h1 class="page__heading">{m.nav_about({}, { locale })}</h1>

   <div class="page__body">
      {#if data.body}
         {@const Body = data.body}
         <Body />
      {/if}
   </div>

   <ul class="page__links">
      <li><a class="page__link" href={resumeHref}>{m.cta_see_resume({}, { locale })}</a></li>
      <li><a class="page__link" href={cvHref}>CV</a></li>
   </ul>

   <a class="cta cta--primary" href={contactHref}>{m.cta_get_in_touch({}, { locale })}</a>
</article>
