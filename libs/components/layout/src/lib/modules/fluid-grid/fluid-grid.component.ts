import { Component, Input } from '@angular/core';

import { SkyFluidGridGutterSizeType } from './types/fluid-grid-gutter-size-type';

/**
 * Wraps the fluid grid to ensure proper spacing. Without the wrapper, the
 * alignment, padding, and margins do not behave as expected.
 */
@Component({
  selector: 'sky-fluid-grid',
  templateUrl: './fluid-grid.component.html',
  styleUrls: ['./fluid-grid.component.scss'],
})
export class SkyFluidGridComponent {
  /**
   * Disables the outer left and right margin of the fluid grid container.
   * @default false
   */
  @Input()
  public set disableMargin(value: boolean | undefined) {
    this.#_disableMargin = value ?? false;
  }

  public get disableMargin(): boolean {
    return this.#_disableMargin;
  }

  /**
   * Specifies a `SkyFluidGridGutterSizeType` to define the size of the padding
   * between columns.
   * @default "large"
   */
  @Input()
  public set gutterSize(value: SkyFluidGridGutterSizeType | undefined) {
    this.#_gutterSize = value ?? 'large';
  }

  public get gutterSize(): SkyFluidGridGutterSizeType {
    return this.#_gutterSize;
  }

  #_disableMargin = false;

  #_gutterSize: SkyFluidGridGutterSizeType = 'large';
}
