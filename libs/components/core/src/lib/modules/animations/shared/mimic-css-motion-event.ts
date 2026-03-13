import {
  DestroyRef,
  ElementRef,
  OutputEmitterRef,
  Signal,
  effect,
} from '@angular/core';

/**
 * Mimics a CSS motion end event (`animationend`/`transitionend`) when
 * CSS motion is disabled.
 *
 * Registers an effect that watches the provided trigger signal and, after the
 * first change, emits on a microtask when the host element is visible. This
 * preserves async timing that callers expect from real motion end events.
 */
export function mimicCssMotionEvent(
  elementRef: ElementRef,
  destroyRef: DestroyRef,
  triggerSignal: Signal<unknown>,
  output: OutputEmitterRef<void>,
): void {
  const el = elementRef.nativeElement as HTMLElement;

  let destroyed = false;
  let initialized = false;

  destroyRef.onDestroy(() => {
    destroyed = true;
  });

  effect(() => {
    triggerSignal();

    if (initialized && getComputedStyle(el).display !== 'none') {
      // Defer the emit to a microtask so it fires after the current
      // change detection pass, matching real transitionend timing.
      queueMicrotask(() => {
        if (!destroyed) {
          output.emit();
        }
      });
    }

    initialized = true;
  });
}
