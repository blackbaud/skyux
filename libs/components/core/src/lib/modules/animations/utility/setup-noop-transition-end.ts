import {
  DestroyRef,
  OutputEmitterRef,
  Signal,
  effect,
  inject,
} from '@angular/core';

/**
 * Wires up an `effect` that emits a `transitionEnd` output whenever
 * `triggerSignal` changes while animations are disabled (noop mode).
 *
 * Must be called from an injection context (e.g. a constructor).
 *
 * @internal
 */
export function _setupNoopTransitionEnd(
  triggerSignal: Signal<unknown>,
  transitionEnd: OutputEmitterRef<void>,
): void {
  let destroyed = false;

  inject(DestroyRef).onDestroy(() => (destroyed = true));

  effect(() => {
    triggerSignal();

    // Defer emission to a microtask so that consumers reacting to
    // `transitionEnd` (e.g. destroying views) don't run inside the
    // current change-detection/effect cycle.  This matches Angular's
    // own `NoopAnimationPlayer`, which uses `queueMicrotask` to
    // schedule its "done" callbacks.
    queueMicrotask(() => {
      if (!destroyed) {
        transitionEnd.emit();
      }
    });
  });
}
