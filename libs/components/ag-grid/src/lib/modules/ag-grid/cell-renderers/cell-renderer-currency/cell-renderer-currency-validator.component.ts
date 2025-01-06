import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

import { SkyCellRendererCurrencyParams } from '../../types/cell-renderer-currency-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-cell-renderer-currency-validator',
  templateUrl: 'cell-renderer-currency-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyAgGridCellRendererCurrencyValidatorComponent
  implements ICellRendererAngularComp
{
  @Input()
  public set parameters(value: SkyCellRendererCurrencyParams) {
    this.agInit(value);
  }

  protected cellRendererParams: SkyCellRendererCurrencyParams | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  /**
   * agInit is called by agGrid once after the renderer is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellRendererCurrencyParams): void {
    this.cellRendererParams = params;
    this.#changeDetector.markForCheck();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public refresh(params: SkyCellRendererCurrencyParams): boolean {
    return false;
  }
}
