import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SkyDocsPillColor } from './pill-color';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-rounded-corners sky-font-body-sm',
    '[class]': '"sky-docs-pill-color-" + color()',
  },
  imports: [],
  selector: 'sky-docs-pill',
  styles: `
    :host {
      display: inline-flex;
      padding: 4px 7px;
    }

    :host(.sky-docs-pill-color-blue) {
      background-color: var(--sky-category-color-blue);
    }

    :host(.sky-docs-pill-color-light-blue) {
      background-color: var(--sky-category-color-light-blue);
    }

    :host(.sky-docs-pill-color-orange) {
      background-color: var(--sky-category-color-orange);
    }

    :host(.sky-docs-pill-color-purple) {
      background-color: var(--sky-category-color-purple);
    }

    :host(.sky-docs-pill-color-red) {
      background-color: var(--sky-category-color-red);
    }

    :host(.sky-docs-pill-color-teal) {
      background-color: var(--sky-category-color-teal);
    }

    :host(.sky-docs-pill-color-yellow) {
      background-color: var(--sky-category-color-yellow);
    }
  `,
  template: `<ng-content />`,
})
export class SkyDocsPillComponent {
  public color = input.required<SkyDocsPillColor>();
}
