import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { watchForDisabledCssTransitions } from './utils';

/**
 * @internal
 *
 * Listens for CSS `transitionend` events on the host element and emits
 * a `transitionEnd` output when the tracked CSS property finishes
 * transitioning. When the element's CSS transition is disabled
 * (e.g. `transition-property: none` or `transition-duration: 0s`), the
 * output emits via a microtask whenever the `transitionTrigger` input
 * changes.
 *
 * The CSS property to monitor can be set via the `transitionPropertyToTrack`
 * input (for template usage) or by calling `setPropertyToTrack()`
 * (for `hostDirectives` usage).
 */
@Directive({
  selector: '[skyTransitionEndHandler]',
  host: {
    '(transitionend)': 'onTransitionEnd($event)',
  },
})
export class _SkyTransitionEndHandlerDirective {
  readonly #elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Drives the CSS transition on the host element. When the value
   * changes and a CSS transition runs, `transitionEnd` emits on
   * completion. When the transition is disabled, `transitionEnd`
   * emits via a microtask instead.
   */
  public readonly transitionTrigger = input.required<unknown>();

  /**
   * The CSS property name to monitor for `transitionend` events
   * (e.g. `'opacity'`, `'transform'`). Can be set declaratively in
   * templates.
   */
  public readonly transitionPropertyToTrack = input<string>();

  /**
   * Emits when the tracked CSS property's `transitionend` event fires
   * on the host element, or via a microtask when the CSS transition is
   * disabled.
   */
  public readonly transitionEnd = output<void>();

  readonly #propertyNameOverride = signal<string | undefined>(undefined);

  constructor() {
    watchForDisabledCssTransitions({
      destroyRef: inject(DestroyRef),
      elementRef: this.#elementRef,
      emitter: this.transitionEnd,
      trigger: this.transitionTrigger,
    });
  }

  /**
   * Sets the CSS property name to monitor for `transitionend` events
   * programmatically. Use this when applying the directive via
   * `hostDirectives`.
   */
  public setPropertyToTrack(propertyName: string): void {
    this.#propertyNameOverride.set(propertyName);
  }

  protected onTransitionEnd(evt: TransitionEvent): void {
    if (evt.target !== this.#elementRef.nativeElement) {
      return;
    }

    const propertyName =
      this.transitionPropertyToTrack() ?? this.#propertyNameOverride();

    if (!propertyName) {
      throw new Error(
        `SkyTransitionEndHandler: No CSS property specified for transition tracking on element ` +
          `'<${this.#elementRef.nativeElement.tagName.toLowerCase()}>'. ` +
          `Set the 'transitionPropertyToTrack' input or call 'setPropertyToTrack()' with a valid CSS property name before a transition occurs.`,
      );
    }

    if (evt.propertyName === propertyName) {
      this.transitionEnd.emit();
      evt.stopPropagation();
    }
  }
}
