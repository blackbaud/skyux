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

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-animation-emerge-visible]': 'visible()',
    '(transitionend)': 'onTransitionEnd($event)',
  },
  selector: 'sky-animation-emerge',
  styleUrl: './emerge.scss',
  template: '<ng-content />',
})
export class SkyAnimationEmergeComponent {
  readonly #elementRef = inject(ElementRef);
  readonly #animationsDisabled = _skyAnimationsDisabled();

  public readonly visible = input.required<boolean>();
  public readonly transitionEnd = output<void>();

  constructor() {
    // When animations are disabled, the native `transitionend` event is not
    // emitted. Emit the event manually when visibility changes.
    if (this.#animationsDisabled) {
      effect(() => {
        this.visible();
        this.transitionEnd.emit();
      });
    }
  }

  protected onTransitionEnd(evt: TransitionEvent): void {
    if (
      evt.currentTarget === this.#elementRef.nativeElement &&
      evt.propertyName === 'opacity'
    ) {
      this.transitionEnd.emit();
      evt.stopPropagation();
    }
  }
}
