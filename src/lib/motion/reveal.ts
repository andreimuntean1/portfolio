import type { Action } from 'svelte/action';

export type RevealOptions = { delay?: number };

// Matches the `IntersectionObserver` threshold below: the fraction of the
// node's own height that must be within the viewport for it to count as
// revealed. Shared so the observer and the manual geometry check
// (`isInView`) can never drift apart.
const REVEAL_THRESHOLD = 0.2;

// Safety-net delay (ms). If nothing else has revealed an in-view node by
// now, a plain timer does — see the doc comment on `reveal`. Long enough
// that the next-frame path wins (and animates) in a visible tab, short
// enough that content is never clipped for a perceptible beat if it doesn't.
const SAFETY_NET_MS = 300;

/**
 * True when at least `REVEAL_THRESHOLD` of the node's height sits inside the
 * viewport right now — the same test the observer applies, computed by hand
 * from the node's own box so it works without waiting on an observer
 * callback. Geometry is available even in a hidden tab, so this is reliable
 * regardless of visibility.
 *
 * @param node - element to test
 * @return whether the node is sufficiently in view
 */
function isInView(node: HTMLElement): boolean {
   const rect = node.getBoundingClientRect();

   if (rect.height <= 0) {
      return false;
   }

   const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

   return visibleHeight / rect.height >= REVEAL_THRESHOLD;
}

/**
 * Adds `.is-revealed` to `node` once it is in the viewport, on top of an
 * always-on `.reveal` base class — the pairing `_motion.scss` styles as the
 * system's scroll-reveal fade/signature-moment triggers.
 *
 * The hard requirement: **content is never left clipped**, in any tab state.
 * `.reveal` hides the node (clip/opacity) the instant this action runs, so
 * whatever removes it again cannot be allowed to silently not-fire. Earlier
 * revisions leaned on `IntersectionObserver`'s initial callback, then added
 * a `visibilitychange` fallback — both are async signals that, in a tab
 * which isn't the foreground tab at load, simply may not arrive until the
 * user pokes the window (observed directly in Chrome: an in-viewport node
 * stayed clipped until a focus round-trip). Trusting any single async
 * callback to fire is the bug.
 *
 * So the reveal of an already-in-view (above-the-fold) node is driven by
 * three independent triggers, whichever lands first, all idempotent:
 *
 *   1. next-frame `requestAnimationFrame` — the fast, animated path in a
 *      visible tab (two frames so the clipped state paints once and the
 *      transition actually plays); paused while the tab is hidden;
 *   2. `visibilitychange` → visible — reveals the moment a
 *      background-loaded tab is first shown;
 *   3. a plain `setTimeout` safety net — fires in every tab state, hidden
 *      included (throttled, but it fires), so nothing can hang indefinitely.
 *
 * Below-the-fold content is left to the observer, whose *scroll-driven*
 * callbacks (unlike its initial one) are reliable. Under
 * `prefers-reduced-motion: reduce`, or without `IntersectionObserver`,
 * `.is-revealed` is added immediately.
 *
 * @param node - element to reveal
 * @param options - `delay` (ms) to stagger the reveal, e.g. per-step
 *   timeline draw-in
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
   const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   node.classList.add('reveal');

   if (reduced || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-revealed');
      return { destroy(): void {} };
   }

   let revealed = false;
   let rafId = 0;
   let safetyTimer = 0;

   const teardown = (): void => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(safetyTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
   };

   const markRevealed = (): void => {
      if (revealed) {
         return;
      }
      revealed = true;
      window.setTimeout(() => {
         node.classList.add('is-revealed');
      }, options.delay ?? 0);
      teardown();
   };

   const revealIfInView = (): void => {
      if (!revealed && isInView(node)) {
         markRevealed();
      }
   };

   const observer = new IntersectionObserver(
      (entries) => {
         for (const entry of entries) {
            if (entry.isIntersecting) {
               markRevealed();
            }
         }
      },
      { threshold: REVEAL_THRESHOLD },
   );

   function onVisibilityChange(): void {
      if (document.visibilityState === 'visible') {
         revealIfInView();
      }
   }

   observer.observe(node);

   // Trigger 1 — two frames so the clipped `.reveal` state paints once before
   // `.is-revealed` lands, giving the transition two states to animate.
   rafId = window.requestAnimationFrame(() => {
      rafId = window.requestAnimationFrame(revealIfInView);
   });

   // Trigger 2.
   document.addEventListener('visibilitychange', onVisibilityChange);

   // Trigger 3 — the guarantee.
   safetyTimer = window.setTimeout(revealIfInView, SAFETY_NET_MS);

   return {
      destroy(): void {
         teardown();
      },
   };
};
