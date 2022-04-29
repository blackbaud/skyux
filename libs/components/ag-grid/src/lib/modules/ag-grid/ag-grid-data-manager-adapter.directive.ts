import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerSortOption,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { AgGridAngular } from 'ag-grid-angular';
import {
  ColumnApi,
  ColumnMovedEvent,
  ColumnState,
  DragStartedEvent,
  DragStoppedEvent,
  RowSelectedEvent,
} from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';

/**
 * @internal
 */
@Directive({
  selector: '[skyAgGridDataManagerAdapter]',
})
export class SkyAgGridDataManagerAdapterDirective
  implements AfterContentInit, OnDestroy
{
  @Input()
  public viewId: string;

  @ContentChildren(AgGridAngular, { descendants: true })
  public agGridList: QueryList<AgGridAngular>;

  @ContentChildren(SkyAgGridWrapperComponent, { descendants: true })
  public skyAgGridWrapperList: QueryList<SkyAgGridWrapperComponent>;

  private currentAgGrid: AgGridAngular;
  private currentDataState: SkyDataManagerState;
  private currentSkyAgGridWrapper: SkyAgGridWrapperComponent;
  private dataStateSub: Subscription;
  private viewConfig: SkyDataViewConfig;
  private ngUnsubscribe = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerSvc: SkyDataManagerService
  ) {}

  public ngAfterContentInit(): void {
    this.dataManagerSvc.setViewkeeperClasses(this.viewId, ['.ag-header']);

    this.viewConfig = this.dataManagerSvc.getViewById(this.viewId);
    this.checkForAgGrid();
    this.checkForSkyAgGridWrapper();

    this.agGridList.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.checkForAgGrid());

    this.skyAgGridWrapperList.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.checkForSkyAgGridWrapper());
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkForAgGrid(): void {
    const agGridCount = this.agGridList.length;

    /* istanbul ignore else */
    if (agGridCount === 0) {
      this.unregisterAgGrid();
    } else if (this.agGridList.first !== this.currentAgGrid) {
      this.registerAgGrid();
    }

    if (agGridCount > 1) {
      console.warn(
        'More than one ag-grid child component was found. Using the first ag-Grid.'
      );
    }
  }

  private checkForSkyAgGridWrapper(): void {
    const skyAgGridWrapperCount = this.skyAgGridWrapperList.length;

    /* istanbul ignore else */
    if (skyAgGridWrapperCount === 0) {
      this.unregisterSkyAgGridWrapper();
    } else if (
      this.skyAgGridWrapperList.first !== this.currentSkyAgGridWrapper
    ) {
      this.registerSkyAgGridWrapper();
    }

    if (skyAgGridWrapperCount > 1) {
      console.warn(
        'More than one ag-grid child component was found. Using the first ag-Grid.'
      );
    }
  }

  private unregisterAgGrid(): void {
    this.currentAgGrid = undefined;

    /* istanbul ignore if */
    if (this.dataStateSub) {
      this.dataStateSub.unsubscribe();
    }
  }

  private unregisterSkyAgGridWrapper(): void {
    this.currentSkyAgGridWrapper = undefined;
  }

  private registerSkyAgGridWrapper(): void {
    this.unregisterSkyAgGridWrapper();

    this.currentSkyAgGridWrapper = this.skyAgGridWrapperList.first;

    setTimeout(() => {
      if (this.currentSkyAgGridWrapper) {
        this.currentSkyAgGridWrapper.viewkeeperClasses = [];
      }
    });
  }

  private registerAgGrid(): void {
    this.unregisterAgGrid();

    const agGrid = this.agGridList.first;

    this.currentAgGrid = agGrid;

    agGrid.gridReady.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.viewConfig.onSelectAllClick = this.selectAll.bind(this);
      this.viewConfig.onClearAllClick = this.clearAll.bind(this);

      this.dataManagerSvc.updateViewConfig(this.viewConfig);

      this.dataStateSub = this.dataManagerSvc
        .getDataStateUpdates(this.viewConfig.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((dataState: SkyDataManagerState) => {
          this.currentDataState = dataState;
          this.displayColumns(dataState);
        });

      agGrid.api.sizeColumnsToFit();
    });

    agGrid.columnMoved
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(
          (event: ColumnMovedEvent) =>
            ![
              'gridInitializing',
              'uiColumnResized',
              'uiColumnDragged',
              'api',
            ].includes(event.source)
        )
      )
      .subscribe((value: ColumnMovedEvent) => {
        this.updateColumnsInCurrentDataState(value.columnApi);
      });
    let currentColumns: string[];
    agGrid.dragStarted
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: DragStartedEvent) => {
        currentColumns = this.getColumnOrder(value.columnApi);
      });
    agGrid.dragStopped
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: DragStoppedEvent) => {
        const newColumns = this.getColumnOrder(value.columnApi);
        const hasChanged = currentColumns.findIndex(
          (colId, i) => colId !== newColumns[i]
        );
        if (hasChanged > -1) {
          this.updateColumnsInCurrentDataState(value.columnApi);
        }
      });

    agGrid.rowSelected
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: RowSelectedEvent) => {
        const row = event.node;
        const selectedIds = this.currentDataState.selectedIds || [];
        const rowIndex = selectedIds.indexOf(row.data.id);

        if (row.isSelected() && rowIndex === -1) {
          selectedIds.push(row.data.id);
        } else if (!row.isSelected() && rowIndex !== -1) {
          selectedIds.splice(rowIndex, 1);
        }

        this.currentDataState.selectedIds = selectedIds;
        this.dataManagerSvc.updateDataState(
          this.currentDataState,
          this.viewConfig.id
        );
        this.changeDetector.markForCheck();
      });

    agGrid.sortChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      const gridColumnStates: ColumnState[] = agGrid.columnApi.getColumnState();
      let sortOption: SkyDataManagerSortOption;

      /* istanbul ignore else */
      if (gridColumnStates.length) {
        const activeSortColumnState = gridColumnStates.find(
          (aGridColumnState) => aGridColumnState.sortIndex === 0
        );

        const dataManagerConfig =
          this.dataManagerSvc.getCurrentDataManagerConfig();

        /* istanbul ignore else */
        if (dataManagerConfig.sortOptions && activeSortColumnState) {
          sortOption = dataManagerConfig.sortOptions.find(
            (option: SkyDataManagerSortOption) => {
              return (
                option.propertyName === activeSortColumnState.colId &&
                option.descending === (activeSortColumnState.sort === 'desc')
              );
            }
          );
        } else {
          sortOption = undefined;
        }
      }
      this.currentDataState.activeSortOption = sortOption;
      this.dataManagerSvc.updateDataState(
        this.currentDataState,
        this.viewConfig.id
      );
    });
  }

  private updateColumnsInCurrentDataState(columnApi: ColumnApi) {
    const columnOrder = this.getColumnOrder(columnApi);

    const viewState = this.currentDataState.getViewStateById(
      this.viewConfig.id
    );
    viewState.displayedColumnIds = columnOrder;

    this.dataManagerSvc.updateDataState(
      this.currentDataState.addOrUpdateView(this.viewConfig.id, viewState),
      this.viewConfig.id
    );
  }

  private getColumnOrder(columnApi: ColumnApi): string[] {
    return columnApi
      .getAllGridColumns()
      .filter((col) => col.isVisible())
      .map((col) => col.getColDef().colId);
  }

  private displayColumns(dataState: SkyDataManagerState): void {
    const agGrid = this.currentAgGrid;
    const viewState = dataState.getViewStateById(this.viewConfig.id);
    let displayedColumnIds: string[] = [];
    /*istanbul ignore else*/
    if (viewState.displayedColumnIds) {
      displayedColumnIds = viewState.displayedColumnIds;
    }
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
