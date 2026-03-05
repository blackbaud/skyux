import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { SkyAnimationTransitionHandler } from '../shared/transition-handler';

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
      directive: SkyAnimationTransitionHandler,
      inputs: ['transitionSignal: visible'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-animation-emerge',
  styleUrl: './emerge.scss',
  template: '<ng-content />',
})
export class SkyAnimationEmergeComponent {
  public readonly visible = input.required<boolean>();

  constructor() {
    inject(SkyAnimationTransitionHandler).cssPropertyToTrack('opacity');
  }
}
