import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyPagingModule } from '@skyux/lists';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValueFormatterParams,
} from 'ag-grid-community';
import { filter, map } from 'rxjs/operators';

import { ContextMenuComponent } from './context-menu.component';
import { AG_GRID_DEMO_DATA, AgGridDemoRow } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * @title Basic setup with paging (without data manager)
 */
@Component({
  selector: 'app-ag-grid-data-grid-paging-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule, SkyPagingModule],
})
export class AgGridDataGridPagingExampleComponent {
  protected currentPage = 1;
  protected readonly pageSize = 3;

  #columnDefs: ColDef[] = [
    {
      colId: 'context',
      maxWidth: 50,
      sortable: false,
      cellRenderer: ContextMenuComponent,
    },
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'age',
      headerName: 'Age',
      type: SkyCellType.Number,
      maxWidth: 60,
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      type: SkyCellType.Date,
      sort: 'asc',
    },
    {
      field: 'endDate',
      headerName: 'End date',
      type: SkyCellType.Date,
      valueFormatter: (params: ValueFormatterParams<AgGridDemoRow, Date>) =>
        this.#endDateFormatter(params),
    },
    {
      field: 'department',
      headerName: 'Department',
      type: SkyCellType.Autocomplete,
    },
    {
      field: 'jobTitle',
      headerName: 'Title',
      type: SkyCellType.Autocomplete,
    },
  ];

  protected gridData = AG_GRID_DEMO_DATA;
  protected gridOptions: GridOptions;

  #gridApi: GridApi | undefined;

  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #router = inject(Router);

  readonly #pageFromRoute = toSignal(
    this.#activatedRoute.queryParamMap.pipe(
      map((params) => Number(params.get('page') ?? '1')),
    ),
    { initialValue: 1 },
  );

  readonly #navigationEnd = toSignal(
    this.#router.events.pipe(filter((event) => event instanceof NavigationEnd)),
  );

  constructor() {
    const gridOptions: GridOptions = {
      columnDefs: this.#columnDefs,
      onGridReady: (gridReadyEvent): void => {
        this.onGridReady(gridReadyEvent);
      },
      rowSelection: { mode: 'singleRow' },
      pagination: true,
      suppressPaginationPanel: true,
      paginationPageSize: this.pageSize,
    };

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions,
    });

    effect(() => {
      const page = this.#pageFromRoute();
      this.currentPage = page;
      this.#gridApi?.paginationGoToPage(this.currentPage - 1);
    });

    effect(() => {
      this.#navigationEnd();
      const page = this.#activatedRoute.snapshot.paramMap.get('page');
      if (page) {
        this.currentPage = Number(page);
        this.#gridApi?.paginationGoToPage(this.currentPage - 1);
      }
    });
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#gridApi.paginationGoToPage(this.currentPage - 1);
  }

  protected async onPageChange(page: number): Promise<void> {
    await this.#router.navigate(['.'], {
      relativeTo: this.#activatedRoute,
      queryParams: { page: page.toString(10) },
      queryParamsHandling: 'merge',
    });
  }

  #endDateFormatter(params: ValueFormatterParams<AgGridDemoRow, Date>): string {
    return params.value
      ? params.value.toLocaleDateString('en-us', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : 'N/A';
  }
}
