import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
  readonly #animationsDisabled = _skyAnimationsDisabled();

  public readonly slideDirection = input.required<SkyAnimationSlideDirection>();
  public readonly transitionEnd = output<void>();

  constructor() {
    // When animations are disabled, the native `transitionend` event is not
    // emitted. Emit the event manually when the slide direction changes.
    if (this.#animationsDisabled) {
      effect(() => {
        this.slideDirection();
        this.transitionEnd.emit();
      });
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
