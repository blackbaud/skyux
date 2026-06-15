import {
  coerceArray,
  coerceBooleanProperty,
  coerceNumberProperty,
  coerceStringArray,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  isSignal,
  model,
  Resource,
  signal,
  untracked,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyPagingModule } from '@skyux/lists';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  AutoSizeStrategy,
  ColDef,
  GridApi,
  GridOptions,
  IRowNode,
  ModuleRegistry,
  RowSelectionOptions,
  SortDirection,
} from 'ag-grid-community';
import {
  distinctUntilChanged,
  filter,
  map,
  ObservableInput,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SkyDataGridSort } from '../types/data-grid-sort';

import { SkyDataGridColumnInlineHelpComponent } from './data-grid-column-inline-help.component';
import { SkyDataGridColumnComponent } from './data-grid-column.component';
import { fromGridEvent } from './data-grid-event-utils';

ModuleRegistry.registerModules([AllCommunityModule]);

function arraySorted(arr: string[]): string[] {
  return arr.slice().sort((a, b) => a.localeCompare(b));
}

function arrayIsEqual(
  a: string[] | undefined,
  b: string[] | undefined,
): boolean {
  if (!Array.isArray(a) || !Array.isArray(b) || a?.length !== b?.length) {
    return false;
  }
  const bSorted = arraySorted(b);
  return arraySorted(a).every((v, i) => v === bSorted[i]);
}

/**
 * Displays tabular data in a grid using a declarative set of columns and inputs.
 * Provide the `data` array and one `sky-data-grid-column` for each column to render.
 * @preview
 */
@Component({
  selector: 'sky-data-grid',
  imports: [
    AgGridAngular,
    SkyAgGridModule,
    SkyPagingModule,
    SkyViewkeeperModule,
    SkyWaitModule,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
  host: {
    '[class.sky-margin-stacked-lg]': 'stacked()',
    '[style.width.px]': 'width() || undefined',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGridComponent<
  T extends Record<'id', string> = Record<'id', string> &
    Record<string, unknown>,
> {
  /**
   * Enable a compact layout for the grid when using modern theme. Compact layout uses
   * a smaller font size and row height to display more data in a smaller space.
   * @default false
   */
  public readonly compact = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The data for the grid. Each item requires an `id`, and other properties should map to a `field` of the grid columns.
   * When `data` is `null` or `undefined`, the grid will show a loading indicator, and when `data` is an empty array,
   * the grid will show a "no rows" message. When passing a `Resource`, the grid will automatically subscribe to it and
   * update as the resource changes.
   */
  public readonly data = input<
    | T[]
    | Pick<Resource<T[] | undefined>, 'value' | 'isLoading' | 'hasValue'>
    | null
    | undefined
  >();

  /**
   * How the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default 'width'
   */
  public readonly fit = input<'width' | 'scroll'>('width');

  /**
   * The height of the grid in CSS pixels. For best performance, large grids should set a `height` value and not enable
   * `wrapText` on any column so that rows can be virtually drawn as needed. When `wrapText` is enabled on any column,
   * or when `height` is not set, the grid needs to build every row in order to determine the scroll height, creating
   * hundreds or thousands of invisible DOM elements and slowing down the browser.
   */
  public readonly height = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * Whether to enable the multiselect feature to display a column of
   * checkboxes on the left side of the grid.
   * @default false
   */
  public readonly multiselect = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The number of items to display per page. Setting this value enables pagination.
   */
  public readonly pageSize = input<number, unknown>(0, {
    transform: (value: unknown) => coerceNumberProperty(value, 0),
  });

  /**
   * The query parameter name that stores the current page number.
   * When set, the grid syncs page changes to the URL for deep linking, and there should only be one grid on the page.
   */
  public readonly pageQueryParam = input<string | undefined>();

  /**
   * Whether the data grid is stacked with another element below it. When specified, the appropriate
   * vertical spacing is automatically added to the data grid.
   * @default false
   */
  public readonly stacked = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * Move the horizontal scrollbar to just below the header row.
   * @default false
   */
  public readonly topScrollEnabled = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The width of the grid in CSS pixels. When no width is set, the grid will use the width of its container.
   */
  public readonly width = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The current page number of the grid when `pageSize` has been set.
   */
  public readonly page = model<number>(1);

  /**
   * The set of IDs for the rows to select in a multiselect grid.
   * Rows with IDs that are not included are de-selected in the grid.
   */
  public readonly selectedRowIds = model<string[]>([]);

  /**
   * The sort setting for the grid.
   */
  public readonly sortField = model<SkyDataGridSort<T> | undefined>(undefined);

  protected readonly columns = contentChildren(SkyDataGridColumnComponent);
  protected readonly gridApi = signal<GridApi<T> | undefined>(undefined);
  protected readonly gridOptions = computed(() => {
    const columnDefs = this.#columnDefs();
    if (columnDefs.length === 0) {
      return undefined;
    }
    const { pagination, paginationPageSize } = untracked(() =>
      this.#paginationOptions(),
    );
    const rowData = untracked(() => this.rowData());
    return this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs,
        context: {
          enableTopScroll: untracked(() => this.topScrollEnabled()),
        },
        domLayout: untracked(() => this.height()) ? 'normal' : 'autoHeight',
        loading: untracked(() => this.isLoading()),
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination,
        paginationPageSize,
        suppressPaginationPanel: true,
        rowData: rowData.length ? rowData : null,
        rowSelection: untracked(() => this.#getRowSelection()),
        autoSizeStrategy: untracked(() => this.#getAutoSizeStrategy()),
      },
    }) as GridOptions<T>;
  });

  protected readonly gridReady = signal(false);
  protected readonly rowData = computed(() => {
    const data = this.data();
    if (Array.isArray(data)) {
      return data;
    }
    // Using `hasValue()` gate avoids error cases with `value` signal.
    if (data?.hasValue()) {
      return data.value() ?? [];
    }
    return [];
  });
  protected readonly isLoading = computed(() => {
    const data = this.data();
    if (!Array.isArray(data) && isSignal(data?.isLoading)) {
      return data.isLoading();
    } else {
      return (data ?? 'loading') === 'loading';
    }
  });

  protected readonly pageCount = computed(() => {
    const dataLength = this.rowData().length;
    const pageSize = this.pageSize();
    const gridReady = this.gridReady();
    if (!gridReady || pageSize === 0) {
      return 0;
    }
    return Math.ceil(dataLength / pageSize);
  });

  protected readonly skyViewkeeper = computed(() => {
    // Only used when not using SkyDataManagerService because data manager handles SkyViewkeeper.
    const classes = ['.ag-header'];
    if (this.topScrollEnabled()) {
      classes.push('.ag-body-horizontal-scroll');
    }
    return classes;
  });

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #gridService = inject(SkyAgGridService);
  readonly #router = inject(Router, { optional: true });

  readonly #columnDefs = computed<ColDef<T>[]>(() => {
    const columns = this.columns();
    const sort = this.sortField();
    return columns.map((col) => this.#createColDef(col, sort));
  });

  readonly #gridDestroyed = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) => fromGridEvent(api, 'gridPreDestroyed')),
  );
  readonly #gridSelectedRowIds = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromGridEvent(api, 'selectionChanged').pipe(
        takeUntil(this.#gridDestroyed),
        map((selection) =>
          arraySorted(this.#getRowIds(selection.selectedNodes)),
        ),
        distinctUntilChanged(arrayIsEqual),
      ),
    ),
  );
  readonly #gridSortChange = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromGridEvent(api, 'sortChanged').pipe(
        takeUntil(this.#gridDestroyed),
        map((sortEvent): SkyDataGridSort<T> | undefined => {
          const sortColumn = sortEvent?.columns?.find((col) => !!col.getSort());
          if (sortColumn) {
            return {
              descending: sortColumn.getSort() === 'desc',
              fieldSelector: sortColumn.getColId() as keyof T,
            };
          }
          return undefined;
        }),
      ),
    ),
  );
  readonly #paginationOptions = computed(() => {
    const pageSize = this.pageSize();
    const pagination = pageSize > 0;
    const paginationPageSize = (pagination && pageSize) || undefined;
    return {
      pagination,
      paginationPageSize,
    };
  });
  readonly #queryParamPage = toSignal(
    toObservable(this.pageQueryParam).pipe(
      switchMap(
        (pageQueryParam): ObservableInput<number> =>
          pageQueryParam && this.#activatedRoute
            ? this.#activatedRoute.queryParamMap.pipe(
                startWith(this.#activatedRoute.snapshot.queryParamMap),
                map((params) =>
                  coerceNumberProperty(params.get(pageQueryParam), 1),
                ),
              )
            : [],
      ),
    ),
    { initialValue: 1 },
  );

  constructor() {
    // Update specific grid options after the grid has been loaded. These read
    // `gridApi` untracked because a recreated grid rebuilds its options from the
    // `gridOptions` computed; the selection and page effects below instead track
    // `gridApi` so they re-apply their state to a freshly created grid.
    effect(() => {
      const api = untracked(() => this.gridApi());
      const columnDefs = this.#columnDefs();
      api?.setGridOption('columnDefs', columnDefs);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const height = this.height();
      api?.setGridOption('domLayout', height ? 'normal' : 'autoHeight');
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const isLoading = this.isLoading();
      api?.setGridOption('loading', isLoading);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const { pagination, paginationPageSize } = this.#paginationOptions();
      api?.setGridOption('pagination', pagination);
      api?.setGridOption('paginationPageSize', paginationPageSize);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const rowData = this.rowData();
      api?.setGridOption('rowData', rowData);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const rowSelection = this.#getRowSelection();
      api?.setGridOption('rowSelection', rowSelection);
    });

    // Apply inputs once the grid is loaded and on subsequent changes.
    effect(() => {
      const api = this.gridApi();
      const isLoading = this.isLoading();
      // Don't reconcile selection while data is still loading; pruning here
      // would wipe a selection a consumer set before the rows arrived.
      // An empty array is "loaded but no rows", so only `null`/`undefined` skip.
      if (isLoading) {
        return;
      }
      const data = this.rowData();
      const validRowIds = data.map((row) => row.id);
      const selectedRowIds = coerceStringArray(this.selectedRowIds());
      const validSelectedRowIds = selectedRowIds.filter((id) =>
        validRowIds.includes(id),
      );
      if (!arrayIsEqual(validSelectedRowIds, selectedRowIds)) {
        this.selectedRowIds.set(validSelectedRowIds);
      }
      const currentSelectedRowIds = this.#getRowIds(api?.getSelectedNodes());
      if (!arrayIsEqual(validSelectedRowIds, currentSelectedRowIds)) {
        api?.deselectAll();
        validSelectedRowIds.forEach((rowId) =>
          api?.getRowNode(rowId)?.setSelected(true),
        );
      }
    });
    effect(() => {
      const api = this.gridApi();
      const page = this.page();
      const pageCount = this.pageCount();
      if (!pageCount || !api) {
        return;
      }
      if (page < 1 || page > pageCount) {
        this.page.set(1);
      } else {
        api.paginationGoToPage(page - 1);
      }
    });

    // Sync page from URL query parameter.
    effect(() => {
      const queryParamPage = this.#queryParamPage();
      this.page.set(queryParamPage);
    });

    this.#gridDestroyed.pipe(takeUntilDestroyed()).subscribe(() => {
      this.gridApi.set(undefined);
      this.gridReady.set(false);
    });

    // Emit updates from the grid.
    this.#gridSelectedRowIds
      .pipe(
        takeUntilDestroyed(),
        map((ids) => coerceStringArray(ids)),
        filter((rowIds) => !arrayIsEqual(this.selectedRowIds(), rowIds)),
      )
      .subscribe((rowIds) => {
        this.selectedRowIds.set(rowIds);
      });
    this.#gridSortChange.pipe(takeUntilDestroyed()).subscribe((sortChange) => {
      if (sortChange) {
        this.sortField.update((sort) => {
          if (
            !!sort !== !!sortChange ||
            !!sort?.descending !== !!sortChange?.descending ||
            sort?.fieldSelector !== sortChange?.fieldSelector
          ) {
            return sortChange;
          }
          return sort;
        });
      } else {
        // Clear the sort when the grid no longer has a sorted column so the
        // two-way bound model does not retain a stale value.
        this.sortField.update(() => undefined);
      }
    });
  }

  protected currentPageChange(page: number): void {
    if (page && page !== this.page()) {
      const pageQueryParam = this.pageQueryParam();
      if (pageQueryParam) {
        // When using a query parameter, send the change through the router.
        void this.#router?.navigate([], {
          relativeTo: this.#activatedRoute,
          queryParams: {
            [pageQueryParam]: page === 1 ? null : page,
          },
          queryParamsHandling: 'merge',
        });
      } else {
        this.page.set(page);
      }
    }
  }

  #createColDef(
    col: SkyDataGridColumnComponent,
    sort: SkyDataGridSort<T> | undefined,
  ): ColDef {
    const field = col.field();
    const colDef: ColDef = {
      colId: col.columnId(),
      field,
      headerName: col.headingText(),
      headerComponentParams: this.#getHeaderComponentParams(col),
      hide: col.columnHidden(),
      initialHide: col.columnHidden(),
      resizable: col.resizable(),
      sortable: col.sortable(),
      lockPosition: col.locked(),
      suppressMovable: col.locked(),
      type: [],
      autoHeight: col.wrapText(),
      wrapText: col.wrapText(),
      sort: this.#getSort(sort, col),
    };
    if (col.dataType() === 'date') {
      (colDef.type as string[]).push(SkyCellType.Date);
      colDef.cellDataType = 'dateString';
    } else if (field && col.dataType() === 'number') {
      (colDef.type as string[]).push(SkyCellType.Number);
      colDef.cellDataType = 'number';
      colDef.valueGetter = (params): number => Number(params.data?.[field]);
    } else if (col.dataType() === 'boolean') {
      colDef.cellDataType = 'boolean';
    } else {
      (colDef.type as string[]).push(SkyCellType.Text);
      colDef.cellDataType = 'text';
    }
    if (col.cellTemplate()) {
      (colDef.type as string[]).push(SkyCellType.Template);
      colDef.cellRendererParams = { template: col.cellTemplate };
    }
    this.#applyColumnWidthSettings(col, colDef);
    return colDef;
  }

  #applyColumnWidthSettings(
    col: SkyDataGridColumnComponent,
    colDef: ColDef,
  ): void {
    if (col.flexWidth() > -1) {
      colDef.flex = col.flexWidth();
      colDef.initialFlex = col.flexWidth();
      colDef.suppressSizeToFit = true;
    } else if (col.width() > 0) {
      colDef.initialWidth = col.width();
    }
    if (col.width() > 0) {
      colDef.minWidth = col.width();
      colDef.suppressSizeToFit = true;
    }
    if (!col.resizable() || col.flexWidth() === 0) {
      colDef.suppressSizeToFit = true;
      colDef.suppressAutoSize = true;
    }
  }

  #getSort(
    sort: SkyDataGridSort<T> | undefined,
    col: SkyDataGridColumnComponent,
  ): SortDirection {
    const field = col.field();
    return field && sort?.fieldSelector === field
      ? sort?.descending
        ? 'desc'
        : 'asc'
      : null;
  }

  #getHeaderComponentParams(col: SkyDataGridColumnComponent): object {
    return {
      headerHidden: col.headingHidden(),
      helpPopoverTitle: col.helpPopoverTitle(),
      helpPopoverContent: col.helpPopoverContent(),
      inlineHelpComponent: SkyDataGridColumnInlineHelpComponent,
    };
  }

  #getRowIds(rows: (IRowNode | undefined)[] | null | undefined): string[] {
    return coerceArray(rows)
      .map((node) => node?.id as string)
      .filter(Boolean) as string[];
  }

  #getAutoSizeStrategy(): AutoSizeStrategy {
    const width = this.width();
    return this.fit() === 'width' || width
      ? {
          type: 'fitGridWidth',
        }
      : {
          type: 'fitCellContents',
        };
  }

  #getRowSelection(): RowSelectionOptions<T> {
    return this.multiselect()
      ? {
          checkboxes: true,
          checkboxLocation: 'selectionColumn',
          headerCheckbox: true,
          mode: 'multiRow',
        }
      : {
          checkboxes: false,
          mode: 'singleRow',
        };
  }
}
