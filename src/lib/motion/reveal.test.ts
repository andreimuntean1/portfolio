import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reveal } from './reveal';

// This project routes DOM-needing specs to a real-browser test project via
// the `*.svelte.test.ts` filename (`vite.config.ts`); plain `.test.ts` files
// run under plain Node instead (no `window`/`document`). `reveal` only
// touches a handful of globals (`window.matchMedia`/`setTimeout`/
// `innerHeight`, `document.addEventListener`/`removeEventListener`/
// `visibilityState`, `IntersectionObserver`) and a `classList`/
// `getBoundingClientRect`-shaped node, so hand-rolled fakes of each are
// simpler and faster than pulling in a full DOM for this.
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

const createFakeNode = (rect: FakeRect = { top: 0, bottom: 100, height: 100 }): HTMLElement => {
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
      getBoundingClientRect: () => {
         return rect;
      },
   } as unknown as HTMLElement;
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
      get visibilityState() {
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
      setTimeout: (handler: () => void, timeout?: number) => {
         return globalThis.setTimeout(handler, timeout);
      },
   });
};

beforeEach(() => {
   FakeIntersectionObserver.instances = [];
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

   it('adds .is-revealed once the node intersects the viewport', () => {
      const node = createFakeNode();

      reveal(node);
      const [observer] = FakeIntersectionObserver.instances;
      observer.intersect(true);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(true);
      expect(observer.disconnect).toHaveBeenCalledOnce();
   });

   it('does not reveal on a non-intersecting entry', () => {
      const node = createFakeNode();

      reveal(node);
      const [observer] = FakeIntersectionObserver.instances;
      observer.intersect(false);
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   it('delays adding .is-revealed by the given option', () => {
      const node = createFakeNode();

      reveal(node, { delay: 120 });
      const [observer] = FakeIntersectionObserver.instances;
      observer.intersect(true);

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

   it('disconnects the observer on destroy', () => {
      const node = createFakeNode();

      const action = reveal(node) as { destroy(): void };
      const [observer] = FakeIntersectionObserver.instances;

      action.destroy();

      expect(observer.disconnect).toHaveBeenCalledOnce();
   });

   // Regression coverage for the bug this fallback fixes: a page that loads
   // while its tab is backgrounded/occluded never gets an intersection
   // callback from Chromium, even after the tab becomes visible — confirmed
   // directly against real Chrome, not assumed (see the action's own doc
   // comment). Content must self-heal once the tab is actually looked at.
   it('reveals on visibilitychange if the node already qualifies and the observer never fired', () => {
      const node = createFakeNode({ top: 100, bottom: 300, height: 200 });

      reveal(node);
      fakeDocument.setVisibilityState('visible');
      fakeDocument.fireVisibilityChange();
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(true);
   });

   it('does not reveal on visibilitychange if the node is not sufficiently in view', () => {
      // height 200, only 20px (10%) within the fake 800px viewport — under
      // the 0.2 threshold the real IntersectionObserver would also use.
      const node = createFakeNode({ top: 780, bottom: 980, height: 200 });

      reveal(node);
      fakeDocument.setVisibilityState('visible');
      fakeDocument.fireVisibilityChange();
      vi.runAllTimers();

      expect(node.classList.contains('is-revealed')).toBe(false);
   });

   it('removes the visibilitychange listener once revealed via intersection', () => {
      const node = createFakeNode();

      reveal(node);
      const [observer] = FakeIntersectionObserver.instances;
      observer.intersect(true);
      vi.runAllTimers();

      expect(fakeDocument.listenerCount()).toBe(0);
   });

   it('removes the visibilitychange listener on destroy', () => {
      const node = createFakeNode();

      const action = reveal(node) as { destroy(): void };
      action.destroy();

      expect(fakeDocument.listenerCount()).toBe(0);
   });
});
