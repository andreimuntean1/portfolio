import { getFlagships } from '$lib/content/projects';
import { buildLlmsTxt } from '$lib/server/llms';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
   const body = buildLlmsTxt(getFlagships('en'));

   return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
