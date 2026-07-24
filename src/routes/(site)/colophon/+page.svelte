<script lang="ts">
   import { reactiveLocale } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps the heading correct after a client-side language switch, matching
   // the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   // This site's own source (SPEC §5 Colophon: "a link to the public repo").
   // Not part of `getSiteConfig()` — that models profile-level socials
   // (GitHub profile, LinkedIn), not this specific repo — so it's kept as a
   // literal constant local to the one page that needs it.
   const REPO_URL = 'https://github.com/andreimuntean1/portfolio';
</script>

<article class="page">
   <h1 class="page__heading">{m.footer_colophon({}, { locale })}</h1>

   <div class="page__body">
      {#if data.body}
         {@const Body = data.body}
         <Body />
      {/if}
   </div>

   <p class="page__meta">
      <a class="page__link" href={REPO_URL} target="_blank" rel="noopener noreferrer external">
         {REPO_URL.replace('https://', '')}
      </a>
   </p>
</article>
