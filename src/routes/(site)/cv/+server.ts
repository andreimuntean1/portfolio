import { redirect } from '@sveltejs/kit';

export const prerender = true;

export function GET(): never {
   redirect(302, '/files/cv-ro.pdf');
}
