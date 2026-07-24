<script lang="ts">
   import { getSiteConfig } from '$lib/content/site';
   import { reactiveLocale } from '$lib/i18n';

   // Deliberate deviation from the brief's literal `currentLocale()` call —
   // see the task report. `currentLocale()` reads `window.location`
   // ambiently, which isn't tracked by Svelte, so this `$derived` would never
   // re-run after a client-side (same-route) locale switch and would keep
   // showing the availability line in whichever language was active on
   // mount. `reactiveLocale()` reads `page.url` instead, which Svelte does
   // track, keeping this correct after the nav language switcher is clicked.
   const availability = $derived(getSiteConfig().availability[reactiveLocale()]);

   // Task 19 design pass (Nav/Footer/Components sheet) highlights the
   // headline in copper against a muted detail — both EN and RO config
   // strings already use " · " as the visual joint (`content/site/config.json`),
   // so splitting on it is a presentation-only transform, not new data logic.
   const headline = $derived(availability.split(' · ')[0]);
   const detail = $derived(availability.split(' · ').slice(1).join(' · '));
</script>

<p class="availability">
   <span class="availability__dot" aria-hidden="true"></span>
   <span class="availability__headline">{headline}</span>
   {#if detail}
      <span class="availability__detail"> · {detail}</span>
   {/if}
</p>
