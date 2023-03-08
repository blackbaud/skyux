import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { SKY_AG_GRID_DEMO_DATA } from './data-grid-paging-demo-data';

@Component({
  selector: 'app-data-grid-paging-demo',
  templateUrl: './data-grid-paging-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridPagingDemoComponent implements OnInit, OnDestroy {
  public currentPage = 1;

  public readonly pageSize = 3;
  public columnDefs: ColDef[] = [
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
      valueFormatter: this.endDateFormatter,
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

  public gridApi: GridApi | undefined;
  public gridData = SKY_AG_GRID_DEMO_DATA;
  public gridOptions: GridOptions;
  public searchText = '';

  #subscriptions = new Subscription();

  constructor(
    private agGridService: SkyAgGridService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      onGridReady: (gridReadyEvent): void => this.onGridReady(gridReadyEvent),
      rowSelection: 'single',
      pagination: true,
      suppressPaginationPanel: true,
      paginationPageSize: this.pageSize,
    };
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: this.gridOptions,
    });
  }

  public ngOnInit(): void {
    this.#subscriptions.add(
      this.activatedRoute.queryParamMap
        .pipe(map((params) => params.get('page') || '1'))
        .subscribe((page) => {
          this.currentPage = Number(page);
          this.gridApi?.paginationGoToPage(this.currentPage - 1);
          this.changeDetector.detectChanges();
        })
    );
    this.#subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const page = this.activatedRoute.snapshot.paramMap.get('page');
          if (page) {
            this.currentPage = Number(page);
          }
          this.gridApi?.paginationGoToPage(this.currentPage - 1);
          this.changeDetector.detectChanges();
        })
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.paginationGoToPage(this.currentPage - 1);
  }

  public onPageChange(page: number): void {
    this.router
      .navigate(['.'], {
        relativeTo: this.activatedRoute,
        queryParams: { page: page.toString(10) },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  private endDateFormatter(params: ValueFormatterParams): string {
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return params.value
      ? params.value.toLocaleDateString('en-us', dateConfig)
      : 'N/A';
  }
}
