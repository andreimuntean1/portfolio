import { describe, expect, it } from 'vitest';
import { getEntries, getFeatured, getFlagships, getFlagshipSlugs } from './projects';

describe('content registry', () => {
   it('loads 3 flagships and 5 entries per locale', () => {
      expect(getFlagships('en')).toHaveLength(3);
      expect(getFlagships('ro')).toHaveLength(3);
      expect(getEntries('en')).toHaveLength(5);
   });

   it('features carheltau, cursed-vision-films, wedding-website in order', () => {
      expect(
         getFeatured('en').map((p) => {
            return p.slug;
         }),
      ).toEqual(['carheltau', 'cursed-vision-films', 'wedding-website']);
   });

   it('exposes flagship slugs for prerender entries', () => {
      expect(getFlagshipSlugs()).toContain('carheltau');
   });
});
