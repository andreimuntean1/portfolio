<script lang="ts">
   import SiteNav from '$lib/components/SiteNav.svelte';
   import SiteFooter from '$lib/components/SiteFooter.svelte';
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';

   // Root-level `+error.svelte` — this file lives outside the `(site)` route
   // group, so its own `+layout.svelte` (nav/footer) does NOT wrap a request
   // that never matched any route at all (SvelteKit only applies ancestor
   // layouts up to the point a route actually matched; a completely unknown
   // path, e.g. a mistyped URL, matches nothing beneath the root). Verified
   // empirically against a real 404 in preview (see task report) rather than
   // assumed. Composing the same nav/footer shell directly here, mirroring
   // `(site)/+layout.svelte`, is what keeps the 404 on-brand instead of a
   // bare, chrome-less page.
   const locale = $derived(reactiveLocale());

   const homeHref = $derived(resolvedHref(localizeHref('/', { locale })));
</script>

<a class="skip-link" href="#content">{m.skip_to_content({}, { locale })}</a>
<SiteNav />
<main id="content" class="not-found">
   <h1 class="not-found__title">{m.not_found_title({}, { locale })}</h1>
   <a class="cta cta--primary" href={homeHref}>{m.not_found_cta({}, { locale })}</a>
</main>
<SiteFooter />
