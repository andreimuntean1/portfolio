import { getFeatured } from '$lib/content/projects';
import { currentLocale } from '$lib/i18n';

export function load(): { featured: ReturnType<typeof getFeatured> } {
   return { featured: getFeatured(currentLocale()) };
}
