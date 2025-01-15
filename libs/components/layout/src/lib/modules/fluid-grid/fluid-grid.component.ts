import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

import { SkyFluidGridGutterSizeType } from './types/fluid-grid-gutter-size-type';

const DEFAULT_GUTTER_SIZE: SkyFluidGridGutterSizeType = 'large';

/**
 * Wraps the fluid grid to ensure proper spacing. Without the wrapper, the
 * alignment, padding, and margins do not behave as expected.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-fluid-grid',
    '[class]': "'sky-fluid-grid-gutter-size-' + gutterSize()",
    '[class.sky-fluid-grid-no-margin]': 'disableMargin()',
  },
  selector: 'sky-fluid-grid',
  template: '<ng-content />',
  styleUrl: './fluid-grid.component.scss',
})
export class SkyFluidGridComponent {
  /**
   * Disables the outer left and right margin of the fluid grid container.
   */
  public disableMargin = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The type that defines the size of the padding
   * between columns.
   */
  public gutterSize = input<
    SkyFluidGridGutterSizeType,
    SkyFluidGridGutterSizeType | undefined
  >(DEFAULT_GUTTER_SIZE, {
    transform: (value) => value ?? DEFAULT_GUTTER_SIZE,
  });
}
