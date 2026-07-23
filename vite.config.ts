import { paraglideVitePlugin } from '@inlang/paraglide-js';
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
         preprocess: [
            vitePreprocess(),
            mdsvex({
               extensions: ['.mdx'],
               layout: './src/lib/content/MdxLayout.svelte',
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
