import { getLocale, localizeHref } from '$lib/paraglide/runtime';
import type { Locale } from '$lib/content/projects';

export * as t from '$lib/paraglide/messages';

export function currentLocale(): Locale {
   return getLocale() as Locale;
}

/**
 * Same path in the other locale — powers the nav language switcher and
 * hreflang alternates.
 *
 * @param path - localized or unlocalized pathname
 * @return href for the opposite locale
 */
export function altHref(path: string): string {
   const other: Locale = currentLocale() === 'en' ? 'ro' : 'en';

   return localizeHref(path, { locale: other });
}
