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

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(transitionend)': 'onTransitionEnd($event)',
  },
  selector: 'sky-animation-emerge',
  styleUrl: './emerge.scss',
  template: '<ng-content />',
})
export class SkyAnimationEmergeComponent {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #animationsDisabled = _skyAnimationsDisabled();

  public readonly visible = input.required<boolean>();
  public readonly transitionEnd = output<void>();

  constructor() {
    effect(() => {
      const visible = this.visible();
      const el = this.#elementRef.nativeElement;

      if (visible) {
        this.#renderer.addClass(el, 'sky-animation-emerge-visible');
      } else {
        this.#renderer.removeClass(el, 'sky-animation-emerge-visible');
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
