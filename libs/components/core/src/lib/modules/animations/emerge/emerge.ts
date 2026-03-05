import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { _SkyAnimationTransitionHandler } from '../shared/transition-handler';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-animation-emerge-visible]': 'visible()',
  },
  hostDirectives: [
    {
      directive: _SkyAnimationTransitionHandler,
      inputs: ['transitionSignal: visible'],
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
    inject(_SkyAnimationTransitionHandler).cssPropertyToTrack('opacity');
  }
}
