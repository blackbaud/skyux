import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

import { _skyAnimationsDisabled } from '../utility/animations-disabled';

import { mimicCssMotionEvent } from './mimic-css-motion-event';

/**
 * @internal
 *
 * Listens for CSS `animationend` events on the host element and emits
 * an `animationEnd` output when an animation completes. When animations
 * are globally disabled, the output emits via a microtask whenever the
 * `animationTrigger` input changes.
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
   * value changes and animations are disabled, `animationEnd` emits
   * via a microtask.
   */
  public readonly animationTrigger = input.required<unknown>();

  /**
   * Emits when an `animationend` event fires on the host element, or via a
   * microtask when animations are disabled.
   */
  public readonly animationEnd = output<void>();

  constructor() {
    if (_skyAnimationsDisabled()) {
      mimicCssMotionEvent(
        inject(ElementRef),
        inject(DestroyRef),
        this.animationTrigger,
        this.animationEnd,
      );
    }
  }

  protected onAnimationEnd(evt: AnimationEvent): void {
    this.animationEnd.emit();
    evt.stopPropagation();
  }
}
