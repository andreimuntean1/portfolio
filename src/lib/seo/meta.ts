import { localizeHref, locales } from '$lib/paraglide/runtime';
import { getSiteConfig } from '$lib/content/site';
import type { Locale, ProjectMeta } from '$lib/content/projects';

export const SITE_URL = 'https://andreimuntean.dev';

const DEFAULT_TITLE = 'Andrei Muntean — Made with care, shipped with agents.';

/**
 * Builds a page's `<title>` text. The home page passes no title (it IS the
 * site's own title), every other page passes a short page-specific one.
 *
 * @param title - short page-specific title, omitted on the home page
 * @return the full document title
 */
export function pageTitle(title?: string): string {
   if (title === undefined) {
      return DEFAULT_TITLE;
   }
   return `${title} — Andrei Muntean`;
}

/**
 * Prepends the site origin to an already-localized path.
 *
 * Also strips a trailing slash, except on the root path itself (`/`).
 * SvelteKit routes this site with no trailing slashes, but paraglide's
 * `localizeHref()` appends one when it localizes the root path to a
 * non-base locale (e.g. `localizeHref('/', { locale: 'ro' })` → `/ro/`,
 * see `localizeUrlDefaultPattern()` in `$lib/paraglide/runtime`) — every
 * other path is unaffected, since that function only produces a bare
 * trailing slash when there are no path segments to join. Without this,
 * a page's own hreflang self-reference could point at a different URL
 * than its own canonical link.
 *
 * @param localizedPath - locale-prefixed pathname (e.g. `/ro/work`)
 * @return the absolute canonical URL
 */
export function canonicalUrl(localizedPath: string): string {
   const normalizedPath =
      localizedPath.length > 1 && localizedPath.endsWith('/')
         ? localizedPath.slice(0, -1)
         : localizedPath;

   return `${SITE_URL}${normalizedPath}`;
}

/**
 * Builds the `hreflang` alternates for a page: one entry per locale plus
 * `x-default`, which points at the same URL as `en` — this project's
 * source-of-truth locale, and so its fallback hreflang target.
 *
 * @param unlocalizedPath - the page's path with no locale prefix
 * @return one `{ hreflang, href }` entry per locale, plus `x-default`
 */
export function alternates(unlocalizedPath: string): { hreflang: string; href: string }[] {
   const entries = locales.map((locale) => {
      return { hreflang: locale, href: canonicalUrl(localizeHref(unlocalizedPath, { locale })) };
   });

   const enHref = canonicalUrl(localizeHref(unlocalizedPath, { locale: 'en' }));

   return [...entries, { hreflang: 'x-default', href: enHref }];
}

/**
 * schema.org `Person` for Andrei Muntean — mounted on the home and about
 * pages.
 *
 * @return a JSON-LD `Person` object
 */
export function jsonLdPerson(): object {
   const config = getSiteConfig();

   return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Andrei Muntean',
      url: SITE_URL,
      sameAs: [config.socials.github, config.socials.linkedin],
      jobTitle: 'Full-stack engineer',
   };
}

/**
 * schema.org `CreativeWork` for a case-study page.
 *
 * @param project - the project's frontmatter metadata
 * @param url - the case study's canonical URL
 * @return a JSON-LD `CreativeWork` object
 */
export function jsonLdCreativeWork(project: ProjectMeta, url: string): object {
   return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      url,
      description: project.summary,
      dateCreated: `${project.year}-01-01`,
   };
}

/**
 * schema.org `BreadcrumbList` for a page's ancestor trail.
 *
 * @param items - ordered breadcrumb steps, each with its display name and
 *   canonical URL
 * @return a JSON-LD `BreadcrumbList` object
 */
export function jsonLdBreadcrumbs(items: { name: string; url: string }[]): object {
   return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => {
         return { '@type': 'ListItem', position: i + 1, name: item.name, item: item.url };
      }),
   };
}

/**
 * Builds the path to a page's Open Graph / Twitter card image.
 *
 * @param locale - the page's locale
 * @param pageId - the page's OG id (e.g. `home`, `work/carheltau`)
 * @return the image's site-relative path
 */
export function ogImagePath(locale: Locale, pageId: string): string {
   return `/og/${locale}/${pageId}.png`;
}
