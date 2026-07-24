<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import { getSiteConfig } from '$lib/content/site';
   import * as m from '$lib/paraglide/messages';
   import Availability from './Availability.svelte';
   import wordmarkMarkup from '$lib/assets/marks/wordmark.svg?raw';
   import githubMarkup from '$lib/assets/icons/github.svg?raw';
   import linkedinMarkup from '$lib/assets/icons/linkedin.svg?raw';

   const config = getSiteConfig();

   // Prerendered, so this resolves at build time — same caveat as any static
   // site's copyright year, refreshed on the next deploy rather than live.
   const year = new Date().getFullYear();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // it's what keeps every link/label below correct after a client-side
   // language switch.
   const locale = $derived(reactiveLocale());

   type IndexLink = { path: string; label: string };

   const indexLinks: IndexLink[] = $derived([
      { path: '/work', label: m.nav_work({}, { locale }) },
      { path: '/process', label: m.nav_process({}, { locale }) },
      { path: '/about', label: m.nav_about({}, { locale }) },
      { path: '/contact', label: m.nav_contact({}, { locale }) },
      { path: '/colophon', label: m.footer_colophon({}, { locale }) },
   ]);
</script>

<footer class="footer">
   <div class="footer__inner">
      <div class="footer__seam" aria-hidden="true"></div>

      <div class="footer__columns">
         <div class="footer__column footer__column--brand">
            <a
               class="footer__brand"
               href={resolvedHref(localizeHref('/', { locale }))}
               aria-label="andreimuntean.dev"
            >
               <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
               <span class="footer__wordmark">{@html wordmarkMarkup}</span>
            </a>
            <p class="footer__tagline">{m.footer_tagline({}, { locale })}</p>
            <Availability />
         </div>

         <div class="footer__column footer__column--write">
            <p class="footer__eyebrow">{m.footer_write({}, { locale })}</p>
            <a class="footer__email" href="mailto:{config.email}">{config.email}</a>
            <div class="footer__socials">
               <a
                  class="footer__social"
                  href={config.socials.github}
                  target="_blank"
                  rel="noopener noreferrer external"
                  aria-label="GitHub"
               >
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
                  <span class="footer__social-icon">{@html githubMarkup}</span>
                  GitHub
               </a>
               <a
                  class="footer__social"
                  href={config.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer external"
                  aria-label="LinkedIn"
               >
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
                  <span class="footer__social-icon">{@html linkedinMarkup}</span>
                  LinkedIn
               </a>
            </div>
         </div>

         <div class="footer__column footer__column--index">
            <p class="footer__eyebrow">{m.footer_index({}, { locale })}</p>
            <nav class="footer__index" aria-label={m.footer_index({}, { locale })}>
               {#each indexLinks as link (link.path)}
                  <a
                     class="footer__index-link"
                     href={resolvedHref(localizeHref(link.path, { locale }))}
                  >
                     {link.label}
                  </a>
               {/each}
            </nav>
         </div>
      </div>

      <div class="footer__meta">
         <p class="footer__copyright">{m.footer_copyright({ year: String(year) }, { locale })}</p>
         <p class="footer__credits">
            {m.footer_credits_intro({}, { locale })}
            <a
               class="footer__credits-link"
               href={resolvedHref(localizeHref('/colophon', { locale }))}
            >
               {m.footer_credits_link({}, { locale })}
            </a>
         </p>
      </div>
   </div>
</footer>
