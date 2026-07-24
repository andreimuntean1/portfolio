import type { Action } from 'svelte/action';

export type RevealOptions = { delay?: number };

/**
 * Adds `.is-revealed` to `node` once it scrolls into the viewport, on top of
 * an always-on `.reveal` base class — the pairing `_motion.scss` styles as
 * the system's scroll-reveal fade/signature-moment triggers.
 *
 * Under `prefers-reduced-motion: reduce`, or when `IntersectionObserver`
 * isn't available, `.is-revealed` is added immediately instead of waiting
 * for an intersection: content must never be left hidden or clipped for
 * anyone.
 *
 * @param node - element to reveal
 * @param options - `delay` (ms) to stagger the reveal after intersection,
 *   e.g. per-step timeline draw-in
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
   const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   node.classList.add('reveal');

   if (reduced || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-revealed');
      return { destroy(): void {} };
   }

   const observer = new IntersectionObserver(
      (entries) => {
         for (const entry of entries) {
            if (entry.isIntersecting) {
               window.setTimeout(() => {
                  node.classList.add('is-revealed');
               }, options.delay ?? 0);
               observer.disconnect();
            }
         }
      },
      { threshold: 0.2 },
   );

   observer.observe(node);

   return {
      destroy(): void {
         observer.disconnect();
      },
   };
};
