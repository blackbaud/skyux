import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  contentChildren,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyBreakpoint, SkyMediaQueryService } from '@skyux/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewColumnWidths,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { AgGridAngular } from 'ag-grid-angular';
import {
  ColumnMovedEvent,
  ColumnResizedEvent,
  ColumnState,
  DragStoppedEvent,
  GridApi,
  IColumnLimit,
  RowSelectedEvent,
} from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';

function toColumnWidthName(breakpoint: SkyBreakpoint): 'xs' | 'sm' {
  return breakpoint === 'xs' ? 'xs' : 'sm';
}

/**
 * @internal
 */
@Directive({ selector: '[skyAgGridDataManagerAdapter]' })
export class SkyAgGridDataManagerAdapterDirective
  implements AfterContentInit, OnDestroy
{
  @Input()
  public viewId: string | undefined;

  public readonly agGridList = contentChildren<AgGridAngular>(AgGridAngular, {
    descendants: true,
  });

  public skyAgGridWrapperList = contentChildren(SkyAgGridWrapperComponent, {
    descendants: true,
  });

  #currentAgGrid: AgGridAngular | undefined;
  #currentDataState: SkyDataManagerState | undefined;
  #currentSkyAgGridWrapper: SkyAgGridWrapperComponent | undefined;
  #dataStateSub: Subscription | undefined;
  #viewConfig: SkyDataViewConfig | undefined;
  #ngUnsubscribe = new Subject<void>();
  #changeDetector: ChangeDetectorRef;
  #dataManagerSvc: SkyDataManagerService;

  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  constructor(
    changeDetector: ChangeDetectorRef,
    dataManagerSvc: SkyDataManagerService,
  ) {
    this.#changeDetector = changeDetector;
    this.#dataManagerSvc = dataManagerSvc;

    effect(() => {
      const list = this.agGridList();

      this.#checkForAgGrid(list);
    });

    effect(() => {
      const list = this.skyAgGridWrapperList();

      this.#checkForSkyAgGridWrapper(list);
    });

    effect(() => {
      const breakpoint = this.#breakpoint();

      if (breakpoint) {
        this.#applyColumnWidths(breakpoint);
      }
    });
  }

  public ngAfterContentInit(): void {
    if (this.viewId) {
      this.#dataManagerSvc.setViewkeeperClasses(this.viewId, ['.ag-header']);
      this.#viewConfig = this.#dataManagerSvc.getViewById(this.viewId);
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #checkForAgGrid(agGridList: readonly AgGridAngular[]): void {
    const agGrid = agGridList[0];
    const agGridCount = agGridList.length;

    if (agGrid) {
      if (agGrid !== this.#currentAgGrid) {
        this.#registerAgGrid(agGrid);
      }

      if (agGridCount > 1) {
        console.warn(
          'More than one ag-grid child component was found. Using the first ag-Grid.',
        );
      }
    }
  }

  #checkForSkyAgGridWrapper(
    wrappers: readonly SkyAgGridWrapperComponent[],
  ): void {
    const count = wrappers.length;
    const wrapper = wrappers[0];

    /* istanbul ignore else */
    if (wrapper !== this.#currentSkyAgGridWrapper) {
      this.#registerSkyAgGridWrapper(wrapper);
    }

    if (count > 1) {
      console.warn(
        'More than one ag-grid child component was found. Using the first ag-Grid.',
      );
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

  #registerSkyAgGridWrapper(wrapper: SkyAgGridWrapperComponent): void {
    this.#unregisterSkyAgGridWrapper();
    this.#currentSkyAgGridWrapper = wrapper;

    setTimeout(() => {
      if (this.#currentSkyAgGridWrapper) {
        this.#currentSkyAgGridWrapper.viewkeeperClasses = [];
      }
    });
  }

  #registerAgGrid(agGrid: AgGridAngular): void {
    this.#unregisterAgGrid();

    this.#currentAgGrid = agGrid;

    if (agGrid) {
      agGrid.gridReady.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        if (this.#viewConfig && this.viewId) {
          this.#viewConfig.onSelectAllClick = (): void =>
            agGrid.api.selectAll();
          this.#viewConfig.onClearAllClick = (): void =>
            agGrid.api.deselectAll();
          this.#dataManagerSvc.updateViewConfig(this.#viewConfig);
          this.#dataStateSub = this.#dataManagerSvc
            .getDataStateUpdates(this.#viewConfig.id)
            .pipe(takeUntil(this.#ngUnsubscribe))
            .subscribe((dataState: SkyDataManagerState) => {
              this.#currentDataState = dataState;
              this.#displayColumns(dataState);
              this.#applySort(dataState);
            });

          if (agGrid.gridOptions?.context?.enableTopScroll) {
            this.#dataManagerSvc.setViewkeeperClasses(this.viewId, [
              '.ag-header',
              '.ag-body-horizontal-scroll',
            ]);
          }

          this.#applyColumnWidths();
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
              ].includes(event.source),
          ),
        )
        .subscribe((value: ColumnMovedEvent) => {
          this.#updateColumnsInCurrentDataState(value.api);
        });

      agGrid.columnResized
        .pipe(
          takeUntil(this.#ngUnsubscribe),
          filter(
            (event: ColumnResizedEvent) => event.source === 'uiColumnResized',
          ),
        )
        .subscribe((event: ColumnResizedEvent) => {
          const colId = event.column?.getColId();
          const width = event.column?.getActualWidth();
          const breakpoint = this.#breakpoint();

          if (colId && width && breakpoint) {
            this.#updateColumnWidth(colId, width, breakpoint);
          }
        });

      agGrid.dragStopped
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((value: DragStoppedEvent) => {
          this.#updateColumnsInCurrentDataState(value.api);
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
              this.#viewConfig.id,
            );

            this.#changeDetector.markForCheck();
          }
        });

      agGrid.sortChanged.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        const gridColumnStates: ColumnState[] = agGrid.api.getColumnState();

        const activeSortColumnState =
          gridColumnStates?.find(
            (aGridColumnState) => aGridColumnState.sortIndex === 0,
          ) ??
          gridColumnStates?.find((aGridColumnState) => aGridColumnState.sort);

        if (this.#viewConfig && this.#currentDataState) {
          if (activeSortColumnState) {
            const activeSortColumnDef = agGrid.api.getColumnDef(
              activeSortColumnState.colId,
            );
            this.#currentDataState.activeSortOption = {
              descending: activeSortColumnState.sort === 'desc',
              id: activeSortColumnState.colId,
              propertyName: activeSortColumnDef?.field || '',
              label: activeSortColumnDef?.headerName || '',
            };
          } else {
            this.#currentDataState.activeSortOption = undefined;
          }
          this.#dataManagerSvc.updateDataState(
            this.#currentDataState,
            this.#viewConfig.id,
          );
        }
      });
    }
  }

  #updateColumnsInCurrentDataState(api: GridApi): void {
    if (this.#viewConfig && this.#currentDataState) {
      const columnOrder = this.#getColumnOrder(api);

      const viewState = this.#currentDataState.getViewStateById(
        this.#viewConfig.id,
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
            viewState,
          ),
          this.#viewConfig.id,
        );
      }
    }
  }

  #getColumnOrder(api: GridApi): string[] {
    return api
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

      const columnOrder = this.#getColumnOrder(agGrid.api);

      if (
        displayedColumnIds.length !== columnOrder.length ||
        displayedColumnIds.some((col, i) => col !== columnOrder[i])
      ) {
        const hideColumns = agGrid.api
          .getColumnState()
          .map((col) => col.colId)
          .filter((colId) => !displayedColumnIds.includes(colId));

        agGrid.api.setColumnsVisible(hideColumns, false);
        agGrid.api.setColumnsVisible(displayedColumnIds, true);
        agGrid.api.moveColumns(displayedColumnIds, 0);
        this.#removeColumnWidths(hideColumns);
      }
    }
  }

  #applySort(dataState: SkyDataManagerState): void {
    const agGrid = this.#currentAgGrid;
    const activeSort = dataState.activeSortOption;

    if (activeSort) {
      agGrid?.api.applyColumnState({
        state: [
          {
            colId: activeSort.id,
            sort: activeSort.descending ? 'desc' : 'asc',
          },
        ],
        defaultState: { sort: null },
      });
    }
  }

  #updateColumnWidth(
    colId: string,
    width: number,
    breakpoint: SkyBreakpoint,
  ): void {
    const viewState =
      this.viewId && this.#currentDataState?.getViewStateById(this.viewId);
    if (viewState && this.viewId && this.#currentDataState) {
      const currentWidths = viewState?.columnWidths;

      currentWidths[toColumnWidthName(breakpoint)][colId] = width;

      viewState.columnWidths = currentWidths;
      this.#dataManagerSvc.updateDataState(
        this.#currentDataState.addOrUpdateView(this.viewId, viewState),
        this.viewId,
      );
    }
  }

  #removeColumnWidths(colIds: string[]): void {
    const viewState =
      this.viewId && this.#currentDataState?.getViewStateById(this.viewId);

    if (viewState && this.viewId && this.#currentDataState) {
      const currentWidths = viewState?.columnWidths;

      for (const colId of colIds) {
        delete currentWidths['xs'][colId];
        delete currentWidths['sm'][colId];
      }

      viewState.columnWidths = currentWidths;
      this.#dataManagerSvc.updateDataState(
        this.#currentDataState.addOrUpdateView(this.viewId, viewState),
        this.viewId,
      );
    }
  }

  #applyColumnWidths(breakpoint?: SkyBreakpoint): void {
    breakpoint ??= this.#breakpoint();

    if (breakpoint) {
      const viewState =
        this.viewId && this.#currentDataState?.getViewStateById(this.viewId);

      if (viewState && viewState.columnWidths && viewState.displayedColumnIds) {
        const columnLimits = this.#getGridColumnLimits(
          viewState.displayedColumnIds,
          viewState.columnWidths,
          toColumnWidthName(breakpoint),
        );

        this.#currentAgGrid?.api.sizeColumnsToFit({ columnLimits });
      }
    }
  }

  #getGridColumnLimits(
    displayedColumns: string[],
    currentWidths: SkyDataViewColumnWidths,
    breakpointName: keyof SkyDataViewColumnWidths,
  ): IColumnLimit[] {
    const gridColumnLimits: IColumnLimit[] = [];

    for (const column of displayedColumns) {
      const columnWidth = currentWidths[breakpointName][column];

      if (columnWidth) {
        gridColumnLimits.push({
          key: column,
          minWidth: columnWidth,
          maxWidth: columnWidth,
        });
      }
    }
    return gridColumnLimits;
  }
}
