<script lang="ts">
   import '../styles/main.scss';
   import { onNavigate } from '$app/navigation';
   import { dev } from '$app/environment';
   import { injectAnalytics } from '@vercel/analytics/sveltekit';

   let { children }: { children: import('svelte').Snippet } = $props();

   injectAnalytics({ mode: dev ? 'development' : 'production' });

   onNavigate((navigation) => {
      if (!document.startViewTransition) {
         return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         return;
      }

      return new Promise((resolve) => {
         document.startViewTransition(() => {
            resolve();
            return navigation.complete;
         });
      });
   });
</script>

{@render children()}
