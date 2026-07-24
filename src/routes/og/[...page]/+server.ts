import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import { error } from '@sveltejs/kit';
import basteleurUrl from '$lib/server/og/fonts/Basteleur-Bold.ttf?url';
import apfelUrl from '$lib/server/og/fonts/ApfelGrotezk-Regular.ttf?url';
import { ogDataFor, ogEntries } from '$lib/server/og/pages';
import { ogTemplate } from '$lib/server/og/template';
import type { RequestHandler, EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
   return ogEntries();
};

export const GET: RequestHandler = async ({ params }) => {
   const page = params.page.replace(/\.png$/, ''),
      data = ogDataFor(page);

   // `ogDataFor()` returns `undefined` rather than throwing on an unrecognized page —
   // a stale link or a renamed slug surfaces as a clean 404 during prerender (which
   // fails the build, see `handleHttpError` in `vite.config.ts`) instead of an
   // unhandled 500 from a thrown error propagating out of this handler.
   if (!data) {
      error(404, 'No such OG page');
   }

   const [basteleur, apfel] = await Promise.all([
      read(basteleurUrl).arrayBuffer(),
      read(apfelUrl).arrayBuffer(),
   ]);

   const svg = await satori(ogTemplate(data), {
      width: 1200,
      height: 630,
      fonts: [
         { name: 'Basteleur', data: basteleur, weight: 700, style: 'normal' },
         { name: 'Apfel Grotezk', data: apfel, weight: 400, style: 'normal' },
      ],
   });

   const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

   // `Response`'s `BodyInit` type doesn't include Node's `Buffer` directly (it's
   // missing from the union as far as TS's DOM lib is concerned here) — `Uint8Array`,
   // which `Buffer` already is an instance of, is.
   return new Response(new Uint8Array(png), { headers: { 'content-type': 'image/png' } });
};
