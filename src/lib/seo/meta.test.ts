import { describe, expect, it } from 'vitest';
import type { ProjectMeta } from '$lib/content/projects';
import { alternates, canonicalUrl, jsonLdCreativeWork, ogImagePath, pageTitle } from './meta';

describe('pageTitle', () => {
   it('appends the brand suffix to a given title', () => {
      expect(pageTitle('Work')).toBe('Work — Andrei Muntean');
   });

   it('returns the default full brand title when no title is given', () => {
      expect(pageTitle()).toBe('Andrei Muntean — Made with care, shipped with agents.');
   });
});

describe('alternates', () => {
   it('returns en, ro and x-default hreflang entries for a path', () => {
      expect(alternates('/work')).toEqual([
         { hreflang: 'en', href: 'https://andreimuntean.dev/work' },
         { hreflang: 'ro', href: 'https://andreimuntean.dev/ro/work' },
         { hreflang: 'x-default', href: 'https://andreimuntean.dev/work' },
      ]);
   });

   it('normalizes the root path so no entry gets a trailing slash', () => {
      // Regression test: paraglide's `localizeHref('/', { locale: 'ro' })`
      // returns `/ro/` (trailing slash), which would otherwise make the RO
      // home page's own hreflang self-reference mismatch its `/ro` canonical.
      expect(alternates('/')).toEqual([
         { hreflang: 'en', href: 'https://andreimuntean.dev/' },
         { hreflang: 'ro', href: 'https://andreimuntean.dev/ro' },
         { hreflang: 'x-default', href: 'https://andreimuntean.dev/' },
      ]);
   });
});

describe('canonicalUrl', () => {
   it('strips a trailing slash from a localized path', () => {
      expect(canonicalUrl('/ro/')).toBe('https://andreimuntean.dev/ro');
   });

   it('preserves the root path itself', () => {
      expect(canonicalUrl('/')).toBe('https://andreimuntean.dev/');
   });
});

describe('ogImagePath', () => {
   it('builds the per-locale, per-page OG image path', () => {
      expect(ogImagePath('en', 'home')).toBe('/og/en/home.png');
   });

   it('supports nested page ids for case studies', () => {
      expect(ogImagePath('ro', 'work/carheltau')).toBe('/og/ro/work/carheltau.png');
   });
});

describe('jsonLdCreativeWork', () => {
   const project: ProjectMeta = {
      title: 'Carheltau',
      summary: 'A booking platform for a boutique car rental fleet.',
      tier: 'flagship',
      status: 'shipped',
      year: 2024,
      role: 'Full-stack engineer',
      stack: ['SvelteKit', 'PostgreSQL'],
      links: {},
      slug: 'carheltau',
   };

   it('builds a schema.org CreativeWork with the project shape', () => {
      const result = jsonLdCreativeWork(project, 'https://andreimuntean.dev/work/carheltau') as {
         '@context': string;
         '@type': string;
         name: string;
         url: string;
         description: string;
         dateCreated: string;
      };

      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('CreativeWork');
      expect(result.name).toBe('Carheltau');
      expect(result.url).toBe('https://andreimuntean.dev/work/carheltau');
      expect(result.description).toBe('A booking platform for a boutique car rental fleet.');
      expect(result.dateCreated).toBe('2024-01-01');
   });
});
