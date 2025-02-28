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
      padding: 5px 10px;
      background-color: var(--sky-pill-background-color);
      // box-shadow: inset 0 0 0 2px
      //   color-mix(
      //     in srgb,
      //     var(--sky-pill-background-color) 95%,
      //     var(--sky-text-color-default)
      //   );
      // color: color-mix(
      //   in srgb,
      //   var(--sky-pill-background-color) 15%,
      //   var(--sky-text-color-default)
      // );
      color: var(--sky-text-color-default);

      // box-shadow:
      //   0 1px 1px rgba(255, 255, 255, 0.25),
      //   0 1px 0px rgba(0, 0, 0, 0.075) inset;
      // text-shadow: 0px 1px 0 rgba(255, 255, 255, 0.075);
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
