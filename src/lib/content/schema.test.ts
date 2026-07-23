import { describe, expect, it } from 'vitest';
import { projectFrontmatterSchema } from './schema';

const VALID = {
   title: 'CarHeltau',
   summary: 'Automotive contract automation.',
   tier: 'flagship',
   status: 'shipped',
   year: 2024,
   client: 'CarHeltau',
   role: 'Design & full-stack build',
   stack: ['Vue', 'Node.js'],
   links: { demo: 'https://carheltau.ro/contract-online' },
   featured: 1,
   entryNo: 5,
};

describe('projectFrontmatterSchema', () => {
   it('accepts a valid flagship', () => {
      expect(projectFrontmatterSchema.parse(VALID)).toMatchObject({ tier: 'flagship' });
   });

   it('rejects unknown keys (agent typo protection)', () => {
      expect(() => {
         projectFrontmatterSchema.parse({ ...VALID, sumary: 'typo' });
      }).toThrow();
   });

   it('rejects a bad status', () => {
      expect(() => {
         projectFrontmatterSchema.parse({ ...VALID, status: 'done' });
      }).toThrow();
   });

   it('rejects more than 3 metrics', () => {
      const metrics = [1, 2, 3, 4].map((n) => {
         return { label: `m${n}`, value: String(n) };
      });

      expect(() => {
         projectFrontmatterSchema.parse({ ...VALID, metrics });
      }).toThrow();
   });

   it('rejects a non-URL link', () => {
      expect(() => {
         projectFrontmatterSchema.parse({ ...VALID, links: { demo: 'not-a-url' } });
      }).toThrow();
   });
});
