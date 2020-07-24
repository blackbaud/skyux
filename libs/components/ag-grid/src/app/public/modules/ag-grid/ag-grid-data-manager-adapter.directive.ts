import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  QueryList
} from '@angular/core';

import {
  Subject,
  Subscription
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  AgGridAngular
} from 'ag-grid-angular';

import {
  ColumnMovedEvent,
  RowSelectedEvent
} from 'ag-grid-community';

import {
  SkyDataManagerService,
  SkyDataManagerSortOption,
  SkyDataManagerState,
  SkyDataViewConfig
} from '@skyux/data-manager';

@Directive({
  selector: '[skyAgGridDataManagerAdapter]'
})
export class SkyAgGridDataManagerAdapterDirective implements AfterContentInit, OnDestroy {

  @Input()
  private viewId: string;

  @ContentChildren(AgGridAngular, { descendants: true })
  public agGridList: QueryList<AgGridAngular>;

  private currentAgGrid: AgGridAngular;
  private dataStateSub: Subscription;
  private viewConfig: SkyDataViewConfig;
  private ngUnsubscribe = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerSvc: SkyDataManagerService) { }

  public ngAfterContentInit(): void {
    this.viewConfig = this.dataManagerSvc.getViewById(this.viewId);
    this.checkForAgGrid();

    this.agGridList.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.checkForAgGrid());
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkForAgGrid(): void {
    const agGridCount = this.agGridList.length;

    /* istanbul ignore else */
    if (agGridCount > 1) {
      this.registerAgGrid();
      console.warn(
        'More than one ag-grid child component was found. Using the first ag-Grid.'
      );
    } else if (agGridCount === 0) {
      this.unregisterAgGrid();
    } else if (this.agGridList.first !== this.currentAgGrid) {
      this.registerAgGrid();
    }
  }

  private unregisterAgGrid(): void {
    this.currentAgGrid = undefined;

    /* istanbul ignore if */
    if (this.dataStateSub) {
      this.dataStateSub.unsubscribe();
    }
  }

  private registerAgGrid(): void {
    this.unregisterAgGrid();

    const agGrid = this.agGridList.first;

    this.currentAgGrid = agGrid;

    agGrid.gridReady
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.viewConfig.onSelectAllClick = this.selectAll.bind(this);
        this.viewConfig.onClearAllClick = this.clearAll.bind(this);

        this.dataManagerSvc.updateViewConfig(this.viewConfig);

        this.displayColumns(this.dataManagerSvc.getCurrentDataState());

        this.dataStateSub = this.dataManagerSvc.getDataStateUpdates(this.viewConfig.id)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((dataState: SkyDataManagerState) => {
            this.displayColumns(dataState);
          });

        agGrid.api.sizeColumnsToFit();
      });

    agGrid.columnMoved
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: ColumnMovedEvent) => {
        let columnOrder = agGrid.columnApi.getAllDisplayedVirtualColumns().map(
          col => col.getColDef().colId
        );

        if (event.source !== 'api') {
          const dataState = this.dataManagerSvc.getCurrentDataState();

          const viewState = dataState.getViewStateById(this.viewConfig.id);
          viewState.displayedColumnIds = columnOrder;

          this.dataManagerSvc.updateDataState(
            dataState.addOrUpdateView(this.viewConfig.id, viewState),
            this.viewConfig.id
          );
        }
      });

    agGrid.rowSelected
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: RowSelectedEvent) => {
        const row = event.node;
        let dataState = this.dataManagerSvc.getCurrentDataState();
        let selectedIds = dataState.selectedIds || [];
        const rowIndex = selectedIds.indexOf(row.data.id);

        if (row.isSelected() && rowIndex === -1) {
          selectedIds.push(row.data.id);
        } else if (!row.isSelected() && rowIndex !== -1) {
          selectedIds.splice(rowIndex, 1);
        }

        dataState.selectedIds = selectedIds;
        this.dataManagerSvc.updateDataState(dataState, this.viewConfig.id);
        this.changeDetector.markForCheck();
      });

    agGrid.sortChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        const gridSortModel = agGrid.api.getSortModel();
        const dataState = this.dataManagerSvc.getCurrentDataState();
        let sortOption: SkyDataManagerSortOption;

        /* istanbul ignore else */
        if (gridSortModel.length) {
          const activeSortModel = gridSortModel[0];
          const activeSortColumn = agGrid.columnApi.getColumn(activeSortModel.colId);
          const dataManagerConfig = this.dataManagerSvc.getCurrentDataManagerConfig();

          sortOption = dataManagerConfig.sortOptions.find((option: SkyDataManagerSortOption) => {
            return option.propertyName === activeSortColumn.getColDef().field &&
              option.descending === (activeSortModel.sort === 'desc');
          });
        }
        dataState.activeSortOption = sortOption;
        this.dataManagerSvc.updateDataState(dataState, this.viewConfig.id);
      });
  }

  private displayColumns(dataState: SkyDataManagerState): void {
    const agGrid = this.currentAgGrid;
    const viewState = dataState.getViewStateById(this.viewConfig.id);
    const displayedColumnIds = viewState.displayedColumnIds || [];
    const columns = agGrid.columnApi.getAllColumns();

    for (const column of columns) {
      const colId = column.getColId();
      const colIndex = displayedColumnIds.indexOf(colId);

      agGrid.columnApi.setColumnVisible(colId, colIndex !== -1);
      agGrid.columnApi.moveColumn(colId, colIndex);
    }
  }

  private selectAll(): void {
    const agGrid = this.agGridList.first;
    agGrid.api.selectAll();
  }

  private clearAll(): void {
    const agGrid = this.agGridList.first;
    agGrid.api.deselectAll();
  }

}
