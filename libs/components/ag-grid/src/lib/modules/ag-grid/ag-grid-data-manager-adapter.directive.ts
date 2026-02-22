import {
  ChangeDetectorRef,
  Directive,
  OnDestroy,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyBreakpoint, SkyMediaQueryService } from '@skyux/core';
import {
  SkyDataManagerColumnPickerOption,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewColumnWidths,
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
import { Subject, filter, map, of, switchMap, takeUntil } from 'rxjs';

import { fromGridEvent } from './ag-grid-event-utils';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';

function toColumnWidthName(breakpoint: SkyBreakpoint): 'xs' | 'sm' {
  return breakpoint === 'xs' ? 'xs' : 'sm';
}

/**
 * Connects `SkyAgGridWrapperComponent` with a `SkyDataViewComponent` to control the grid using a `SkyDataManagerService` instance.
 */
@Directive({ selector: '[skyAgGridDataManagerAdapter]' })
export class SkyAgGridDataManagerAdapterDirective implements OnDestroy {
  public readonly viewId = input<string>();

  public readonly agGridList = contentChildren<AgGridAngular>(AgGridAngular, {
    descendants: true,
  });

  public skyAgGridWrapperList = contentChildren(SkyAgGridWrapperComponent, {
    descendants: true,
  });

  readonly #currentAgGrid = signal<AgGridAngular | undefined>(undefined);
  readonly #isAgGridReady = linkedSignal(
    computed(() => {
      this.#currentAgGrid();
      return false;
    }),
  );
  readonly #currentAgGridReady = computed(() => {
    const agGrid = this.#currentAgGrid();
    if (this.#isAgGridReady()) {
      return agGrid;
    }
    return undefined;
  });
  #currentDataState: SkyDataManagerState | undefined;
  #currentSkyAgGridWrapper: SkyAgGridWrapperComponent | undefined;
  readonly #ngUnsubscribe = new Subject<void>();
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #viewConfigs = toSignal(this.#dataManagerSvc.getDataViewsUpdates(), {
    initialValue: [],
  });
  readonly #viewConfig = computed(() => {
    const viewId = this.viewId();
    return this.#viewConfigs().find((vc) => vc.id === viewId);
  });
  readonly #activeView = toSignal(
    this.#dataManagerSvc.getActiveViewIdUpdates(),
  );
  readonly #isActiveView = computed(() => {
    const activeViewId = this.#activeView();
    const viewId = this.viewId();
    return activeViewId === viewId;
  });

  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange.pipe(map(toColumnWidthName)),
  );

  constructor() {
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

    effect(() => {
      const viewId = this.viewId();
      const agGridApi = this.#currentAgGridReady()?.api;
      if (viewId && agGridApi) {
        if (agGridApi.getGridOption('context')?.enableTopScroll) {
          this.#dataManagerSvc.setViewkeeperClasses(viewId, [
            '.ag-header',
            '.ag-body-horizontal-scroll',
          ]);
        } else {
          this.#dataManagerSvc.setViewkeeperClasses(viewId, ['.ag-header']);
        }
      }
    });

    effect(() => {
      const isActiveView = this.#isActiveView();
      const agGrid = untracked(this.#currentAgGridReady);
      if (isActiveView) {
        agGrid?.api?.refreshCells();
      }
    });
  }

  public ngOnDestroy(): void {
    this.#unregisterAgGrid();
    this.#ngUnsubscribe.complete();
  }

  #checkForAgGrid(agGridList: readonly AgGridAngular[]): void {
    const agGrid = agGridList[0];
    const agGridCount = agGridList.length;

    if (agGrid) {
      if (agGrid !== this.#currentAgGrid()) {
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
    this.#ngUnsubscribe.next();
    this.#currentAgGrid.set(undefined);
  }

  #unregisterSkyAgGridWrapper(): void {
    this.#currentSkyAgGridWrapper = undefined;
  }

  #registerSkyAgGridWrapper(wrapper: SkyAgGridWrapperComponent): void {
    this.#unregisterSkyAgGridWrapper();
    this.#currentSkyAgGridWrapper = wrapper;

    setTimeout(() => {
      if (this.#currentSkyAgGridWrapper) {
        this.#currentSkyAgGridWrapper.viewkeeperClasses.set([]);
      }
    });
  }

  #registerAgGrid(agGrid: AgGridAngular): void {
    this.#unregisterAgGrid();

    this.#currentAgGrid.set(agGrid);

    if (agGrid) {
      agGrid.gridReady
        .pipe(
          takeUntil(this.#ngUnsubscribe),
          switchMap(() => {
            let viewConfig = this.#viewConfig();
            if (viewConfig) {
              viewConfig = {
                ...viewConfig,
                onSelectAllClick: (): void => {
                  if (!agGrid.api.isDestroyed()) {
                    agGrid.api.selectAll();
                  }
                },
                onClearAllClick: (): void => {
                  if (!agGrid.api.isDestroyed()) {
                    agGrid.api.deselectAll();
                  }
                },
              };
              if (viewConfig.columnPickerEnabled && !viewConfig.columnOptions) {
                viewConfig.columnOptions = this.#readColumnOptionsFromGrid(
                  agGrid.api,
                );
              }
              this.#dataManagerSvc.updateViewConfig(viewConfig);

              this.#applyColumnWidths();
              return this.#dataManagerSvc.getDataStateUpdates(viewConfig.id);
            }
            /* istanbul ignore next */
            return of(undefined);
          }),
          filter(Boolean),
        )
        .subscribe((dataState: SkyDataManagerState) => {
          this.#currentDataState = dataState;
          this.#displayColumns(dataState);
          this.#applySort(dataState);
          this.#isAgGridReady.set(true);
        });

      agGrid.gridReady
        .pipe(
          takeUntil(this.#ngUnsubscribe),
          switchMap(() => fromGridEvent(agGrid.api, 'gridPreDestroyed')),
        )
        .subscribe(() => {
          this.#unregisterAgGrid();
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
          const viewConfig = this.#viewConfig();
          if (viewConfig && this.#currentDataState) {
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
              viewConfig.id,
            );

            this.#changeDetector.markForCheck();
          }
        });

      agGrid.sortChanged.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        const gridColumnStates: ColumnState[] = agGrid.api.getColumnState();
        const viewConfig = this.#viewConfig();

        const activeSortColumnState =
          gridColumnStates?.find(
            (aGridColumnState) => aGridColumnState.sortIndex === 0,
          ) ??
          gridColumnStates?.find((aGridColumnState) => aGridColumnState.sort);

        if (viewConfig && this.#currentDataState) {
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
            viewConfig.id,
          );
        }
      });
    }
  }

  #updateColumnsInCurrentDataState(api: GridApi): void {
    const viewConfig = this.#viewConfig();
    if (viewConfig && this.#currentDataState) {
      const columnOrder = this.#getColumnOrder(api);

      const viewState = this.#currentDataState.getViewStateById(viewConfig.id);

      if (
        viewState &&
        (viewState.displayedColumnIds.length !== columnOrder.length ||
          viewState.displayedColumnIds.some((col, i) => col !== columnOrder[i]))
      ) {
        viewState.displayedColumnIds = columnOrder;

        this.#dataManagerSvc.updateDataState(
          this.#currentDataState.addOrUpdateView(viewConfig.id, viewState),
          viewConfig.id,
        );
      }
    }
  }

  #getColumnOrder(api: GridApi | undefined): string[] {
    /* istanbul ignore next */
    return (api?.getColumnState() ?? [])
      .filter((state) => !state.hide)
      .map((state) => state.colId);
  }

  #displayColumns(dataState: SkyDataManagerState): void {
    const agGrid = this.#currentAgGrid();
    const viewConfig = this.#viewConfig();

    if (agGrid && viewConfig) {
      const viewState = dataState.getViewStateById(viewConfig.id);
      let displayedColumnIds: string[] = [];

      /*istanbul ignore else*/
      if (viewState?.displayedColumnIds) {
        displayedColumnIds = viewState.displayedColumnIds;
      }

      const columnOrder = this.#getColumnOrder(agGrid.api);

      if (
        (displayedColumnIds.length !== columnOrder.length ||
          displayedColumnIds.some((col, i) => col !== columnOrder[i])) &&
        agGrid.api
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
    const agGridApi = this.#currentAgGrid()?.api;
    const activeSort = dataState.activeSortOption;

    if (agGridApi && activeSort) {
      agGridApi.applyColumnState({
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
    const viewId = this.viewId();
    const viewState =
      viewId && this.#currentDataState?.getViewStateById(viewId);
    if (viewState && viewId && this.#currentDataState) {
      const currentWidths = viewState?.columnWidths;

      currentWidths[toColumnWidthName(breakpoint)][colId] = width;

      viewState.columnWidths = currentWidths;
      this.#dataManagerSvc.updateDataState(
        this.#currentDataState.addOrUpdateView(viewId, viewState),
        viewId,
      );
    }
  }

  #removeColumnWidths(colIds: string[]): void {
    const viewId = this.viewId();
    const viewState =
      viewId && this.#currentDataState?.getViewStateById(viewId);

    if (viewState && viewId && this.#currentDataState) {
      const currentWidths = viewState?.columnWidths;

      for (const colId of colIds) {
        delete currentWidths['xs'][colId];
        delete currentWidths['sm'][colId];
      }

      viewState.columnWidths = currentWidths;
      this.#dataManagerSvc.updateDataState(
        this.#currentDataState.addOrUpdateView(viewId, viewState),
        viewId,
      );
    }
  }

  #applyColumnWidths(breakpoint?: SkyBreakpoint): void {
    breakpoint ??= this.#breakpoint();
    const currentAgGridApi = this.#currentAgGridReady()?.api;
    const viewId = this.viewId();

    if (breakpoint && currentAgGridApi) {
      const viewState =
        viewId && this.#currentDataState?.getViewStateById(viewId);

      if (viewState && viewState.columnWidths && viewState.displayedColumnIds) {
        const columnLimits = this.#getGridColumnLimits(
          viewState.displayedColumnIds,
          viewState.columnWidths,
          toColumnWidthName(breakpoint),
        );

        currentAgGridApi.sizeColumnsToFit({ columnLimits });
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

  #readColumnOptionsFromGrid(api: GridApi): SkyDataManagerColumnPickerOption[] {
    // Technically `api.getColumns()` can return null but it's not testable.
    /* istanbul ignore next */
    const columns = api.getColumns() ?? [];
    return columns.map((col) => {
      const colDef = col.getColDef();
      return {
        id: col.getColId(),
        initialHide: colDef.initialHide,
        label: `${colDef.headerName ?? ''}`,
        alwaysDisplayed:
          colDef.lockVisible || !colDef.headerName || col.isPinned(),
      };
    });
  }
}
