<script lang="ts">
   import { page } from '$app/state';
   import { localizeHref } from '$lib/paraglide/runtime';
   import { altHref, reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import wordmarkMarkup from '$lib/assets/marks/wordmark.svg?raw';

   type NavLink = { path: string; label: string };

   // `reactiveLocale()` (unlike `currentLocale()`) is tracked by Svelte, so
   // this stays correct after a client-side language switch — see its doc
   // comment in `$lib/i18n.ts`. Threaded explicitly into every
   // `localizeHref`/message call below, it's what makes labels *and* hrefs
   // reactive, not just the URL itself.
   const locale = $derived(reactiveLocale());

   // Bilingual disclosure-toggle label — kept local rather than a new paraglide
   // message key, since Task 8's message-key surface is fixed by Task 7.
   const menuLabel = $derived(locale === 'en' ? 'Menu' : 'Meniu');

   const links: NavLink[] = $derived([
      { path: '/work', label: m.nav_work({}, { locale }) },
      { path: '/process', label: m.nav_process({}, { locale }) },
      { path: '/about', label: m.nav_about({}, { locale }) },
      { path: '/contact', label: m.nav_contact({}, { locale }) },
   ]);

   function isActive(path: string): boolean {
      return page.url.pathname === localizeHref(path, { locale });
   }
</script>

{#snippet navLinks()}
   <ul class="nav__list">
      {#each links as link (link.path)}
         <li>
            <a
               class="nav__link"
               href={resolvedHref(localizeHref(link.path, { locale }))}
               aria-current={isActive(link.path) ? 'page' : undefined}
            >
               {link.label}
            </a>
         </li>
      {/each}
   </ul>

   <a class="nav__locale" href={resolvedHref(altHref(page.url.pathname, locale))}>
      <span class="nav__locale-option" aria-current={locale === 'en' ? 'true' : undefined}>EN</span>
      <span aria-hidden="true">/</span>
      <span class="nav__locale-option" aria-current={locale === 'ro' ? 'true' : undefined}>RO</span>
   </a>
{/snippet}

<header class="nav">
   <a
      class="nav__brand"
      href={resolvedHref(localizeHref('/', { locale }))}
      aria-label="andreimuntean.dev"
   >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
      <span class="nav__wordmark">{@html wordmarkMarkup}</span>
   </a>

   <!-- Desktop: always-expanded row, shown/hidden purely by breakpoint (see
        _nav.scss) — kept as a plain sibling `<nav>` rather than nested inside
        `.nav__disclosure` below, so its flex sizing never depends on a
        `<details>` element's box. -->
   <nav class="nav__links" aria-label="Primary">
      {@render navLinks()}
   </nav>

   <!-- Mobile: native disclosure, hidden entirely once the desktop rule above
        takes over. -->
   <details class="nav__disclosure">
      <summary class="nav__disclosure-toggle">{menuLabel}</summary>
      <nav class="nav__panel" aria-label="Primary">
         {@render navLinks()}
      </nav>
   </details>
</header>
