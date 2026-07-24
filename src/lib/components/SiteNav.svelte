<script lang="ts">
   import { page } from '$app/state';
   import { afterNavigate } from '$app/navigation';
   import { localizeHref } from '$lib/paraglide/runtime';
   import { altHref, reactiveLocale, resolvedHref } from '$lib/i18n';
   import { getSiteConfig } from '$lib/content/site';
   import * as m from '$lib/paraglide/messages';
   import wordmarkMarkup from '$lib/assets/marks/wordmark.svg?raw';

   type NavLink = { path: string; label: string; num: string };

   // `reactiveLocale()` (unlike `currentLocale()`) is tracked by Svelte, so
   // this stays correct after a client-side language switch — see its doc
   // comment in `$lib/i18n.ts`. Threaded explicitly into every
   // `localizeHref`/message call below, it's what makes labels *and* hrefs
   // reactive, not just the URL itself.
   const locale = $derived(reactiveLocale());

   const menuLabel = $derived(m.nav_menu_toggle({}, { locale }));

   // `num` powers the mobile fullscreen panel's numbered-ledger treatment
   // (MOCKUP §5, Task 19 design pass) — decorative only, marked
   // `aria-hidden` at the call site since list order already conveys it.
   const links: NavLink[] = $derived([
      { path: '/work', label: m.nav_work({}, { locale }), num: '01' },
      { path: '/process', label: m.nav_process({}, { locale }), num: '02' },
      { path: '/about', label: m.nav_about({}, { locale }), num: '03' },
      { path: '/contact', label: m.nav_contact({}, { locale }), num: '04' },
   ]);

   const availability = $derived(getSiteConfig().availability[locale]);

   function isActive(path: string): boolean {
      return page.url.pathname === localizeHref(path, { locale });
   }

   // The open/close *mechanism* stays the native `<details>` toggle (Task
   // 19's "no new logic" note). These two handlers only add the ways to
   // *close* it that a native disclosure doesn't cover on its own, both of
   // which are load-bearing on a fullscreen mobile menu, not polish:
   //   - a menu link is a client-side navigation, which leaves `<details>`
   //     open (the nav lives in the persistent layout, so its `open`
   //     attribute survives the nav) — the fullscreen panel would then cover
   //     the page the user just navigated to;
   //   - Escape is the expected dismiss key for any fullscreen overlay, and
   //     native `<details>` (unlike `<dialog>`) does not honour it.
   let disclosure = $state<HTMLDetailsElement | null>(null);

   afterNavigate(() => {
      if (disclosure) {
         disclosure.open = false;
      }
   });

   function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape' && disclosure?.open) {
         disclosure.open = false;
      }
   }
</script>

<svelte:window onkeydown={closeOnEscape} />

{#snippet localeSwitcher(variantClass: string)}
   <a class="nav__locale {variantClass}" href={resolvedHref(altHref(page.url.pathname, locale))}>
      <span class="nav__locale-option" aria-current={locale === 'en' ? 'true' : undefined}>EN</span>
      <span aria-hidden="true">/</span>
      <span class="nav__locale-option" aria-current={locale === 'ro' ? 'true' : undefined}>RO</span>
   </a>
{/snippet}

<header class="nav">
   <div class="nav__inner">
      <a
         class="nav__brand"
         href={resolvedHref(localizeHref('/', { locale }))}
         aria-label="andreimuntean.dev"
      >
         <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
         <span class="nav__wordmark">{@html wordmarkMarkup}</span>
      </a>

      <!-- Desktop: always-expanded row, shown/hidden purely by breakpoint
           (see _nav.scss) — kept as a plain sibling `<nav>` rather than
           nested inside `.nav__disclosure` below, so its flex sizing never
           depends on a `<details>` element's box. -->
      <nav class="nav__links" aria-label={m.nav_landmark_primary({}, { locale })}>
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

         <span class="nav__divider" aria-hidden="true"></span>

         {@render localeSwitcher('')}
      </nav>

      <!-- Mobile: native disclosure, hidden entirely once the desktop rule
           above takes over. Fullscreen when open (see _nav.scss) — the "no
           new logic" constraint from Task 19's brief is why this stays a
           native `<details>`/`<summary>` toggle rather than JS-managed open
           state, same as the rest of the component. -->
      <details class="nav__disclosure" bind:this={disclosure}>
         <summary class="nav__disclosure-toggle">
            <span class="visually-hidden">{menuLabel}</span>
         </summary>
         <nav class="nav__panel" aria-label={m.nav_landmark_primary({}, { locale })}>
            <p class="nav__panel-eyebrow" aria-hidden="true">{menuLabel}</p>
            <ul class="nav__panel-list">
               {#each links as link (link.path)}
                  <li>
                     <a
                        class="nav__panel-link"
                        href={resolvedHref(localizeHref(link.path, { locale }))}
                        aria-current={isActive(link.path) ? 'page' : undefined}
                     >
                        <span class="nav__panel-link-num" aria-hidden="true">{link.num}</span>
                        {link.label}
                     </a>
                  </li>
               {/each}
            </ul>
            <div class="nav__panel-footer">
               {@render localeSwitcher('nav__locale--panel')}
               <span class="nav__panel-availability">{availability}</span>
            </div>
         </nav>
      </details>
   </div>
</header>
