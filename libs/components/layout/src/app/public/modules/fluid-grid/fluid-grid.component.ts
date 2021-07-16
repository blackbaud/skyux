import {
  Component,
  Input
} from '@angular/core';

import {
  SkyFluidGridGutterSize
} from './fluid-grid-gutter-size';

/**
 * Wraps the fluid grid to ensure proper spacing. Without the wrapper, the
 * alignment, padding, and margins do not behave as expected.
 */
@Component({
  selector: 'sky-fluid-grid',
  templateUrl: './fluid-grid.component.html',
  styleUrls: [
    './fluid-grid.component.scss'
  ]
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
   * Specifies a `SkyFluidGridGutterSize` enum to define the size of the padding
   * between columns.
   * @default SkyFluidGridGutterSize.Large
   */
  @Input()
  public set gutterSize(value: SkyFluidGridGutterSize) {
    this._gutterSize = value;
  }

  public get gutterSize(): SkyFluidGridGutterSize {
    return this._gutterSize === undefined ? SkyFluidGridGutterSize.Large : this._gutterSize;
  }

  /**
   * @internal
   * Used for resolution of enum values in the template.
   */
  public gutterSizeTypes = SkyFluidGridGutterSize;

  private _disableMargin: boolean;

  private _gutterSize: SkyFluidGridGutterSize;

}
