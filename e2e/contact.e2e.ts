import { expect, test, type Page } from '@playwright/test';

/**
 * Backdate the form's spam-window timestamp past `MIN_SUBMIT_MS`
 * (`src/lib/server/inquiry.ts`) so a scripted, near-instant fill-and-submit
 * isn't itself flagged as spam, and drop the native `email` constraint so
 * the invalid-email case reaches server-side validation instead of being
 * blocked client-side.
 *
 * @param page - the active Playwright page
 */
async function bypassSpamWindow(page: Page): Promise<void> {
   await page.locator('.contact-form').evaluate((form: HTMLFormElement) => {
      form.noValidate = true;
   });
   await page.locator('input[name="startedAt"]').evaluate((input: HTMLInputElement) => {
      input.value = String(Date.now() - 5000);
   });
}

test('happy path: valid submission shows success', async ({ page }) => {
   await page.goto('/contact');
   await bypassSpamWindow(page);

   await page.locator('#contact-name').fill('Maker One');
   await page.locator('#contact-email').fill('maker@example.com');
   await page.locator('#contact-message').fill('A project inquiry with enough detail.');
   await page.getByRole('button', { name: /Send/i }).click();

   await expect(page.locator('.contact-form__success-title')).toHaveText('Got it.');
});

test('invalid email shows inline error', async ({ page }) => {
   await page.goto('/contact');
   await bypassSpamWindow(page);

   await page.locator('#contact-name').fill('Maker One');
   await page.locator('#contact-email').fill('not-an-email');
   await page.locator('#contact-message').fill('A project inquiry with enough detail.');
   await page.getByRole('button', { name: /Send/i }).click();

   await expect(page.locator('.contact-form__error')).toContainText("I'll need an email");
});

test('honeypot filled: still shows success (silent swallow)', async ({ page }) => {
   await page.goto('/contact');
   await bypassSpamWindow(page);

   await page.locator('#contact-name').fill('Maker One');
   await page.locator('#contact-email').fill('maker@example.com');
   await page.locator('#contact-message').fill('A project inquiry with enough detail.');
   await page.locator('#contact-company').evaluate((input: HTMLInputElement) => {
      input.value = 'Bot Co';
   });
   await page.getByRole('button', { name: /Send/i }).click();

   await expect(page.locator('.contact-form__success-title')).toHaveText('Got it.');
});
