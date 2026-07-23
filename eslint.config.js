import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
   includeIgnoreFile(gitignorePath),
   {
      // Pre-existing Claude-Design export (outside the SvelteKit app scope) and
      // paraglide's fully generated, regenerate-on-build runtime.
      ignores: ['design-files/**', 'src/lib/paraglide/**'],
   },
   js.configs.recommended,
   ts.configs.recommended,
   svelte.configs.recommended,
   prettier,
   svelte.configs.prettier,
   {
      languageOptions: { globals: { ...globals.browser, ...globals.node } },
      rules: {
         // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
         // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
         'no-undef': 'off',
      },
   },
   {
      files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
      languageOptions: {
         parserOptions: {
            projectService: true,
            extraFileExtensions: ['.svelte'],
            parser: ts.parser,
         },
      },
   },
   {
      // Override or add rule settings here, such as:
      // 'svelte/button-has-type': 'error'
      rules: {
         'no-var': 'error',
         'prefer-const': 'error',
         eqeqeq: ['error', 'always'],
         curly: ['error', 'all'],
         'arrow-parens': ['error', 'always'],
         'arrow-body-style': ['error', 'always'],
         '@typescript-eslint/explicit-module-boundary-types': 'error',
         '@typescript-eslint/no-explicit-any': 'error',
      },
   },
   {
      // The core `prefer-const` rule has no awareness of Svelte 5 runes:
      // `let { title } = $props();` is the adopted convention (see code-style
      // skill) regardless of whether a given instance reassigns it. Defer to
      // the rune-aware Svelte version, which already excludes $props/$derived.
      files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
      rules: {
         'prefer-const': 'off',
         'svelte/prefer-const': 'error',
      },
   },
);
