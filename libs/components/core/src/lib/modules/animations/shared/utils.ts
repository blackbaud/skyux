import {
  DestroyRef,
  ElementRef,
  OutputEmitterRef,
  Signal,
  effect,
  untracked,
} from '@angular/core';

interface WatchMotionArgs {
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
export function watchForDisabledCssAnimations(args: WatchMotionArgs): void {
  emitWhenMotionDisabled(args, (style) => {
    return (
      allValuesEqual(style.animationName, 'none') ||
      allDurationsNonPositive(style.animationDuration)
    );
  });
}

/**
 * Watches the host element for disabled CSS transitions. When the trigger
 * signal changes and the tracked property's transition is disabled
 * (e.g. `transition-property: none` or its paired duration resolves to
 * `0` or less), the emitter fires via a microtask.
 */
export function watchForDisabledCssTransitions(
  args: WatchMotionArgs & {
    /**
     * The specific CSS property being tracked (e.g. `'visibility'`).
     */
    propertyToTrack: Signal<string | undefined>;
  },
): void {
  const { propertyToTrack, ...watchArgs } = args;

  emitWhenMotionDisabled(watchArgs, (style) => {
    if (allValuesEqual(style.transitionProperty, 'none')) {
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
  });
}

/**
 * Creates an effect that watches a trigger signal and emits via a microtask
 * when the host element's CSS motion is disabled. Skips the initial effect
 * run and unrendered elements to match native CSS behavior.
 */
function emitWhenMotionDisabled(
  args: WatchMotionArgs,
  isMotionDisabled: (style: CSSStyleDeclaration) => boolean,
): void {
  const { destroyRef, elementRef, emitter, trigger } = args;
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
    if (initialized && isRendered && untracked(() => isMotionDisabled(style))) {
      // Defer the emit to a microtask so it fires after the current
      // change detection pass, matching real transition timing.
      queueMicrotask(() => {
        if (!destroyed) {
          emitter.emit();
        }
      });
    }

    initialized = true;
  });
}

/**
 * Returns `true` if every entry in a comma-separated list equals `target`.
 */
function allValuesEqual(csv: string, target: string): boolean {
  return csv.split(',').every((v) => v.trim() === target);
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

  let index = properties.indexOf(trackedProperty);

  // If the tracked property is not explicitly listed, fall back to an `all`
  // entry if present. Per CSS, `transition-property: all` applies to every
  // property and uses its paired duration.
  if (index === -1) {
    const allIndex = properties.findIndex((p) => p.toLowerCase() === 'all');

    if (allIndex === -1) {
      return true;
    }

    index = allIndex;
  }

  const duration = durations[index % durations.length];

  return parseFloat(duration) <= 0;
}
