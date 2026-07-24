import { z } from 'zod';

export const MIN_SUBMIT_MS = 3000;

const inquirySchema = z.object({
   name: z.string().trim().min(2, 'form_error_name'),
   email: z.email('form_error_email'),
   message: z.string().trim().min(10, 'form_error_message'),
});

export type InquiryResult =
   | { kind: 'spam' }
   | {
        kind: 'invalid';
        errors: Partial<Record<'name' | 'email' | 'message', string>>;
        values: Record<string, string>;
     }
   | { kind: 'valid'; inquiry: { name: string; email: string; message: string } };

/**
 * Validate a contact submission: honeypot + minimum-time spam checks first,
 * then field validation.
 *
 * @param data - raw form data
 * @param now - injectable clock for tests (default Date.now())
 * @return spam (silently swallowed), invalid (field errors), or valid
 */
export function parseInquiry(data: FormData, now: number = Date.now()): InquiryResult {
   const honeypot = String(data.get('company') ?? ''),
      startedAt = Number(data.get('startedAt') ?? 0);

   if (honeypot !== '' || !Number.isFinite(startedAt) || now - startedAt < MIN_SUBMIT_MS) {
      return { kind: 'spam' };
   }

   const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
   };

   const parsed = inquirySchema.safeParse(values);

   if (!parsed.success) {
      const errors: Partial<Record<'name' | 'email' | 'message', string>> = {};

      for (const issue of parsed.error.issues) {
         const field = issue.path[0] as 'name' | 'email' | 'message';

         errors[field] = errors[field] ?? issue.message;
      }
      return { kind: 'invalid', errors, values };
   }

   return { kind: 'valid', inquiry: parsed.data };
}
