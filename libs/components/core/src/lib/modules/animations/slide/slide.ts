import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { _SkyAnimationTransitionHandler } from '../shared/transition-handler';

/**
 * @internal
 *
 * Animates content open and closed by sliding the host element's
 * height.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-animation-slide-in]': '!opened()',
    '[class.sky-animation-slide-out]': 'opened()',
  },
  hostDirectives: [
    {
      directive: _SkyAnimationTransitionHandler,
      inputs: ['transitionSignal: opened'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-animation-slide',
  styleUrl: './slide.scss',
  template: '<div class="sky-animation-slide-content"><ng-content /></div>',
})
export class _SkyAnimationSlideComponent {
  public readonly opened = input.required<boolean>();

  constructor() {
    inject(_SkyAnimationTransitionHandler).cssPropertyToTrack('visibility');
  }
}
