import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reveal } from './reveal';

// This project routes DOM-needing specs to a real-browser test project via
// the `*.svelte.test.ts` filename (`vite.config.ts`); plain `.test.ts` files
// run under plain Node instead (no `window`/`document`). `reveal` only
// touches three globals (`window.matchMedia`, `window.setTimeout`,
// `IntersectionObserver`) and a `classList`-shaped node, so a hand-rolled
// fake of each is simpler and faster than pulling in a full DOM for this.
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

const createFakeNode = (): HTMLElement => {
   const classes = new Set<string>();
   const classList = {
      add: (name: string): void => {
         classes.add(name);
      },
      contains: (name: string): boolean => {
         return classes.has(name);
      },
   };

   return { classList } as unknown as HTMLElement;
};

const setReducedMotion = (matches: boolean): void => {
   const matchMedia = vi.fn().mockReturnValue({ matches });

   // Wraps rather than aliases `globalThis.setTimeout` — `vi.useFakeTimers()`
   // replaces that global, and this must resolve it at call time so the
   // wrapper picks up the faked version regardless of stub/fake-timer order.
   vi.stubGlobal('window', {
      matchMedia,
      setTimeout: (handler: () => void, timeout?: number) => {
         return globalThis.setTimeout(handler, timeout);
      },
   });
};

beforeEach(() => {
   FakeIntersectionObserver.instances = [];
   vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
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
});
