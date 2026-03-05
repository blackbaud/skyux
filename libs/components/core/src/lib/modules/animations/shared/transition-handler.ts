import {
  Directive,
  ElementRef,
  Signal,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { _skyAnimationsDisabled } from '../utility/animations-disabled';

/**
 * Listens for CSS `transitionend` events on the host element and emits
 * a `transitionEnd` output when the tracked CSS property finishes
 * transitioning. When animations are globally disabled, the output
 * emits synchronously whenever the `transitionSignal` input changes.
 *
 * Consumers **must** call `cssPropertyToTrack()` to specify which CSS
 * property to monitor before any transition occurs on the host element.
 *
 * @internal
 */
@Directive({
  host: {
    '(transitionend)': 'onTransitionEnd($event)',
  },
})
export class SkyAnimationTransitionHandler {
  readonly #elementRef = inject(ElementRef<HTMLElement>);

  /**
   * A signal whose value changes trigger the start of a CSS transition.
   * When animations are disabled, changes to this signal cause
   * `transitionEnd` to emit synchronously instead.
   */
  public readonly transitionSignal = input.required<Signal<unknown>>();

  /**
   * Emits when the tracked CSS property's `transitionend` event fires
   * on the host element, or synchronously when animations are disabled.
   */
  public readonly transitionEnd = output<void>();

  readonly #propertyName = signal<string | undefined>(undefined);

  constructor() {
    if (_skyAnimationsDisabled()) {
      effect(() => {
        this.transitionSignal();
        this.transitionEnd.emit();
      });
    }
  }

  /**
   * Sets the CSS property name to monitor for `transitionend` events
   * (e.g. `'opacity'`, `'max-height'`). This must be called before a
   * transition occurs; otherwise an error is thrown when the host
   * element's `transitionend` event fires.
   */
  public cssPropertyToTrack(propertyName: string): void {
    this.#propertyName.set(propertyName);
  }

  protected onTransitionEnd(evt: TransitionEvent): void {
    if (!this.#propertyName()) {
      throw new Error(
        `SkyAnimationTransitionHandler: No CSS property specified for transition tracking on element ` +
          `'<${this.#elementRef.nativeElement.tagName.toLowerCase()}>'. ` +
          `Call 'cssPropertyToTrack()' with a valid CSS property name before a transition occurs.`,
      );
    }

    if (
      evt.currentTarget === this.#elementRef.nativeElement &&
      evt.propertyName === this.#propertyName()
    ) {
      this.transitionEnd.emit();
      evt.stopPropagation();
    }
  }
}
