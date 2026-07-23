import { page } from '$app/state';
import { resolve } from '$app/paths';
import type { Pathname, ResolvedPathname } from '$app/types';
import { baseLocale, extractLocaleFromUrl, getLocale, localizeHref } from '$lib/paraglide/runtime';
import type { Locale } from '$lib/content/projects';

export * as t from '$lib/paraglide/messages';

export function currentLocale(): Locale {
   return getLocale() as Locale;
}

/**
 * Locale-in-`$derived`-context version of `currentLocale()`. Reads
 * `page.url` (from `$app/state`) instead of the ambient `getLocale()`, so it
 * stays correct when read from a component's reactive scope — including
 * after a client-side, same-route navigation (e.g. the nav language
 * switcher), which changes `page.url` without re-running anything that only
 * called `currentLocale()`. Call-site-only: components and their `$derived`
 * values, never `load()` functions — those already get the locale for the
 * page being loaded via their own `url` argument.
 *
 * Deliberately uses `extractLocaleFromUrl()`, not the higher-level
 * `getLocaleForUrl()`: the latter's `'url'` strategy resolution is a no-op
 * during SSR (guarded behind `!isServer` in the generated runtime), silently
 * falling back to `baseLocale` for every request — verified directly against
 * the compiled `src/lib/paraglide/runtime.js`, not assumed. That's fine for
 * `getLocale()`'s own ambient SSR path (server-rendered locale comes from
 * `paraglideMiddleware`'s `AsyncLocalStorage`, unaffected by that guard), but
 * would make this function wrong on first render for every `/ro` page.
 * `extractLocaleFromUrl()` parses the URL directly with no such guard, so it
 * gives the right answer in both SSR and CSR.
 *
 * @return the locale for the currently rendered page
 */
export function reactiveLocale(): Locale {
   return extractLocaleFromUrl(page.url) ?? baseLocale;
}

/**
 * Same path in the other locale — powers the nav language switcher and
 * hreflang alternates.
 *
 * @param path - localized or unlocalized pathname
 * @param from - locale to switch away from. Defaults to the ambient
 *   `currentLocale()`, which is fine for a one-shot/SSR-only read (e.g.
 *   hreflang alternates) but — being a plain function call, not a tracked
 *   read — won't pick up a client-side navigation on its own. Pass
 *   `reactiveLocale()`'s value explicitly from a component's reactive scope
 *   (see its doc comment) so the switcher stays correct after it's clicked
 *   once already.
 * @return href for the opposite locale
 */
export function altHref(path: string, from: Locale = currentLocale()): string {
   const other: Locale = from === 'en' ? 'ro' : 'en';

   return localizeHref(path, { locale: other });
}

/**
 * Runs an already-localized href through SvelteKit's `resolve()` so internal
 * links satisfy `svelte/no-navigation-without-resolve`. The cast is safe:
 * `localizeHref`/`altHref` only ever return paths within this app.
 *
 * @param href - output of `localizeHref()` or `altHref()`
 * @return the same href, typed as a resolved SvelteKit pathname
 */
export function resolvedHref(href: string): ResolvedPathname {
   return resolve(href as Pathname);
}
