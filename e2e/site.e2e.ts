import { expect, test } from '@playwright/test';

test('nav flow: home -> work -> case study', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('link', { name: 'Work' }).first().click();
   await expect(page).toHaveURL('/work');

   await page.getByRole('link', { name: /CarHeltau/ }).click();
   await expect(page).toHaveURL('/work/carheltau');
   await expect(page.locator('h1')).toContainText('CarHeltau');
});

test('locale switch: /work -> /ro/work with RO heading', async ({ page }) => {
   await page.goto('/work');

   // `.nav__locale` renders twice — the always-present desktop nav and the
   // mobile `<details>` disclosure (`SiteNav.svelte`'s `navLinks` snippet is
   // used in both) — scope to the desktop one, visible at this viewport.
   await page.locator('.nav__links .nav__locale').click();
   await expect(page).toHaveURL('/ro/work');
   await expect(page.locator('h1')).toHaveText('Lucrări');
});

test('404: unknown work slug shows not-found page', async ({ page }) => {
   await page.goto('/work/nope');

   await expect(page.locator('h1')).toHaveText('Lost in the workshop.');
});

test('resume redirect: /resume -> pdf', async ({ request }) => {
   // Prerendered redirects (`+server.ts`'s `export const prerender = true`)
   // ship as a static HTML page with a meta-refresh + JS redirect — real
   // HTTP 3xx status codes for these come from the Vercel-specific rewrite
   // rules `adapter-vercel` writes into `.vercel/output`, which `vite
   // preview` (this suite's web server) doesn't apply. Driving a real
   // browser through the meta-refresh into Chromium's PDF viewer is slow and
   // flaky under `vite preview`, so assert on the served redirect markup
   // instead of the final rendered document.
   const response = await request.get('/resume');

   expect(response.status()).toBe(200);
   expect(await response.text()).toContain('url=/files/resume-en.pdf');
});

test('llms.txt is served and mentions Andrei', async ({ request }) => {
   const response = await request.get('/llms.txt');

   expect(response.ok()).toBe(true);
   expect(await response.text()).toContain('Andrei');
});
