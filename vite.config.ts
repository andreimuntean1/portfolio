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
            mdsvex({ extensions: ['.mdx'], layout: './src/lib/content/MdxLayout.svelte' }),
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
