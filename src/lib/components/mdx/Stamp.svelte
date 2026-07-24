<script lang="ts">
   import stamp from '$lib/assets/marks/shipping-stamp.svg?raw';
   import { reactiveLocale } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import { reveal } from '$lib/motion/reveal';

   const label = $derived(m.status_shipped({}, { locale: reactiveLocale() }));
</script>

<div class="stamp" aria-label={label} use:reveal>
   <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
   {@html stamp}
</div>
