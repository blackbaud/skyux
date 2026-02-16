import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { AgGridAngular } from 'ag-grid-angular';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColumnApiModule,
  ColumnAutoSizeModule,
  EventApiModule,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  RowStyleModule,
  ValidationModule,
} from 'ag-grid-community';

import { SkyChartDataPoint, SkyChartSeries } from '../shared/chart-types';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { SkyChartGridModalContext } from './chart-data-grid-modal-context';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
  CellStyleModule,
  EventApiModule,
  ColumnAutoSizeModule,
  RowStyleModule,
  ColumnApiModule,
  RowApiModule,
  ValidationModule,
]);

@Component({
  selector: 'sky-chart-data-grid-modal',
  templateUrl: 'chart-data-grid-modal.component.html',
  styleUrl: 'chart-data-grid-modal.component.scss',
  imports: [
    SkyChartsResourcesModule,
    SkyModalModule,
    AgGridAngular,
    SkyAgGridModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartDataGridModalComponent {
  // #region Dependency Injection
  readonly #context = inject(SkyChartGridModalContext);
  readonly #instance = inject(SkyModalInstance);
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #resources = inject(SkyLibResourcesService);
  // #endregion

  public readonly title = this.#context.modalTitle;

  readonly #categories = this.#context.categories;
  readonly #series = this.#context.series;

  protected readonly categoryHeaderName = toSignal(
    this.#resources.getString('chart_data_grid.category_column_name'),
    { initialValue: 'Category' },
  );

  protected readonly gridOptions = this.#agGridSvc.getGridOptions({
    gridOptions: {
      defaultColDef: { lockPinned: true },
      columnDefs: this.#buildColumnDefs(this.#series),
      rowData: this.#buildRowData(this.#categories, this.#series),
      onGridReady: this.#onGridReady.bind(this),
    },
  });

  public close(): void {
    this.#instance.close();
  }

  #onGridReady(params: GridReadyEvent): void {
    params.api.sizeColumnsToFit();
  }

  #buildColumnDefs(
    series: readonly SkyChartSeries<SkyChartDataPoint>[],
  ): ColDef[] {
    const columns: ColDef[] = [
      {
        field: 'category',
        headerName: this.categoryHeaderName(),
        pinned: 'left',
      },
    ];

    // Add a column for each series
    series.forEach((seriesItem) => {
      columns.push({
        field: seriesItem.label,
        headerName: seriesItem.label,
        minWidth: 120,
      });
    });

    return columns;
  }

  #buildRowData(
    categories: readonly (string | number)[],
    series: readonly SkyChartSeries<SkyChartDataPoint>[],
  ): ChartDataGridRow[] {
    const rows: ChartDataGridRow[] = [];

    // Create a row for each category
    categories.forEach((category, categoryIndex) => {
      const row: ChartDataGridRow = { category };

      // Add data from each series for this category
      series.forEach((seriesItem) => {
        const dataPoint = seriesItem.data[categoryIndex];
        const fieldName = seriesItem.label;
        row[fieldName] = dataPoint.label;
      });

      rows.push(row);
    });

    return rows;
  }
}

interface ChartDataGridRow {
  /** The category for this row. */
  category: string | number;

  /**
   * Key: the series' label
   * Value: the data point's label
   */
  [key: string]: string | number;
}
