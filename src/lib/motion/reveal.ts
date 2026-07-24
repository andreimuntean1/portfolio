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
 * A page that loads while its tab is backgrounded/occluded is a third case
 * needing the same guarantee: Chromium defers `IntersectionObserver`
 * callbacks for content that was never actually rendered, and never
 * retroactively fires them once the tab becomes visible if the element
 * already satisfied the threshold at observe()-time — confirmed directly
 * against Chrome, not assumed (a plain `IntersectionObserver` on the same
 * node, observed the same way, never fired for the lifetime of a
 * `document.hidden` tab, foreground or not). Left unhandled, above-the-fold
 * content opened in a background tab — a normal, common thing to do, not an
 * edge case — stays permanently clipped with no recovery path. The
 * `visibilitychange` listener below is the recovery path: the first time
 * the tab becomes visible, re-check intersection by hand and reveal if the
 * node already qualifies.
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

   let revealed = false;

   const markRevealed = (): void => {
      if (revealed) {
         return;
      }
      revealed = true;
      window.setTimeout(() => {
         node.classList.add('is-revealed');
      }, options.delay ?? 0);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
   };

   const observer = new IntersectionObserver(
      (entries) => {
         for (const entry of entries) {
            if (entry.isIntersecting) {
               markRevealed();
            }
         }
      },
      { threshold: 0.2 },
   );

   function onVisibilityChange(): void {
      if (document.visibilityState !== 'visible' || revealed) {
         return;
      }
      const rect = node.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (rect.height > 0 && visibleHeight / rect.height >= 0.2) {
         markRevealed();
      }
   }

   observer.observe(node);
   document.addEventListener('visibilitychange', onVisibilityChange);

   return {
      destroy(): void {
         observer.disconnect();
         document.removeEventListener('visibilitychange', onVisibilityChange);
      },
   };
};
