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

  public readonly visible = input.required<boolean>();
  public readonly transitionEnd = output<void>();

  constructor() {
    if (skyAnimationsDisabled()) {
      setupNoopTransitionEnd(this.visible, this.transitionEnd);
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
