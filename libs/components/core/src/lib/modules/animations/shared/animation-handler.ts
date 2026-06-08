import {
  DestroyRef,
  Directive,
  ElementRef,
  booleanAttribute,
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
   * When `true` and the host element uses `animate.enter`, the
   * disabled-animation fallback emits `animationEnd` on the initial
   * render. Use this when the element's insertion into the DOM is
   * the animation event.
   */
  public readonly emitOnAnimateEnter = input(false, {
    transform: booleanAttribute,
  });

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
      emitOnAnimateEnter: this.emitOnAnimateEnter,
      emitter: this.animationEnd,
      trigger: this.animationTrigger,
    });
  }

  protected onAnimationEnd(evt: AnimationEvent): void {
    this.animationEnd.emit();
    evt.stopPropagation();
  }
}
