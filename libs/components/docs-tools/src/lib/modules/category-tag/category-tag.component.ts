import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SkyDocsCategoryColor } from './category-color';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-rounded-corners',
    '[class]': '"sky-docs-category-tag-color-" + color()',
  },
  selector: 'sky-docs-category-tag',
  styleUrl: './category-tag.component.scss',
  template: '<ng-content />',
})
export class SkyDocsCategoryTagComponent {
  public readonly color = input.required<SkyDocsCategoryColor>();
}
