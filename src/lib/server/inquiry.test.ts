import { describe, expect, it } from 'vitest';
import { MIN_SUBMIT_MS, parseInquiry } from './inquiry';

function form(fields: Record<string, string>): FormData {
   const data = new FormData();

   for (const [key, value] of Object.entries(fields)) {
      data.set(key, value);
   }
   return data;
}

const NOW = 1_000_000;

const GOOD = {
   name: 'Ana',
   email: 'ana@example.com',
   message: 'We need a booking platform.',
   company: '',
   startedAt: String(NOW - MIN_SUBMIT_MS - 1),
};

describe('parseInquiry', () => {
   it('accepts a legitimate submission', () => {
      expect(parseInquiry(form(GOOD), NOW)).toEqual({
         kind: 'valid',
         inquiry: { name: 'Ana', email: 'ana@example.com', message: 'We need a booking platform.' },
      });
   });

   it('flags a filled honeypot as spam', () => {
      expect(parseInquiry(form({ ...GOOD, company: 'Botz Inc' }), NOW).kind).toBe('spam');
   });

   it('flags a too-fast submission as spam', () => {
      expect(parseInquiry(form({ ...GOOD, startedAt: String(NOW - 500) }), NOW).kind).toBe('spam');
   });

   it('returns field errors with preserved values', () => {
      const result = parseInquiry(form({ ...GOOD, email: 'nope' }), NOW);

      expect(result.kind).toBe('invalid');

      if (result.kind === 'invalid') {
         expect(result.errors.email).toBeTruthy();
         expect(result.values.name).toBe('Ana');
      }
   });
});
