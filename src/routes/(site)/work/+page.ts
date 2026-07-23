import { getEntries, getFlagships, type ProjectMeta } from '$lib/content/projects';
import { currentLocale } from '$lib/i18n';

export function load(): { flagships: ProjectMeta[]; entries: ProjectMeta[] } {
   const locale = currentLocale();

   return { flagships: getFlagships(locale), entries: getEntries(locale) };
}
