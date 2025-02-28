import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SkyDocsPillColor } from './pill-color';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-rounded-corners',
    '[class]': '"sky-docs-pill-color-" + color()',
  },
  selector: 'sky-docs-pill',
  styleUrl: './pill.component.scss',
  template: '<ng-content />',
})
export class SkyDocsPillComponent {
  public readonly color = input.required<SkyDocsPillColor>();
}
