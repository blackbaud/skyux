import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SkyPillColor } from './pill-color';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-rounded-corners',
    '[class]': '"sky-pill-color-" + color()',
  },
  selector: 'sky-pill',
  styles: `
    :host {
      display: inline-flex;
      padding: 3px 7px;
      background-color: var(--sky-pill-background-color);
    }

    :host(.sky-pill-color-blue) {
      --sky-pill-background-color: var(--sky-category-color-blue);
    }

    :host(.sky-pill-color-light-blue) {
      --sky-pill-background-color: var(--sky-category-color-light-blue);
    }

    :host(.sky-pill-color-orange) {
      --sky-pill-background-color: var(--sky-category-color-orange);
    }

    :host(.sky-pill-color-purple) {
      --sky-pill-background-color: var(--sky-category-color-purple);
    }

    :host(.sky-pill-color-red) {
      --sky-pill-background-color: var(--sky-category-color-red);
    }

    :host(.sky-pill-color-teal) {
      --sky-pill-background-color: var(--sky-category-color-teal);
    }

    :host(.sky-pill-color-yellow) {
      --sky-pill-background-color: var(--sky-category-color-yellow);
    }
  `,
  template: `<ng-content />`,
})
export class SkyPillComponent {
  public color = input.required<SkyPillColor>();
}
