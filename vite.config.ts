import { fileURLToPath } from 'node:url';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
   resolve: {
      alias: { $styles: '/src/styles' },
   },

   plugins: [
      // Must run before sveltekit() so it can preprocess `<enhanced:img>` markup
      // ahead of Svelte compilation.
      enhancedImages(),

      sveltekit({
         // Mirrors Vite's own root-relative import convention (used by the content
         // layer, e.g. `/content/site/config.json`) so tsc/svelte-check resolves it
         // the same way Vite does at build time — `npm run dev`/`svelte-kit sync`
         // reflects this into the generated tsconfig automatically.
         alias: { '/content/*': 'content/*' },

         compilerOptions: {
            // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
            runes: ({ filename }) => {
               return filename.split(/[/\\]/).includes('node_modules') ? undefined : true;
            },
         },

         // Deployed on Vercel; pin the Node runtime rather than relying on adapter-auto's detection.
         adapter: adapter({ runtime: 'nodejs22.x' }),
         prerender: {
            // The nav (Task 8), footer (Task 8) and home page (Task 9) already link to
            // `/work`, `/work/[slug]`, `/process`, `/about`, `/contact` and `/colophon` —
            // routes owned by Tasks 10-12, which don't exist yet. That's the plan's
            // established pattern (see Task 9's brief), not a broken link, so a 404 from
            // exactly those paths shouldn't fail the build; anything else still does.
            // Task 12's About page extends this the same way for `/resume` and `/cv`
            // (SPEC §3.9): plain server redirects to a PDF, owned by a later task.
            handleHttpError: ({ path, message }) => {
               // TASK 10 TODO: the `work(\/[^/]+)?` sub-pattern below allows-lists
               // *any* single-segment `/work/<slug>` path, not just today's
               // known-missing route. That's fine while `/work/[slug]` doesn't
               // exist yet, but once Task 10 adds it, this blanket regex will keep
               // silently swallowing 404s from mistyped/nonexistent slugs (e.g. a
               // typo'd `/work/carheltua`) in future internal links, defeating the
               // build's broken-link guard for that path shape. Narrow or remove
               // the `work` branch once the dynamic route exists — real slug
               // validation should come from SvelteKit's normal 404 handling (or an
               // `entries()` allowlist), not this regex.
               const isPendingRoute =
                  /^\/(ro\/)?(work(\/[^/]+)?|process|about|contact|colophon|resume|cv)$/.test(path);

               if (isPendingRoute) {
                  return;
               }

               throw new Error(message);
            },
         },
         preprocess: [
            vitePreprocess(),
            mdsvex({
               extensions: ['.mdx'],
               // Absolute path, not the project-root-relative string mdsvex's own
               // docs show: mdsvex emits this verbatim as an import specifier in
               // every compiled `.mdx` file, resolved relative to *that file's own
               // directory* by the bundler — not to the project root. Content lives
               // several directories deep (`content/projects/<slug>/en.mdx`), where
               // a root-relative string doesn't reach `src/lib/...` at all. Went
               // unnoticed until now because no route had eagerly imported the
               // content registry into a page bundle before Task 9 (`getFeatured`
               // in the home page's `+page.ts`) — `svelte-check` doesn't resolve
               // real imports, and Vitest's SSR module runner tolerates it in a way
               // `vite build`'s Rollup/rolldown resolver does not.
               layout: fileURLToPath(
                  new URL('./src/lib/content/MdxLayout.svelte', import.meta.url),
               ),
               // Runes mode is forced project-wide (above); without this, mdsvex forwards
               // layout props via legacy `$$props`, which is invalid in runes mode.
               layoutPropForwarding: 'runes',
            }),
         ],
         extensions: ['.svelte', '.mdx'],
      }),

      paraglideVitePlugin({
         project: './project.inlang',
         outdir: './src/lib/paraglide',
         strategy: ['url', 'baseLocale'],
         emitTsDeclarations: true,
      }),
   ],
   test: {
      expect: { requireAssertions: true },
      projects: [
         {
            extends: './vite.config.ts',
            test: {
               name: 'client',
               browser: {
                  enabled: true,
                  provider: playwright(),
                  instances: [{ browser: 'chromium', headless: true }],
               },
               include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
               exclude: ['src/lib/server/**'],
            },
         },

         {
            extends: './vite.config.ts',
            test: {
               name: 'server',
               environment: 'node',
               include: ['src/**/*.{test,spec}.{js,ts}'],
               exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
            },
         },
      ],
   },
});
