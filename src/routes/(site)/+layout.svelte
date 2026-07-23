<script lang="ts">
   import SiteNav from '$lib/components/SiteNav.svelte';
   import SiteFooter from '$lib/components/SiteFooter.svelte';
   import { reactiveLocale } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';

   let { children }: { children: import('svelte').Snippet } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than calling
   // `m.skip_to_content()` with no explicit locale — it's what keeps this
   // correct after a client-side language switch.
   const locale = $derived(reactiveLocale());
</script>

<a class="skip-link" href="#content">{m.skip_to_content({}, { locale })}</a>
<SiteNav />
<main id="content">
   {@render children()}
</main>
<SiteFooter />
