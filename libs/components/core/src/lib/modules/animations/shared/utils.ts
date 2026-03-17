import {
  DestroyRef,
  ElementRef,
  OutputEmitterRef,
  Signal,
  effect,
} from '@angular/core';

interface EmitWhenMotionDisabledArgs {
  /** The directive's `DestroyRef`, used to suppress emissions after teardown. */
  destroyRef: DestroyRef;

  /** A reference to the host element whose computed styles are inspected. */
  elementRef: ElementRef;

  /** The output emitter to call when CSS motion is disabled. */
  emitter: OutputEmitterRef<void>;

  /** A signal that drives motion tracking. Emissions are evaluated whenever this value changes. */
  trigger: Signal<unknown>;
}

/**
 * Watches the host element for disabled CSS animations. When the trigger
 * signal changes and the element's `animation-name` is `'none'` or its
 * `animation-duration` resolves to `0` or less, the emitter fires via a
 * microtask.
 */
export function watchForDisabledCssAnimations(
  args: EmitWhenMotionDisabledArgs,
): void {
  const { destroyRef, elementRef, emitter, trigger } = args;

  emitWhenMotionDisabled({
    destroyRef,
    elementRef,
    emitter,
    isMotionDisabled: (style) => {
      return (
        style.animationName === 'none' ||
        parseFloat(style.animationDuration) <= 0
      );
    },
    trigger,
  });
}

/**
 * Watches the host element for disabled CSS transitions. When the trigger
 * signal changes and the element's `transition-property` is `'none'` or its
 * `transition-duration` resolves to `0` or less, the emitter fires via a
 * microtask.
 */
export function watchForDisabledCssTransitions(
  args: EmitWhenMotionDisabledArgs,
): void {
  const { destroyRef, elementRef, emitter, trigger } = args;

  emitWhenMotionDisabled({
    destroyRef,
    elementRef,
    emitter,
    isMotionDisabled: (style) => {
      return (
        style.transitionProperty === 'none' ||
        parseFloat(style.transitionDuration) <= 0
      );
    },
    trigger,
  });
}

/**
 * Creates an effect that watches a trigger signal and emits via a microtask
 * when the host element's CSS motion is disabled. Skips the initial effect
 * run and unrendered elements to match native CSS behavior.
 */
function emitWhenMotionDisabled(
  args: EmitWhenMotionDisabledArgs & {
    isMotionDisabled: (style: CSSStyleDeclaration) => boolean;
  },
): void {
  const { destroyRef, elementRef, emitter, isMotionDisabled, trigger } = args;
  const el = elementRef.nativeElement;

  let destroyed = false;
  let initialized = false;

  destroyRef.onDestroy(() => {
    destroyed = true;
  });

  effect(() => {
    trigger();

    const style = getComputedStyle(el);
    const isRendered = style.display !== 'none';

    // Skip the first effect run (and unrendered elements) to match native CSS behavior.
    // Motion events only fire on rendered elements when a property value changes.
    if (initialized && isRendered) {
      if (isMotionDisabled(style)) {
        // Defer the emit to a microtask so it fires after the current
        // change detection pass, matching real transition timing.
        queueMicrotask(() => {
          if (!destroyed) {
            emitter.emit();
          }
        });
      }
    }

    initialized = true;
  });
}
