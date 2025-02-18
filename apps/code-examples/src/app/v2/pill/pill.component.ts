import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkyPillCategoryType } from './pill-category-type';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-rounded-corners sky-font-body-sm',
    '[class]': '"sky-pill-category-" + categoryType()',
  },
  imports: [],
  selector: 'sky-pill',
  styles: `
    :host {
      display: inline-block;
      padding: 2px 7px;
      margin-top: -2px;
      margin-bottom: -2px;
      vertical-align: baseline;
    }

    :host(.sky-pill-category-blue) {
      background-color: var(--sky-category-color-blue);
    }

    :host(.sky-pill-category-light-blue) {
      background-color: var(--sky-category-color-light-blue);
    }

    :host(.sky-pill-category-orange) {
      background-color: var(--sky-category-color-orange);
    }

    :host(.sky-pill-category-purple) {
      background-color: var(--sky-category-color-purple);
    }

    :host(.sky-pill-category-red) {
      background-color: var(--sky-category-color-red);
    }

    :host(.sky-pill-category-teal) {
      background-color: var(--sky-category-color-teal);
    }

    :host(.sky-pill-category-yellow) {
      background-color: var(--sky-category-color-yellow);
    }
  `,
  template: `{{ textContent() }}`,
})
export class SkyPillComponent {
  public textContent = input.required<string>();
  public categoryType = input.required<SkyPillCategoryType>();
}
