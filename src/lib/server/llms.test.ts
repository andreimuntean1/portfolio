import { describe, expect, it } from 'vitest';
import { buildLlmsTxt } from './llms';
import type { ProjectMeta } from '$lib/content/projects';

const FLAGSHIP: ProjectMeta = {
   slug: 'carheltau',
   title: 'CarHeltau',
   summary: 'A booking platform for a car rental fleet.',
   tier: 'flagship',
   status: 'shipped',
   year: 2025,
   role: 'Full-stack engineer',
   stack: ['SvelteKit', 'TypeScript'],
   links: {},
};

describe('buildLlmsTxt', () => {
   it('includes a hand-authored header identifying Andrei', () => {
      const text = buildLlmsTxt([FLAGSHIP]);

      expect(text).toContain('# Andrei Muntean');
   });

   it('lists each flagship as a markdown link with its summary', () => {
      const text = buildLlmsTxt([FLAGSHIP]);

      expect(text).toContain(
         '- [CarHeltau](https://andreimuntean.dev/work/carheltau): A booking platform for a car rental fleet.',
      );
   });
});
