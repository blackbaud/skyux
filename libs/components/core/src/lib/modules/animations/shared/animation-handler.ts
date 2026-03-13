import {
  DestroyRef,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import { _skyAnimationsDisabled } from '../utility/animations-disabled';

/**
 * @internal
 *
 * Listens for CSS `animationend` events on the host element and emits
 * an `animationEnd` output when an animation completes. When animations
 * are globally disabled, the output emits synchronously whenever the
 * `animationTrigger` input changes.
 */
@Directive({
  selector: '[skyAnimationAnimationHandler]',
  host: {
    '(animationend)': 'onAnimationEnd($event)',
  },
})
export class _SkyAnimationAnimationHandlerDirective {
  readonly #elementRef = inject(ElementRef);

  /**
   * Drives animation lifecycle tracking on the host element. When the
   * value changes and animations are disabled, `animationEnd` emits
   * synchronously.
   */
  public readonly animationTrigger = input.required<unknown>();

  /**
   * Emits when an `animationend` event fires on the host element, or
   * synchronously when animations are disabled.
   */
  public readonly animationEnd = output<void>();

  constructor() {
    if (_skyAnimationsDisabled()) {
      const el = this.#elementRef.nativeElement;
      const destroyRef = inject(DestroyRef);

      let initialized = false;
      let destroyed = false;

      destroyRef.onDestroy(() => {
        destroyed = true;
      });

      effect(() => {
        this.animationTrigger();

        if (initialized && getComputedStyle(el).display !== 'none') {
          // Defer the emit to a microtask so it fires after the current
          // change detection pass, matching real transitionend timing.
          queueMicrotask(() => {
            if (!destroyed) {
              this.animationEnd.emit();
            }
          });
        }

        initialized = true;
      });
    }
  }

  protected onAnimationEnd(evt: AnimationEvent): void {
    this.animationEnd.emit();
    evt.stopPropagation();
  }
}
