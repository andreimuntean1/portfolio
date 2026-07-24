import { getFlagshipSlugs, type Locale } from '$lib/content/projects';
import { alternates, canonicalUrl } from '$lib/seo/meta';
import { localizeHref, locales } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';

export const prerender = true;

const STATIC_PATHS = ['/', '/work', '/process', '/about', '/contact', '/colophon'];

/**
 * All content pages' unlocalized paths: the static pages plus one
 * `/work/[slug]` per flagship. Entry-tier projects have no detail page, so
 * they're excluded — same reasoning as `buildLlmsTxt()`.
 *
 * @return unlocalized paths, one per content page
 */
function contentPaths(): string[] {
   const flagshipPaths = getFlagshipSlugs().map((slug) => {
      return `/work/${slug}`;
   });

   return [...STATIC_PATHS, ...flagshipPaths];
}

/**
 * Builds one `<url>` block for a single locale's version of a page, with
 * one `xhtml:link` alternate per locale (plus `x-default`) so every
 * language version of the page lists all its siblings, including itself.
 *
 * @param unlocalizedPath - the page's path with no locale prefix
 * @param locale - the locale this `<url>` block is for
 * @return the `<url>` block's XML
 */
function urlEntry(unlocalizedPath: string, locale: Locale): string {
   const loc = canonicalUrl(localizeHref(unlocalizedPath, { locale }));

   const links = alternates(unlocalizedPath)
      .map((alt) => {
         return `      <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`;
      })
      .join('\n');

   return `   <url>\n      <loc>${loc}</loc>\n${links}\n   </url>`;
}

export const GET: RequestHandler = () => {
   const urls = contentPaths()
      .flatMap((path) => {
         return locales.map((locale) => {
            return urlEntry(path, locale);
         });
      })
      .join('\n');

   const body =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
      'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
      `${urls}\n` +
      '</urlset>\n';

   return new Response(body, { headers: { 'content-type': 'application/xml' } });
};
