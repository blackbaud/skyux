import {
  coerceArray,
  coerceBooleanProperty,
  coerceNumberProperty,
  coerceStringArray,
} from '@angular/cdk/coercion';
import {
  Directive,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyLogService } from '@skyux/core';
import { SkyDataManagerService } from '@skyux/data-manager';
import {
  SkyDataHost,
  SkyDataHostService,
  SkyFilterStateFilterItem,
} from '@skyux/lists';

import {
  AllCommunityModule,
  AutoSizeStrategy,
  ColDef,
  ColumnMovedEvent,
  DisplayedColumnsChangedEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridPreDestroyedEvent,
  IRowNode,
  ModuleRegistry,
  RowSelectionOptions,
  SelectionChangedEvent,
  SortChangedEvent,
  SortDirection,
} from 'ag-grid-community';
import {
  EMPTY,
  Observable,
  ObservableInput,
  distinctUntilChanged,
  filter,
  fromEvent,
  fromEventPattern,
  map,
  merge,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SkyDataGridFilterValue } from '../types/data-grid-filter-value';
import { SkyDataGridPageRequest } from '../types/data-grid-page-request';
import { SkyDataGridRowDeleteCancelArgs } from '../types/data-grid-row-delete-cancel-args';
import { SkyDataGridRowDeleteConfirmArgs } from '../types/data-grid-row-delete-confirm-args';
import { SkyDataGridSort } from '../types/data-grid-sort';

import { SkyDataGridColumnInlineHelpComponent } from './data-grid-column-inline-help.component';
import { SkyDataGridColumnComponent } from './data-grid-column.component';
import { doesFilterPass } from './data-grid-filter';

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
 * @internal
 */
@Directive({
  selector: '[skyDataGrid]',
  host: {
    '[class.sky-margin-stacked-lg]': 'stacked()',
    '[style.width.px]': 'width() || undefined',
  },
})
export class SkyDataGridDirective<
  T extends Record<'id', string> = Record<'id', string> & object,
> {
  /**
   * The filter state from a
   * [`SkyFilterBarComponent`](https://developer.blackbaud.com/skyux/components/filter-bar?docs-active-tab=development#class_sky-filter-bar-component).
   * When provided, filters are automatically applied to columns that have matching `filterId` values using the
   * respective `SkyDataGridColumnComponent`'s `filterOperator` as the comparator. To use the built-in filters, the
   * filter values are:
   *
   * - For a boolean column, use a `boolean` with `'equals'` or `'notEqual'` as the operator.
   * - For a date column, use a [`SkyDateRange`](https://developer.blackbaud.com/skyux/components/date-range-picker?docs-active-tab=development#interface_sky-date-range) or `Date`.
   * - For a number column, use a `SkyDataGridNumberRangeFilterValue` or a `number`.
   * - For a text column, use `string` or `string[]` as the filter value to match one or more text values.
   *
   * To provide custom filtering functions, use the `externalRowCount` input and update the `data` input when filters change.
   */
  public readonly appliedFilters = input<
    SkyFilterStateFilterItem<SkyDataGridFilterValue>[]
  >([]);

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
   * the grid will show a "no rows" message.
   */
  public readonly data = input<T[] | null | undefined>();

  /**
   * The number of records when using a remote data source.
   * When `externalRowCount` is set, it is expected that `data` will be updated whenever `pageRequest` emits a new value.
   * When both `externalRowCount` and `pageSize` are set, the number of pages is assumed to be `Math.ceil(externalRowCount / pageSize)`.
   * If `externalRowCount` is not set, the data grid will page, sort, filter, and apply SKY UX data manager search text to the
   * `data` provided, and the row count is assumed to be `data.length`.
   */
  public readonly externalRowCount = input<number | undefined>(undefined);

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
   * `wrapText` on any column so that rows can be virtually drawn as needed. When `wrapText` is  enabled on any column,
   * or when `height` is not set, the grid needs to build every row in order to determine the scroll height, creating
   * hundreds or thousands of invisible DOM elements and slowing down the browser.
   */
  public readonly height = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The column IDs or fields for columns to hide. Should not be combined with `displayedColumnIds`.
   */
  public readonly hiddenColumnIds = input<string[], unknown>([], {
    transform: coerceStringArray,
  });

  /**
   * Whether to enable the multiselect feature to display a column of
   * checkboxes on the left side of the grid. You can specify a unique ID with
   * the `multiselectRowId` property, but multiselect defaults to the `id` property on
   * the `data` object.
   * @default false
   */
  public readonly multiselect = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The unique ID that matches a property on the `data` object.
   * @default 'id'
   */
  public readonly multiselectRowId = input<keyof T>('id');

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
   * The ID of the row to highlight. The ID matches the `multiselectRowId` property
   * of the `data` object. Typically, this property is used in conjunction with
   * the flyout component to indicate the currently selected row. Other rows
   * are de-selected in the grid.
   */
  public readonly rowHighlightedId = input<string | undefined>();

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
   * The column IDs or fields for columns to show. Should not be combined with `hiddenColumnIds`.
   */
  public readonly displayedColumnIds = input<string[], unknown>([], {
    transform: coerceStringArray,
  });

  /**
   * Fires when columns change. This includes changes to the displayed columns and changes
   * to the order of columns. The event emits an array of IDs for the displayed columns that
   * reflects the column order.
   */
  public readonly displayedColumnIdsChange = output<string[]>();

  /**
   * The current page number of the grid when `pageSize` has been set.
   */
  public readonly page = model<number>(1);

  /**
   * The set of IDs for the rows to prompt for delete confirmation.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   */
  public readonly rowDeleteIds = model<string[]>([]);

  /**
   * The set of IDs for the rows to select in a multiselect grid.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   * Rows with IDs that are not included are de-selected in the grid.
   */
  public readonly selectedRowIds = model<string[]>([]);

  /**
   * The sort setting for the grid.
   */
  public readonly sortField = model<SkyDataGridSort | undefined>(undefined);

  /**
   * Fires when sorting or page number changes.
   */
  public readonly pageRequest = output<SkyDataGridPageRequest>();

  /**
   * Emits a row count after filters are updated. Not used when `externalRowCount` is set.
   */
  public readonly rowCountChange = output<number>();

  /**
   * Fires when users cancel the deletion of a row.
   */
  public readonly rowDeleteCancel = output<SkyDataGridRowDeleteCancelArgs>();

  /**
   * Fires when users confirm the deletion of a row.
   */
  public readonly rowDeleteConfirm = output<SkyDataGridRowDeleteConfirmArgs>();

  protected readonly columns = contentChildren(SkyDataGridColumnComponent);
  protected readonly gridApi = signal<GridApi<T> | undefined>(undefined);
  public readonly gridOptions = computed(() => {
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
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination,
        paginationPageSize,
        suppressPaginationPanel: true,
        rowData: rowData.length ? rowData : null,
        getRowId: (params: GetRowIdParams<T>) =>
          params.data[
            untracked(() => this.multiselectRowId()) as keyof T
          ] as string,
        rowSelection: untracked(() => this.#getRowSelection()),
        autoSizeStrategy: untracked(() => this.#getAutoSizeStrategy()),
      },
    }) as GridOptions<T>;
  });

  public readonly gridReady = signal(false);
  protected readonly rowData = computed(() => {
    const pageSize = this.pageSize();
    const useInternalFilters = this.useInternalFilters();
    let data = this.data() ?? [];
    if (pageSize > 0 && !useInternalFilters) {
      data = data.slice(0, pageSize);
    }
    return data;
  });

  public readonly isExternalFilterPresent = computed(() => {
    const hasFilters = (this.appliedFilters() ?? []).length > 0;
    const useInternalFilters = this.useInternalFilters();
    return hasFilters && useInternalFilters;
  });

  public readonly doesExternalFilterPass = computed(
    (): ((node: Pick<IRowNode<T>, 'data'>) => boolean) => {
      const appliedFilters = this.appliedFilters();
      const columns = this.columns().map((col) => ({
        filterId: col.filterId(),
        field: col.field() as keyof T | undefined,
        filterOperator: col.filterOperator(),
        type: col.dataType(),
      }));
      return (node: Pick<IRowNode<T>, 'data'>): boolean =>
        doesFilterPass(
          appliedFilters,
          node.data as Record<'id', string> & Partial<T>,
          columns,
          this.#logger,
        );
    },
  );

  public readonly pageCount = computed(() => {
    const dataLength = this.rowData().length;
    const externalRowCount = this.externalRowCount();
    const pageSize = this.pageSize();
    const gridReady = this.gridReady();
    if (!gridReady || pageSize === 0) {
      return 0;
    }
    return Math.ceil((externalRowCount ?? dataLength) / pageSize);
  });

  public readonly useDataManager = !!inject(SkyDataManagerService, {
    optional: true,
  });
  public readonly viewId = computed(
    () => this.#dataHostService?.hostId() ?? '',
  );
  public readonly skyViewkeeper = computed(() => {
    // Only used when not using SkyDataManagerService because data manager handles SkyViewkeeper.
    const classes = ['.ag-header'];
    if (this.topScrollEnabled()) {
      classes.push('.ag-body-horizontal-scroll');
    }
    return classes;
  });

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #dataHostService = inject(SkyDataHostService, { optional: true });
  readonly #dataHostServiceUpdates = toSignal(
    this.#dataHostService?.getDataHostUpdates('SkyDataGridComponent') ?? EMPTY,
  );
  readonly #dataHostDisplayedColumnIds = computed(
    () => this.#dataHostServiceUpdates()?.displayedColumnIds ?? [],
  );
  readonly #dataHostSearchText = computed(
    () => this.#dataHostServiceUpdates()?.searchText ?? '',
  );
  readonly #gridService = inject(SkyAgGridService);
  readonly #logger = inject(SkyLogService);
  readonly #router = inject(Router, { optional: true });

  readonly #columnDefs = computed<ColDef<T>[]>(() => {
    const columns = this.columns();
    const sort = this.sortField();
    const displayed = this.#displayedColumnIds();
    const hidden = this.hiddenColumnIds().filter(Boolean);
    return columns.map((col) =>
      this.#createColDef(col, displayed, hidden, sort),
    );
  });
  readonly #displayedColumnIds = computed(() => {
    const displayedColumnIds = this.displayedColumnIds().filter(Boolean);
    const dataHostDisplayedColumnIds = this.#dataHostDisplayedColumnIds();
    const notHidden = this.columns()
      .filter((col) => !col.hidden())
      .map((col) => this.#getColumnIdOrField(col));
    if (dataHostDisplayedColumnIds.length > 0) {
      return dataHostDisplayedColumnIds;
    }
    if (displayedColumnIds.length > 0) {
      return displayedColumnIds;
    }
    return notHidden;
  });

  readonly #dataHost = computed<SkyDataHost | undefined>(() => {
    const sortField = this.sortField();
    const id = this.viewId();
    const dataHost = untracked(() => this.#dataHostServiceUpdates());
    if (dataHost) {
      return {
        activeSortOption: sortField
          ? {
              propertyName: sortField.fieldSelector,
              descending: !!sortField.descending,
            }
          : undefined,
        displayedColumnIds: this.#displayedColumnIds(),
        id,
        page: this.page(),
        searchText: dataHost.searchText,
        selectedIds: this.selectedRowIds(),
      };
    }
    return undefined;
  });

  readonly #gridDestroyed = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromEventPattern<GridPreDestroyedEvent>((handler) =>
        api.addEventListener('gridPreDestroyed', handler),
      ),
    ),
  );
  readonly #gridSelectedRowIds = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap(
      (api) =>
        fromEvent<SelectionChangedEvent>(api, 'selectionChanged').pipe(
          takeUntil(this.#gridDestroyed),
          map((selection) =>
            arraySorted(this.#getRowIds(selection.selectedNodes)),
          ),
          map((ids) => coerceStringArray(ids)),
          distinctUntilChanged(arrayIsEqual),
        ) as Observable<string[]>,
    ),
  );
  readonly #gridDisplayedColumnIds = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      merge(
        fromEvent<ColumnMovedEvent>(api, 'columnMoved').pipe(
          takeUntil(this.#gridDestroyed),
          map((columnsEvent) =>
            columnsEvent.api
              .getAllDisplayedColumns()
              .map((col) => col.getColId()),
          ),
        ),
        fromEvent<DisplayedColumnsChangedEvent>(
          api,
          'displayedColumnsChanged',
        ).pipe(
          takeUntil(this.#gridDestroyed),
          map((columnsEvent) =>
            columnsEvent.api
              .getAllDisplayedColumns()
              .map((col) => col.getColId()),
          ),
          distinctUntilChanged(arrayIsEqual),
        ),
      ),
    ),
  );
  readonly #gridSortChange = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromEvent<SortChangedEvent>(api, 'sortChanged').pipe(
        takeUntil(this.#gridDestroyed),
        map((sortEvent): SkyDataGridSort | undefined => {
          const sortColumn = sortEvent?.columns?.find((col) => !!col.getSort());
          if (sortColumn) {
            return {
              descending: sortColumn.getSort() === 'desc',
              fieldSelector: sortColumn.getColId(),
            };
          }
          return undefined;
        }),
      ),
    ),
  );
  readonly #paginationOptions = computed(() => {
    const pageSize = this.pageSize();
    const hasPageSize = pageSize > 0;
    const useInternalFilters = this.useInternalFilters();
    const pagination = hasPageSize && useInternalFilters;
    const paginationPageSize = (pagination && pageSize) || undefined;
    return {
      pagination,
      paginationPageSize,
    };
  });
  /**
   * When `true`, the grid applies external filters and search text internally to the provided `data` and handles pagination, sorting, and emitting row count changes based on the filtered data.
   * When `false`, the grid expects that all filtering, searching, pagination, and sorting are handled externally, by updating the `data` input in response to changes to `appliedFilters`, search text from a `SkyFilterBarComponent`, or page changes.
   */
  public readonly useInternalFilters = input(false);
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
    // Update specific grid options after the grid has been loaded.
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
      const loading = (this.data() ?? 'loading') === 'loading';
      api?.setGridOption('loading', loading);
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
      const multiselectRowId = this.multiselectRowId();
      const validRowIds = this.rowData().map((row): string =>
        String(row[multiselectRowId as keyof T]),
      );
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
      const rowHighlightedId = this.rowHighlightedId();
      this.data();
      if (rowHighlightedId) {
        const rowNode = api?.getRowNode(rowHighlightedId);
        if (rowNode?.isSelected() === false) {
          rowNode?.setSelected(true, true);
        }
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
        filter((rowIds) => !arrayIsEqual(this.selectedRowIds(), rowIds)),
      )
      .subscribe((rowIds) => {
        this.selectedRowIds.set(rowIds);
      });
    this.#gridDisplayedColumnIds
      .pipe(
        takeUntilDestroyed(),
        map((ids) => coerceStringArray(ids)),
      )
      .subscribe((columnIds) => {
        this.displayedColumnIdsChange.emit(columnIds);
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
      }
    });
    effect(() => {
      const isExternalFilterPresent = this.isExternalFilterPresent();
      const doesExternalFilterPass = this.doesExternalFilterPass();
      let rowData = [...this.rowData()];
      const searchText = this.#dataHostSearchText().normalize().toLowerCase();
      const useInternalFilters = this.useInternalFilters();
      const multiselectRowId = this.multiselectRowId();
      if (useInternalFilters) {
        if (isExternalFilterPresent) {
          rowData = rowData.filter((data) => doesExternalFilterPass({ data }));
        }
        if (searchText) {
          rowData = rowData.filter((data) =>
            Object.values(data).some((value) =>
              String(value ?? '')
                .normalize()
                .toLowerCase()
                .includes(searchText),
            ),
          );
        }
        const validRowIds = rowData.map((row): string =>
          String(row[multiselectRowId as keyof T]),
        );
        const selectedRowIds = coerceStringArray(this.selectedRowIds());
        const validSelectedRowIds = selectedRowIds.filter((id) =>
          validRowIds.includes(id),
        );
        if (!arrayIsEqual(validSelectedRowIds, selectedRowIds)) {
          this.selectedRowIds.set(validSelectedRowIds);
        }
        this.rowCountChange.emit(rowData.length);
      }
    });

    effect(() => {
      const searchText = this.#dataHostSearchText();
      const api = this.gridApi();
      const useInternalFilters = this.useInternalFilters();
      if (useInternalFilters) {
        api?.setGridOption('quickFilterText', searchText);
      }
    });

    effect(() => {
      const dataHost = this.#dataHost();
      if (dataHost) {
        this.#dataHostService?.updateDataHost(dataHost, 'SkyDataGridComponent');
      }
    });

    effect(() => {
      this.pageRequest.emit({
        pageNumber: this.page(),
        pageSize: this.pageSize() || undefined,
        sortField: this.sortField(),
      });
    });
  }

  public currentPageChange(page: number): void {
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
    displayed: string[],
    hidden: string[],
    sort: SkyDataGridSort | undefined,
  ): ColDef {
    const field = col.field();
    const colDef: ColDef = {
      colId: col.columnId(),
      field,
      headerName: col.headingText(),
      headerComponentParams: this.#getHeaderComponentParams(col),
      hide: this.#hideColumn(col, displayed, hidden),
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
      colDef.valueGetter = (params): number => Number(params.data[field]);
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
      colDef.initialFlex = col.flexWidth();
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
    sort: SkyDataGridSort | undefined,
    col: SkyDataGridColumnComponent,
  ): SortDirection {
    return sort?.fieldSelector === col.field()
      ? sort?.descending
        ? 'desc'
        : 'asc'
      : null;
  }

  #getHeaderComponentParams(col: SkyDataGridColumnComponent): object {
    return {
      headerHidden: col.headingHidden(),
      helpPopoverTitle: col.helpPopoverTitle(),
      helpPopoverContent: col.helpPopoverContent() || col.description(),
      inlineHelpComponent: SkyDataGridColumnInlineHelpComponent,
    };
  }

  #getColumnIdOrField(col: SkyDataGridColumnComponent): string {
    const id = col.columnId();
    const field = col.field() || '';
    return id || field;
  }

  #hideColumn(
    col: SkyDataGridColumnComponent,
    displayed: string[],
    hidden: string[],
  ): boolean {
    return (
      col.hidden() ||
      (displayed.length > 0 &&
        !displayed.includes(this.#getColumnIdOrField(col))) ||
      hidden.includes(this.#getColumnIdOrField(col))
    );
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
