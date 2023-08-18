import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { SkyCellRendererDateParams } from '../../types/cell-renderer-date-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-date-validator',
  templateUrl: 'cell-renderer-date-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridCellRendererDateValidatorComponent
  implements ICellRendererAngularComp
{
  @Input()
  public set parameters(value: SkyCellRendererDateParams) {
    this.agInit(value);
  }

  protected cellRendererParams: SkyCellRendererDateParams | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  /**
   * agInit is called by agGrid once after the renderer is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellRendererDateParams): void {
    this.cellRendererParams = params;
    this.#changeDetector.markForCheck();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public isDate(value: any): boolean {
    return value instanceof Date || typeof value === 'string';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public refresh(params: SkyCellRendererDateParams): boolean {
    return false;
  }
}
