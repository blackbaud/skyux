import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  NumericOptions
} from '@skyux/core';

import {
  ICellRendererAngularComp
} from 'ag-grid-angular';

import {
  SkyCellRendererCurrencyParams
} from '../../types/cell-renderer-currency-params';

@Component({
  selector: 'sky-ag-grid-cell-renderer-currency',
  templateUrl: './cell-renderer-currency.component.html',
  styleUrls: ['./cell-renderer-currency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SkyAgGridCellRendererCurrencyComponent implements ICellRendererAngularComp {
  public value: number;
  public skyComponentProperties: NumericOptions = {};
  public columnHeader: string;
  public columnWidth: number;
  public rowHeightWithoutBorders: number;
  public rowNumber: number;

  private params: SkyCellRendererCurrencyParams;

  /**
   * agInit is called by agGrid once after the renderer is created and provides the renderer with the information it needs.
   * @param params The cell renderer params that include data about the cell, column, row, and grid.
   */
  public agInit(params: SkyCellRendererCurrencyParams) {
    this.params = params;
    this.value = this.params.value;
    this.columnHeader = this.params.colDef && this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;
    this.columnWidth = this.params.column.getActualWidth();
    this.rowHeightWithoutBorders = this.params.node && this.params.node.rowHeight - 4;
    this.skyComponentProperties = this.params.skyComponentProperties || {};
    this.skyComponentProperties.format = 'currency';
    this.skyComponentProperties.minDigits = 2;
  }

  public refresh(): boolean {
    return false;
  }
}
