import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { _SkyAnimationTransitionHandlerDirective } from '../shared/transition-handler';

/**
 * @internal
 *
 * Animates content in and out by transitioning the host element's
 * `opacity` and `scale`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-animation-emerge-visible]': 'visible()',
  },
  hostDirectives: [
    {
      directive: _SkyAnimationTransitionHandlerDirective,
      inputs: ['transitionTrigger: visible'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-animation-emerge',
  styleUrl: './emerge.scss',
  template: '<ng-content />',
})
export class _SkyAnimationEmergeComponent {
  public readonly visible = input.required<boolean>();

  constructor() {
    inject(_SkyAnimationTransitionHandlerDirective).cssPropertyToTrack(
      'opacity',
    );
  }
}
