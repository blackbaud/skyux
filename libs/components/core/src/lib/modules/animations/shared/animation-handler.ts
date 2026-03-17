import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

import { watchForDisabledCssAnimations } from './utils';

/**
 * @internal
 *
 * Listens for CSS `animationend` events on the host element and emits
 * an `animationEnd` output when an animation completes. When the
 * element's CSS animation is disabled (e.g. `animation-name: none`
 * or `animation-duration: 0s`), the output emits via a microtask
 * whenever the `animationTrigger` input changes.
 */
@Directive({
  selector: '[skyAnimationEndHandler]',
  host: {
    '(animationend)': 'onAnimationEnd($event)',
  },
})
export class _SkyAnimationEndHandlerDirective {
  /**
   * Drives animation lifecycle tracking on the host element. When the
   * value changes and the CSS animation is disabled, `animationEnd`
   * emits via a microtask.
   */
  public readonly animationTrigger = input.required<unknown>();

  /**
   * Emits when an `animationend` event fires on the host element, or via a
   * microtask when the CSS animation is disabled.
   */
  public readonly animationEnd = output<void>();

  constructor() {
    watchForDisabledCssAnimations({
      destroyRef: inject(DestroyRef),
      elementRef: inject(ElementRef),
      emitter: this.animationEnd,
      trigger: this.animationTrigger,
    });
  }

  protected onAnimationEnd(evt: AnimationEvent): void {
    this.animationEnd.emit();
    evt.stopPropagation();
  }
}
