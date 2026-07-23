import { describe, expect, it } from 'vitest';
import type { ProjectFrontmatter } from './schema';
import { validateProjectPair, validateRegistry } from './validate';

function fm(overrides: Partial<ProjectFrontmatter> = {}): ProjectFrontmatter {
   return {
      title: 'X',
      summary: 'S',
      tier: 'entry',
      status: 'shipped',
      year: 2024,
      role: 'Build',
      stack: ['Vue'],
      links: {},
      ...overrides,
   };
}

describe('validateProjectPair', () => {
   it('passes when structural fields agree', () => {
      expect(validateProjectPair('x', fm(), fm({ title: 'X (ro)' }))).toEqual([]);
   });

   it('fails when status differs', () => {
      const errors = validateProjectPair('x', fm(), fm({ status: 'retired' }));

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('status');
   });

   it('fails when metric values differ but not when labels differ', () => {
      const en = fm({ metrics: [{ label: 'Load time', value: '1.2s' }] }),
         roOK = fm({ metrics: [{ label: 'Timp de încărcare', value: '1.2s' }] }),
         roBad = fm({ metrics: [{ label: 'Timp de încărcare', value: '9.9s' }] });

      expect(validateProjectPair('x', en, roOK)).toEqual([]);
      expect(validateProjectPair('x', en, roBad)).toHaveLength(1);
   });
});

describe('validateRegistry', () => {
   it('requires ro unless draft', () => {
      expect(validateRegistry({ x: { en: fm() } })).toHaveLength(1);
      expect(validateRegistry({ x: { en: fm({ draft: true }) } })).toEqual([]);
   });

   it('always requires en', () => {
      expect(validateRegistry({ x: { ro: fm() } })).toHaveLength(1);
   });

   it('rejects duplicate entryNo and featured across projects', () => {
      const pairs = {
         a: { en: fm({ entryNo: 1, featured: 1 }), ro: fm({ entryNo: 1, featured: 1 }) },
         b: { en: fm({ entryNo: 1, featured: 1 }), ro: fm({ entryNo: 1, featured: 1 }) },
      };

      const errors = validateRegistry(pairs);

      expect(
         errors.some((e) => {
            return e.includes('entryNo');
         }),
      ).toBe(true);
      expect(
         errors.some((e) => {
            return e.includes('featured');
         }),
      ).toBe(true);
   });
});
