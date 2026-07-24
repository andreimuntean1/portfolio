import type { RequestHandler } from './$types';

export const prerender = true;

const BODY = 'User-agent: *\nAllow: /\nSitemap: https://andreimuntean.dev/sitemap.xml';

export const GET: RequestHandler = () => {
   return new Response(BODY, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
