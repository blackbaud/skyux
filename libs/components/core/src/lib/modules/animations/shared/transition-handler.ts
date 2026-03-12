import {
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { _skyAnimationsDisabled } from '../utility/animations-disabled';

/**
 * @internal
 *
 * Listens for CSS `transitionend` events on the host element and emits
 * a `transitionEnd` output when the tracked CSS property finishes
 * transitioning. When animations are globally disabled, the output
 * emits synchronously whenever the `transitionTrigger` input changes.
 *
 * The CSS property to monitor can be set via the `transitionPropertyToTrack`
 * input (for template usage) or by calling `setPropertyToTrack()`
 * (for `hostDirectives` usage).
 */
@Directive({
  selector: '[skyAnimationTransitionHandler]',
  host: {
    '(transitionend)': 'onTransitionEnd($event)',
  },
})
export class _SkyAnimationTransitionHandlerDirective {
  readonly #elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Drives the CSS transition on the host element. When the value
   * changes and animations are enabled, a CSS transition runs and
   * `transitionEnd` emits on completion. When animations are
   * disabled, `transitionEnd` emits synchronously instead.
   */
  public readonly transitionTrigger = input.required<boolean>();

  /**
   * The CSS property name to monitor for `transitionend` events
   * (e.g. `'opacity'`, `'transform'`). Can be set declaratively in
   * templates.
   */
  public readonly transitionPropertyToTrack = input<string>();

  /**
   * Emits when the tracked CSS property's `transitionend` event fires
   * on the host element, or synchronously when animations are disabled.
   */
  public readonly transitionEnd = output<void>();

  readonly #propertyNameOverride = signal<string | undefined>(undefined);

  constructor() {
    if (_skyAnimationsDisabled()) {
      const el = this.#elementRef.nativeElement;

      effect(() => {
        this.transitionTrigger();

        if (getComputedStyle(el).display !== 'none') {
          this.transitionEnd.emit();
        }
      });
    }
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
        `SkyAnimationTransitionHandler: No CSS property specified for transition tracking on element ` +
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
