import { loadSitePage, type SitePageMetadata } from '$lib/content/pages';
import { currentLocale } from '$lib/i18n';

export async function load(): Promise<{
   metadata: SitePageMetadata;
   body: import('svelte').Component;
}> {
   const { metadata, default: body } = await loadSitePage('about', currentLocale());

   return { metadata, body };
}
