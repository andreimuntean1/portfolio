<script lang="ts">
   import { page } from '$app/state';
   import { deLocalizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale } from '$lib/i18n';
   import { alternates, canonicalUrl, ogImagePath, pageTitle } from './meta';

   let {
      title,
      description,
      pageId,
      jsonLd,
   }: { title?: string; description: string; pageId: string; jsonLd?: object[] } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every tag below correct after a client-side language switch,
   // matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   // `page.url.pathname` is already locale-prefixed (e.g. `/ro/work`);
   // `deLocalizeHref()` (symmetrical to `extractLocaleFromUrl()`, see
   // `$lib/paraglide/runtime`) strips that prefix back off so `alternates()`
   // can rebuild each locale's own version of the same path.
   const unlocalizedPath = $derived(deLocalizeHref(page.url.pathname));

   const resolvedTitle = $derived(pageTitle(title));
   const canonical = $derived(canonicalUrl(page.url.pathname));
   const hreflangAlternates = $derived(alternates(unlocalizedPath));
   const ogImage = $derived(canonicalUrl(ogImagePath(locale, pageId)));

   // Case studies (`pageId` = `work/<slug>`) are `article`s; every other page
   // is a plain `website`.
   const ogType = $derived(pageId.startsWith('work/') ? 'article' : 'website');
</script>

<svelte:head>
   <title>{resolvedTitle}</title>
   <meta name="description" content={description} />
   <link rel="canonical" href={canonical} />
   {#each hreflangAlternates as alternate (alternate.hreflang)}
      <link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
   {/each}

   <meta property="og:title" content={resolvedTitle} />
   <meta property="og:description" content={description} />
   <meta property="og:image" content={ogImage} />
   <meta property="og:url" content={canonical} />
   <meta property="og:type" content={ogType} />

   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content={resolvedTitle} />
   <meta name="twitter:description" content={description} />
   <meta name="twitter:image" content={ogImage} />

   <!-- `entry` is always this app's own `meta.ts` builder output, never user
        input; a literal nested `<script>` tag here wouldn't get Svelte's
        mustache interpolation, so `{@html}` is the documented way to emit
        JSON-LD. Every `<` inside the stringified entry is escaped to guard
        against a stray `</script>` breaking out of the tag, and the closing
        tag itself is built as two concatenated strings so this file's own
        source never contains a literal `</script>` (which would otherwise
        end this SFC's `<script>` block at parse time). -->
   {#each jsonLd ?? [] as entry, index (index)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html `<script type="application/ld+json">${JSON.stringify(entry).replace(/</g, '\\u003c')}<` +
         '/script>'}
   {/each}
</svelte:head>
