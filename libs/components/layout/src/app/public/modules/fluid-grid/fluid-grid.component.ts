import {
  Component,
  Input
} from '@angular/core';

import {
  SkyFluidGridGutterSize
} from './fluid-grid-gutter-size';

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
   * Defines the size of the padding between each column.
   * @default SkyFluidGridGutterSize.Large
   */
  @Input()
  public set gutterSize(value: SkyFluidGridGutterSize) {
    this._gutterSize = value;
  }

  public get gutterSize(): SkyFluidGridGutterSize {
    return this._gutterSize || SkyFluidGridGutterSize.Large;
  }

  /**
   * @internal
   * Used for resolution of enum values in the template.
   */
  public gutterSizeTypes = SkyFluidGridGutterSize;

  private _disableMargin: boolean;

  private _gutterSize: SkyFluidGridGutterSize;

}
