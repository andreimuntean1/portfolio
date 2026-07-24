import type { Component } from 'svelte';
import type { Locale } from './projects';

export type SitePageSlug = 'process' | 'about' | 'colophon';
export type SitePageMetadata = { title: string; description: string };
export type SitePageModule = { metadata: SitePageMetadata; default: Component };

const pageModules = import.meta.glob('/content/site/*.mdx') as Record<
   string,
   () => Promise<SitePageModule>
>;

/**
 * Loads one static content page's compiled MDX body and its frontmatter.
 * Mirrors `loadProjectBody()` in `./projects` — same `import.meta.glob`
 * idiom, simpler because these pages aren't zod-validated and have no
 * cross-locale consistency checker (there's no per-project registry to
 * build, just one file per page per locale).
 *
 * @param page - which site page to load
 * @param locale - which locale's file to load
 * @return the page's frontmatter and its compiled body component
 */
export async function loadSitePage(page: SitePageSlug, locale: Locale): Promise<SitePageModule> {
   const key = `/content/site/${page}.${locale}.mdx`;
   const loader = pageModules[key];

   if (!loader) {
      throw new Error(`No site page at ${key}`);
   }

   return loader();
}
