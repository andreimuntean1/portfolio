import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reveal } from './reveal';

// This project routes DOM-needing specs to a real-browser test project via
// the `*.svelte.test.ts` filename (`vite.config.ts`); plain `.test.ts` files
// run under plain Node instead (no `window`/`document`). `reveal` only
// touches a handful of globals (`window.matchMedia`/`setTimeout`/
// `innerHeight`/`requestAnimationFrame`/`cancelAnimationFrame`,
// `document.addEventListener`/`removeEventListener`/`visibilityState`,
// `IntersectionObserver`) and a `classList`/`getBoundingClientRect`-shaped
// node, so hand-rolled fakes of each are simpler and faster than pulling in
// a full DOM for this.
class FakeIntersectionObserver {
   public static instances: FakeIntersectionObserver[] = [];

   public disconnect = vi.fn();

   private readonly _callback: IntersectionObserverCallback;

   public constructor(callback: IntersectionObserverCallback) {
      this._callback = callback;
      FakeIntersectionObserver.instances.push(this);
   }

   public observe(): void {}

   public intersect(isIntersecting: boolean): void {
      this._callback(
         [{ isIntersecting } as IntersectionObserverEntry],
         this as unknown as IntersectionObserver,
      );
   }
}

type FakeRect = { top: number; bottom: number; height: number };

const IN_VIEW: FakeRect = { top: 100, bottom: 300, height: 200 };

const createFakeNode = (rect: FakeRect = IN_VIEW): HTMLElement => {
   const classes = new Set<string>();
   const classList = {
      add: (name: string): void => {
         classes.add(name);
      },
      contains: (name: string): boolean => {
         return classes.has(name);
      },
   };

   return {
      classList,
      getBoundingClientRect: (): FakeRect => {
         return rect;
      },
   } as unknown as HTMLElement;
};

// Controllable `requestAnimationFrame` — reveal schedules two nested frames,
// so tests drive them explicitly rather than relying on real timing.
let rafQueue: FrameRequestCallback[] = [];

const flushFrames = (count: number): void => {
   for (let i = 0; i < count; i += 1) {
      const pending = rafQueue;
      rafQueue = [];
      for (const cb of pending) {
         cb(0);
      }
   }
};

// Fake `document` — tracks `visibilitychange` listeners so a test can fire
// them by hand, the same way a real tab-visibility change would.
const createFakeDocument = () => {
   const listeners = new Set<() => void>();
   let visibilityState: 'hidden' | 'visible' = 'hidden';

   return {
      addEventListener: (type: string, handler: () => void): void => {
         if (type === 'visibilitychange') {
            listeners.add(handler);
         }
      },
      removeEventListener: (type: string, handler: () => void): void => {
         if (type === 'visibilitychange') {
            listeners.delete(handler);
         }
      },
      get visibilityState(): 'hidden' | 'visible' {
         return visibilityState;
      },
      setVisibilityState: (state: 'hidden' | 'visible'): void => {
         visibilityState = state;
      },
      fireVisibilityChange: (): void => {
         for (const handler of listeners) {
            handler();
         }
      },
      listenerCount: (): number => {
         return listeners.size;
      },
   };
};

let fakeDocument: ReturnType<typeof createFakeDocument>;

const setReducedMotion = (matches: boolean): void => {
   const matchMedia = vi.fn().mockReturnValue({ matches });

   // Wraps rather than aliases `globalThis.setTimeout` — `vi.useFakeTimers()`
   // replaces that global, and this must resolve it at call time so the
   // wrapper picks up the faked version regardless of stub/fake-timer order.
   vi.stubGlobal('window', {
      matchMedia,
      innerHeight: 800,
      setTimeout: (handler: () => void, timeout?: number): ReturnType<typeof setTimeout> => {
         return globalThis.setTimeout(handler, timeout);
      },
      clearTimeout: (id?: ReturnType<typeof setTimeout>): void => {
         globalThis.clearTimeout(id);
      },
      requestAnimationFrame: (cb: FrameRequestCallback): number => {
         rafQueue.push(cb);
         return rafQueue.length;
      },
      cancelAnimationFrame: (): void => {},
   });
};

beforeEach(() => {
   FakeIntersectionObserver.instances = [];
   rafQueue = [];
   vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
   fakeDocument = createFakeDocument();
   vi.stubGlobal('document', fakeDocument);
   setReducedMotion(false);
   vi.useFakeTimers();
});

afterEach(() => {
   vi.unstubAllGlobals();
   vi.useRealTimers();
});

describe('reveal', () => {
   it('adds .reveal immediately', () => {
      const node = createFakeNode();

      reveal(node);

      expect(node.classList.contains('reveal')).toBe(true);
      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   // The core fix: an already-in-view (above-the-fold) node reveals on its
   // own after two animation frames, with no observer callback ever firing.
   it('reveals in-view content on its own after two frames', () => {
      const node = createFakeNode(IN_VIEW);

      reveal(node);
      expect(node.classList.contains('is-revealed')).toBe(false);

      flushFrames(2);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(true);
   });

   it('does not self-reveal below-the-fold content', () => {
      // height 200, sits entirely below the 800px viewport.
      const node = createFakeNode({ top: 900, bottom: 1100, height: 200 });

      reveal(node);
      flushFrames(2);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   it('adds .is-revealed once a below-the-fold node scrolls into view', () => {
      const node = createFakeNode({ top: 900, bottom: 1100, height: 200 });

      reveal(node);
      flushFrames(2);
      const [observer] = FakeIntersectionObserver.instances;
      observer.intersect(true);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(true);
      expect(observer.disconnect).toHaveBeenCalledOnce();
   });

   it('does not reveal on a non-intersecting entry', () => {
      const node = createFakeNode({ top: 900, bottom: 1100, height: 200 });

      reveal(node);
      const [observer] = FakeIntersectionObserver.instances;
      observer.intersect(false);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   it('delays adding .is-revealed by the given option', () => {
      const node = createFakeNode(IN_VIEW);

      reveal(node, { delay: 120 });
      flushFrames(2);

      vi.advanceTimersByTime(119);
      expect(node.classList.contains('is-revealed')).toBe(false);

      vi.advanceTimersByTime(1);
      expect(node.classList.contains('is-revealed')).toBe(true);
   });

   it('reveals immediately, with no observer, under reduced motion', () => {
      setReducedMotion(true);
      const node = createFakeNode();

      reveal(node);

      expect(node.classList.contains('reveal')).toBe(true);
      expect(node.classList.contains('is-revealed')).toBe(true);
      expect(FakeIntersectionObserver.instances).toHaveLength(0);
   });

   // Backstop for the tab-loaded-hidden case: frames are paused while hidden,
   // so the reveal instead lands on the first visibilitychange to visible.
   it('reveals in-view content on first visibilitychange when frames never ran', () => {
      const node = createFakeNode(IN_VIEW);

      reveal(node);
      // No flushFrames — simulates a hidden tab where rAF never ticked.
      fakeDocument.setVisibilityState('visible');
      fakeDocument.fireVisibilityChange();
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(true);
   });

   it('ignores a visibilitychange that is still hidden (before the safety net)', () => {
      const node = createFakeNode(IN_VIEW);

      reveal(node);
      fakeDocument.setVisibilityState('hidden');
      fakeDocument.fireVisibilityChange();
      // Advance less than the safety-net delay: proves the hidden
      // visibilitychange itself didn't reveal, without the timer masking it.
      vi.advanceTimersByTime(100);

      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   // The guarantee: an in-view node reveals via the plain-timer safety net
   // even when the tab never became visible and no frame ever ran (the
   // permanently-backgrounded case), so content is never left clipped.
   it('reveals in-view content via the safety-net timer, hidden and frame-less', () => {
      const node = createFakeNode(IN_VIEW);

      reveal(node);
      // No flushFrames, no visibilitychange — nothing but the timer.
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(true);
   });

   it('does not reveal below-the-fold content via the safety-net timer', () => {
      const node = createFakeNode({ top: 900, bottom: 1100, height: 200 });

      reveal(node);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   it('tears down observer and visibilitychange listener once revealed', () => {
      const node = createFakeNode(IN_VIEW);

      reveal(node);
      flushFrames(2);
      const [observer] = FakeIntersectionObserver.instances;

      expect(observer.disconnect).toHaveBeenCalledOnce();
      expect(fakeDocument.listenerCount()).toBe(0);
   });

   it('disconnects the observer and removes the listener on destroy', () => {
      const node = createFakeNode({ top: 900, bottom: 1100, height: 200 });

      const action = reveal(node) as { destroy(): void };
      const [observer] = FakeIntersectionObserver.instances;

      action.destroy();

      expect(observer.disconnect).toHaveBeenCalledOnce();
      expect(fakeDocument.listenerCount()).toBe(0);
   });
});
