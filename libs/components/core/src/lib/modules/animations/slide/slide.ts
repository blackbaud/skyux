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
    '[class.sky-animation-slide-in]': '!opened()',
    '[class.sky-animation-slide-out]': 'opened()',
  },
  hostDirectives: [
    {
      directive: SkyAnimationTransitionHandler,
      inputs: ['transitionSignal: opened'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-animation-slide',
  styleUrl: './slide.scss',
  template: '<div class="sky-animation-slide-content"><ng-content /></div>',
})
export class SkyAnimationSlideComponent {
  public readonly opened = input.required<boolean>();

  constructor() {
    inject(SkyAnimationTransitionHandler).cssPropertyToTrack('visibility');
  }
}
