import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { _SkyTransitionEndHandlerDirective } from '../shared/transition-handler';

/**
 * @internal
 *
 * Animates content open and closed using CSS grid `grid-template-rows`
 * transitions. Unlike `sky-animation-slide`, this component supports
 * a configurable `minHeight` for the collapsed state, allowing a
 * preview of the content to remain visible.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-animation-expand-opened]': 'opened()',
    '[class.sky-animation-expand-closed]': '!opened()',
    '[style.--sky-animation-expand-min-height]': 'minHeight()',
  },
  hostDirectives: [
    {
      directive: _SkyTransitionEndHandlerDirective,
      inputs: ['transitionTrigger: opened'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-animation-expand',
  styleUrl: './expand.scss',
  template: '<div class="sky-animation-expand-content"><ng-content /></div>',
})
export class _SkyAnimationExpandComponent {
  /**
   * Whether the content is expanded (`true`) or collapsed (`false`).
   */
  public readonly opened = input.required<boolean>();

  /**
   * The CSS `min-height` applied to the content wrapper in the
   * collapsed state. Accepts any valid CSS length value
   * (e.g. `'0'`, `'3em'`, `'48px'`).
   * @default '0'
   */
  public readonly minHeight = input<string>('0');

  constructor() {
    inject(_SkyTransitionEndHandlerDirective).setPropertyToTrack(
      'grid-template-rows',
    );
  }
}
