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
  public viewId: string | undefined;

  @ContentChildren(AgGridAngular, { descendants: true })
  public agGridList: QueryList<AgGridAngular> | undefined;

  @ContentChildren(SkyAgGridWrapperComponent, { descendants: true })
  public skyAgGridWrapperList: QueryList<SkyAgGridWrapperComponent> | undefined;

  #currentAgGrid: AgGridAngular | undefined;
  #currentDataState: SkyDataManagerState | undefined;
  #currentSkyAgGridWrapper: SkyAgGridWrapperComponent | undefined;
  #dataStateSub: Subscription | undefined;
  #viewConfig: SkyDataViewConfig | undefined;
  #ngUnsubscribe = new Subject<void>();
  #changeDetector: ChangeDetectorRef;
  #dataManagerSvc: SkyDataManagerService;

  constructor(
    changeDetector: ChangeDetectorRef,
    dataManagerSvc: SkyDataManagerService
  ) {
    this.#changeDetector = changeDetector;
    this.#dataManagerSvc = dataManagerSvc;
  }

  public ngAfterContentInit(): void {
    if (this.viewId) {
      this.#dataManagerSvc.setViewkeeperClasses(this.viewId, ['.ag-header']);
      this.#viewConfig = this.#dataManagerSvc.getViewById(this.viewId);

      this.#checkForAgGrid();
      this.#checkForSkyAgGridWrapper();

      this.agGridList?.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => this.#checkForAgGrid());

      this.skyAgGridWrapperList?.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => this.#checkForSkyAgGridWrapper());
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #checkForAgGrid(): void {
    if (this.agGridList) {
      const agGridCount = this.agGridList.length;

      /* istanbul ignore else */
      if (agGridCount === 0) {
        this.#unregisterAgGrid();
      } else if (this.agGridList.first !== this.#currentAgGrid) {
        this.#registerAgGrid();
      }

      if (agGridCount > 1) {
        console.warn(
          'More than one ag-grid child component was found. Using the first ag-Grid.'
        );
      }
    }
  }

  #checkForSkyAgGridWrapper(): void {
    if (this.skyAgGridWrapperList) {
      const skyAgGridWrapperCount = this.skyAgGridWrapperList.length;

      /* istanbul ignore else */
      if (skyAgGridWrapperCount === 0) {
        this.#unregisterSkyAgGridWrapper();
      } else if (
        this.skyAgGridWrapperList.first !== this.#currentSkyAgGridWrapper
      ) {
        this.#registerSkyAgGridWrapper();
      }

      if (skyAgGridWrapperCount > 1) {
        console.warn(
          'More than one ag-grid child component was found. Using the first ag-Grid.'
        );
      }
    }
  }

  #unregisterAgGrid(): void {
    this.#currentAgGrid = undefined;

    /* istanbul ignore if */
    if (this.#dataStateSub) {
      this.#dataStateSub.unsubscribe();
    }
  }

  #unregisterSkyAgGridWrapper(): void {
    this.#currentSkyAgGridWrapper = undefined;
  }

  #registerSkyAgGridWrapper(): void {
    this.#unregisterSkyAgGridWrapper();
    this.#currentSkyAgGridWrapper = this.skyAgGridWrapperList?.first;

    setTimeout(() => {
      if (this.#currentSkyAgGridWrapper) {
        this.#currentSkyAgGridWrapper.viewkeeperClasses = [];
      }
    });
  }

  #registerAgGrid(): void {
    this.#unregisterAgGrid();

    const agGrid = this.agGridList?.first;

    this.#currentAgGrid = agGrid;

    if (agGrid) {
      agGrid.gridReady.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        if (this.#viewConfig && this.viewId) {
          this.#viewConfig.onSelectAllClick = this.#selectAll.bind(this);
          this.#viewConfig.onClearAllClick = this.#clearAll.bind(this);
          this.#dataManagerSvc.updateViewConfig(this.#viewConfig);
          this.#dataStateSub = this.#dataManagerSvc
            .getDataStateUpdates(this.#viewConfig.id)
            .pipe(takeUntil(this.#ngUnsubscribe))
            .subscribe((dataState: SkyDataManagerState) => {
              this.#currentDataState = dataState;
              this.#displayColumns(dataState);
            });

          if (agGrid.gridOptions.context?.enableTopScroll) {
            this.#dataManagerSvc.setViewkeeperClasses(this.viewId, [
              '.ag-header',
              '.ag-body-horizontal-scroll',
            ]);
          }

          agGrid.api.sizeColumnsToFit();
        }
      });

      agGrid.columnMoved
        .pipe(
          takeUntil(this.#ngUnsubscribe),
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
          this.#updateColumnsInCurrentDataState(value.columnApi);
        });

      agGrid.dragStopped
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value: DragStoppedEvent) => {
          this.#updateColumnsInCurrentDataState(value.columnApi);
        });

      agGrid.rowSelected
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((event: RowSelectedEvent) => {
          if (this.#viewConfig && this.#currentDataState) {
            const row = event.node;
            const selectedIds = this.#currentDataState.selectedIds || [];
            const rowIndex = selectedIds.indexOf(row.data.id);

            if (row.isSelected() && rowIndex === -1) {
              selectedIds.push(row.data.id);
            } else if (!row.isSelected() && rowIndex !== -1) {
              selectedIds.splice(rowIndex, 1);
            }

            this.#currentDataState.selectedIds = selectedIds;
            this.#dataManagerSvc.updateDataState(
              this.#currentDataState,
              this.#viewConfig.id
            );

            this.#changeDetector.markForCheck();
          }
        });

      agGrid.sortChanged.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        const gridColumnStates: ColumnState[] =
          agGrid.columnApi.getColumnState();

        let sortOption: SkyDataManagerSortOption | undefined;

        /* istanbul ignore else */
        if (gridColumnStates.length) {
          const activeSortColumnState = gridColumnStates.find(
            (aGridColumnState) => aGridColumnState.sortIndex === 0
          );

          const dataManagerConfig =
            this.#dataManagerSvc.getCurrentDataManagerConfig();

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

        if (this.#viewConfig && this.#currentDataState) {
          this.#currentDataState.activeSortOption = sortOption;
          this.#dataManagerSvc.updateDataState(
            this.#currentDataState,
            this.#viewConfig.id
          );
        }
      });
    }
  }

  #updateColumnsInCurrentDataState(columnApi: ColumnApi): void {
    if (this.#viewConfig && this.#currentDataState) {
      const columnOrder = this.#getColumnOrder(columnApi);

      const viewState = this.#currentDataState.getViewStateById(
        this.#viewConfig.id
      );

      if (
        viewState &&
        (viewState.displayedColumnIds.length !== columnOrder.length ||
          viewState.displayedColumnIds.some((col, i) => col !== columnOrder[i]))
      ) {
        viewState.displayedColumnIds = columnOrder;

        this.#dataManagerSvc.updateDataState(
          this.#currentDataState.addOrUpdateView(
            this.#viewConfig.id,
            viewState
          ),
          this.#viewConfig.id
        );
      }
    }
  }

  #getColumnOrder(columnApi: ColumnApi): string[] {
    return columnApi
      .getColumnState()
      .filter((state) => !state.hide)
      .map((state) => state.colId);
  }

  #displayColumns(dataState: SkyDataManagerState): void {
    const agGrid = this.#currentAgGrid;

    if (agGrid && this.#viewConfig) {
      const viewState = dataState.getViewStateById(this.#viewConfig.id);
      let displayedColumnIds: string[] = [];

      /*istanbul ignore else*/
      if (viewState?.displayedColumnIds) {
        displayedColumnIds = viewState.displayedColumnIds;
      }

      const columnOrder = this.#getColumnOrder(agGrid.columnApi);

      if (
        displayedColumnIds.length !== columnOrder.length ||
        displayedColumnIds.some((col, i) => col !== columnOrder[i])
      ) {
        const hideColumns = agGrid.columnApi
          .getColumnState()
          .map((col) => col.colId)
          .filter((colId) => !displayedColumnIds.includes(colId));

        agGrid.columnApi.setColumnsVisible(hideColumns, false);
        agGrid.columnApi.setColumnsVisible(displayedColumnIds, true);
        agGrid.columnApi.moveColumns(displayedColumnIds, 0);
      }
    }
  }

  #selectAll(): void {
    const agGrid = this.agGridList?.first;
    agGrid?.api.selectAll();
  }

  #clearAll(): void {
    const agGrid = this.agGridList?.first;
    agGrid?.api.deselectAll();
  }
}
