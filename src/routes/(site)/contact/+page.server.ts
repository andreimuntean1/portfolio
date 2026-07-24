import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { parseInquiry } from '$lib/server/inquiry';
import { getSiteConfig } from '$lib/content/site';
import type { Actions } from './$types';

export const prerender = false;

export const actions: Actions = {
   default: async ({ request }) => {
      const result = parseInquiry(await request.formData());

      if (result.kind === 'spam') {
         return { sent: true }; // pretend success; never tip off bots
      }

      if (result.kind === 'invalid') {
         return fail(400, { errors: result.errors, values: result.values });
      }

      if (!env.RESEND_API_KEY) {
         console.warn('[contact] RESEND_API_KEY missing — inquiry logged only');
         return { sent: true };
      }

      try {
         const resend = new Resend(env.RESEND_API_KEY);

         await resend.emails.send({
            from: 'workshop@andreimuntean.dev',
            to: getSiteConfig().email,
            replyTo: result.inquiry.email,
            subject: `Inquiry from ${result.inquiry.name}`,
            text: result.inquiry.message,
         });
      } catch (error) {
         console.error('[contact] Resend delivery failed', error);
         return fail(500, { failed: true });
      }

      return { sent: true };
   },
};
