import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = [
   '/',
   '/work',
   '/work/carheltau',
   '/process',
   '/about',
   '/contact',
   '/colophon',
   '/ro',
   '/ro/work',
   '/ro/work/carheltau',
   '/ro/process',
   '/ro/about',
   '/ro/contact',
   '/ro/colophon',
];

for (const route of ROUTES) {
   test(`axe: ${route}`, async ({ page }) => {
      // Scroll-reveal content (`.reveal`, `$lib/motion/reveal.ts`) sits at
      // `opacity: 0` until its `IntersectionObserver` fires, which a
      // same-viewport `goto()` never triggers for below-the-fold elements —
      // axe then flags that mid-transition paint as a contrast violation,
      // even though `_motion.scss`'s `prefers-reduced-motion` block (the
      // system's sanctioned static/settled state, MOCKUP/SPEC §10) already
      // guarantees every one of those elements is fully opaque without
      // relying on scroll timing. Emulating it here audits that settled
      // state instead of a transient animation frame.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
   });
}
