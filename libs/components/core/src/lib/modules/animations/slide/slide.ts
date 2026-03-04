import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import { _skyAnimationsDisabled } from '../utility/animations-disabled';

import { SkyAnimationSlideDirection } from './slide-direction';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(transitionend)': 'onTransitionEnd($event)',
  },
  selector: 'sky-animation-slide',
  styleUrl: './slide.scss',
  templateUrl: './slide.html',
})
export class SkyAnimationSlideComponent {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #animationsDisabled = _skyAnimationsDisabled();

  public readonly slideDirection = input.required<SkyAnimationSlideDirection>();
  public readonly transitionEnd = output<void>();

  constructor() {
    effect(() => {
      const direction = this.slideDirection();
      const el = this.#elementRef.nativeElement;

      if (direction === 'out') {
        this.#renderer.removeClass(el, 'sky-animation-slide-in');
        this.#renderer.addClass(el, 'sky-animation-slide-out');
      } else {
        this.#renderer.removeClass(el, 'sky-animation-slide-out');
        this.#renderer.addClass(el, 'sky-animation-slide-in');
      }

      if (this.#animationsDisabled) {
        this.transitionEnd.emit();
      }
    });
  }

  protected onTransitionEnd(evt: TransitionEvent): void {
    if (evt.currentTarget === this.#elementRef.nativeElement) {
      this.transitionEnd.emit();
      evt.stopPropagation();
    }
  }
}
