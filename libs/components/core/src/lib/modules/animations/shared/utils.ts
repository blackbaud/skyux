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
  elementRef: ElementRef<Element>;

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
        allMotionPropertiesDisabled(style.animationName) ||
        allDurationsNonPositive(style.animationDuration)
      );
    },
    trigger,
  });
}

/**
 * Watches the host element for disabled CSS transitions. When the trigger
 * signal changes and the tracked property's transition is disabled
 * (e.g. `transition-property: none` or its paired duration resolves to
 * `0` or less), the emitter fires via a microtask.
 */
export function watchForDisabledCssTransitions(
  args: EmitWhenMotionDisabledArgs & {
    /**
     * The specific CSS property being tracked (e.g. `'visibility'`).
     */
    propertyToTrack: Signal<string | undefined>;
  },
): void {
  const { destroyRef, elementRef, emitter, propertyToTrack, trigger } = args;

  emitWhenMotionDisabled({
    destroyRef,
    elementRef,
    emitter,
    isMotionDisabled: (style) => {
      if (allMotionPropertiesDisabled(style.transitionProperty)) {
        return true;
      }

      const trackedProperty = propertyToTrack();
      if (!trackedProperty) {
        return allDurationsNonPositive(style.transitionDuration);
      }

      return isTransitionDisabledForProperty({
        trackedProperty,
        transitionDuration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
      });
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

/**
 * Returns `true` if every entry in a comma-separated CSS property list is `'none'`.
 */
function allMotionPropertiesDisabled(value: string): boolean {
  return value.split(',').every((p) => p.trim() === 'none');
}

/**
 * Returns `true` if every entry in a comma-separated CSS duration list resolves to `0` or less.
 */
function allDurationsNonPositive(value: string): boolean {
  return value.split(',').every((d) => parseFloat(d.trim()) <= 0);
}

/**
 * Returns `true` if the tracked property's paired duration is `0` or less,
 * or if the property isn't listed. Per the CSS spec, durations cycle over
 * the property list.
 */
function isTransitionDisabledForProperty(args: {
  trackedProperty: string;
  transitionDuration: string;
  transitionProperty: string;
}): boolean {
  const { trackedProperty, transitionDuration, transitionProperty } = args;
  const properties = transitionProperty.split(',').map((p) => p.trim());
  const durations = transitionDuration.split(',').map((d) => d.trim());
  const index = properties.indexOf(trackedProperty);

  if (index === -1) {
    return true;
  }

  const duration = durations[index % durations.length];

  return parseFloat(duration) <= 0;
}
