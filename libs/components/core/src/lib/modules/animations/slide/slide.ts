import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

import { skyAnimationsDisabled } from '../utility/animations-disabled';
import { setupNoopTransitionEnd } from '../utility/setup-noop-transition-end';

import { SkyAnimationSlideDirection } from './slide-direction';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-animation-slide-in]': 'slideDirection() !== "out"',
    '[class.sky-animation-slide-out]': 'slideDirection() === "out"',
    '(transitionend)': 'onTransitionEnd($event)',
  },
  selector: 'sky-animation-slide',
  styleUrl: './slide.scss',
  templateUrl: './slide.html',
})
export class SkyAnimationSlideComponent {
  readonly #elementRef = inject(ElementRef);

  public readonly slideDirection = input.required<SkyAnimationSlideDirection>();
  public readonly transitionEnd = output<void>();

  constructor() {
    if (skyAnimationsDisabled()) {
      setupNoopTransitionEnd(this.slideDirection, this.transitionEnd);
    }
  }

  protected onTransitionEnd(evt: TransitionEvent): void {
    if (
      evt.currentTarget === this.#elementRef.nativeElement &&
      evt.propertyName === 'visibility'
    ) {
      this.transitionEnd.emit();
      evt.stopPropagation();
    }
  }
}
