import { Component, Input } from '@angular/core';

import { SkyFluidGridGutterSize } from './fluid-grid-gutter-size';

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
  public set disableMargin(value: boolean) {
    this._disableMargin = value;
  }

  public get disableMargin(): boolean {
    return this._disableMargin || false;
  }

  /**
   * Specifies a `SkyFluidGridGutterSizeType` to define the size of the padding
   * between columns. Options include: `any`, `1`, `2`, `"small"`, `"medium"`, and `"large"`.
   * @default "large"
   */
  @Input()
  public set gutterSize(value: SkyFluidGridGutterSizeType) {
    this._gutterSize = value;
  }

  public get gutterSize(): SkyFluidGridGutterSizeType {
    return this._gutterSize === undefined ? 'large' : this._gutterSize;
  }

  /**
   * @internal
   */
  public get gutterSizeResolved(): SkyFluidGridGutterSizeType {
    // Before this change, the template did a `==` comparison, implicitly converting numerical
    // string values to their numeric values before comparing them. Checking for the numerical
    // string value in addition to the values allowed by the type maintains this behavior.
    switch (this.gutterSize) {
      case 'medium':
      case SkyFluidGridGutterSize.Medium:
      case SkyFluidGridGutterSize.Medium.toString():
        return 'medium';
      case 'small':
      case SkyFluidGridGutterSize.Small:
      case SkyFluidGridGutterSize.Small.toString():
        return 'small';
      default:
        return 'large';
    }
  }

  private _disableMargin: boolean;

  private _gutterSize: SkyFluidGridGutterSizeType;
}
