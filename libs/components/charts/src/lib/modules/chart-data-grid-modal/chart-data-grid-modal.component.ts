import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';

import { SkyChartSeries } from '../shared/chart-types';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { SkyChartGridModalContext } from './chart-data-grid-modal-context';

ModuleRegistry.registerModules([AllCommunityModule]);

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

  readonly #categories = signal<string[]>(this.#context.categories);
  readonly #series = signal<SkyChartSeries[]>(this.#context.series);

  protected readonly categoryHeaderName = toSignal(
    this.#resources.getString('chart_data_grid.category_column_name'),
    { initialValue: 'Category' },
  );

  protected readonly gridOptions: GridOptions;
  protected readonly columnDefs = computed(() => {
    const series = this.#series();
    return this.#buildColumnDefs(series);
  });
  protected readonly rowData = computed(() => {
    const categories = this.#categories();
    const series = this.#series();
    return this.#buildRowData(categories, series);
  });

  #gridApi: GridApi | undefined;

  constructor() {
    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        defaultColDef: { lockPinned: true },
        onGridReady: this.#onGridReady.bind(this),
      },
    });

    // Update grid when data changes (also handles initial load)
    effect(() => {
      const cols = this.columnDefs();
      const rows = this.rowData();

      if (this.#gridApi) {
        this.#gridApi.setGridOption('columnDefs', cols);
        this.#gridApi.setGridOption('rowData', rows);
      }
    });
  }

  public close(): void {
    this.#instance.close();
  }

  #onGridReady(params: GridReadyEvent): void {
    this.#gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  #buildColumnDefs(series: SkyChartSeries[]): ColDef[] {
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
    categories: string[],
    series: SkyChartSeries[],
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
  category: string;
  [key: string]: string | number;
}
