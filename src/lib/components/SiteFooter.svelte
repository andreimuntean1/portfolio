<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import { getSiteConfig } from '$lib/content/site';
   import * as m from '$lib/paraglide/messages';
   import Availability from './Availability.svelte';
   import wordmarkMarkup from '$lib/assets/marks/wordmark.svg?raw';

   const config = getSiteConfig();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // it's what keeps the colophon link and font-credit line correct after a
   // client-side language switch.
   const locale = $derived(reactiveLocale());
</script>

<footer class="footer">
   <div class="footer__brand">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
      <span class="footer__wordmark" aria-hidden="true">{@html wordmarkMarkup}</span>
      <Availability />
   </div>

   <ul class="footer__links">
      <li><a class="footer__link" href="mailto:{config.email}">{config.email}</a></li>
      <li>
         <a
            class="footer__link"
            href={config.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer external"
         >
            LinkedIn
         </a>
      </li>
      <li>
         <a
            class="footer__link"
            href={config.socials.github}
            target="_blank"
            rel="noopener noreferrer external"
         >
            GitHub
         </a>
      </li>
      <li>
         <a class="footer__link" href={resolvedHref(localizeHref('/colophon', { locale }))}
            >{m.footer_colophon({}, { locale })}</a
         >
      </li>
   </ul>

   <p class="footer__credits">
      <a class="footer__credits-link" href={resolvedHref(localizeHref('/colophon', { locale }))}>
         {m.footer_font_credits({}, { locale })}
      </a>
   </p>
</footer>
