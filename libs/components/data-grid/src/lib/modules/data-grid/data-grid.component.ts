import {
  coerceArray,
  coerceBooleanProperty,
  coerceNumberProperty,
  coerceStringArray,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
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
import {
  SkyAgGridModule,
  SkyAgGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyLogService } from '@skyux/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyFilterStateFilterItem, SkyPagingModule } from '@skyux/lists';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  AutoSizeStrategy,
  ColDef,
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
} from 'ag-grid-community';
import {
  Observable,
  distinctUntilChanged,
  filter,
  fromEvent,
  fromEventPattern,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SkyDataGridFilterValue } from '../types/data-grid-filter-value';
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
 * @preview
 */
@Component({
  selector: 'sky-data-grid',
  imports: [
    AgGridAngular,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyPagingModule,
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
  T extends { id: string } = { id: string } & Record<string, unknown>,
> {
  /**
   * The data for the grid. Each item requires an `id`, and other properties should map to a `field` of the grid columns.
   */
  public readonly data = input<T[]>();

  /**
   * Enable a compact layout for the grid when using modern theme. Compact layout uses
   * a smaller font size and row height to display more data in a smaller space.
   * @default false
   */
  public readonly compact = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The column IDs or fields for columns to show. Should not be combined with `hiddenColumns`.
   */
  public readonly selectedColumnIds = input<string[], unknown>([], {
    transform: coerceStringArray,
  });

  /**
   * Fires when columns change. This includes changes to the displayed columns and changes
   * to the order of columns. The event emits an array of IDs for the displayed columns that
   * reflects the column order.
   */
  public readonly selectedColumnIdsChange = output<string[]>();

  /**
   * The column IDs or fields for columns to hide. Should not be combined with `selectedColumnIds`.
   */
  public readonly hiddenColumns = input<string[], unknown>([], {
    transform: coerceStringArray,
  });

  /**
   * Whether to enable the multiselect feature to display a column of
   * checkboxes on the left side of the grid. You can specify a unique ID with
   * the `multiselectRowId` property, but multiselect defaults to the `id` property on
   * the `data` object.
   * @default false
   */
  public readonly enableMultiselect = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

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
   * To provide custom filtering functions, use the `totalRowCount` input and update the `data` input when filters change.
   */
  public readonly appliedFilters = input<
    SkyFilterStateFilterItem<SkyDataGridFilterValue>[]
  >([]);

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
   * @default 0
   */
  public readonly height = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The unique ID that matches a property on the `data` object.
   * @default 'id'
   */
  public readonly multiselectRowId = input<keyof T, unknown>('id', {
    transform: (value: unknown) => String(value) as keyof T,
  });

  /**
   * The current page number of the grid. When using `pageQueryParam`, this value should come from the query parameter.
   * @default 1
   */
  public readonly page = input<number, unknown>(1, {
    transform: (val: unknown) => coerceNumberProperty(val, 1),
  });

  /**
   * The number of items to display per page. Set to `0` to disable pagination.
   * @default 0
   */
  public readonly pageSize = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The query parameter name that stores the current page number.
   * When set, the grid syncs page changes to the URL for deep linking, and there should only be one grid on the page.
   * The value should match the name of an input on the route component, the value of that input should be passed to the
   * `SkyDataGridComponent` `page` input, and the SPA's `Router` should be configured to use
   * [`withComponentInputBinding`](https://angular.dev/api/router/withComponentInputBinding).
   */
  public readonly pageQueryParam = input<string>();

  /**
   * Whether the data grid is stacked on another data grid. When specified, the appropriate
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
  public readonly enableTopScroll = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The total number of records. When this input is set, it is expected that `data` will be updated for each
   * `pageChange`, `sortChange`, `appliedFilters` change, and search (when using search such as with a SKY UX data manager).
   * If this input is not set, the data grid will page, sort, filter, and apply SKY UX data manager search text to the
   * `data` provided, and the total row count is assumed to be `data.length`.
   * @default undefined
   */
  public readonly totalRowCount = input<number | undefined>(undefined);
  readonly #useInternalFilters = computed(() => {
    const totalRowCount = this.totalRowCount();
    return typeof totalRowCount === 'undefined';
  });

  /**
   * View ID when using SKY UX Data Manager. When this input is set, `sky-data-grid` provides a `sky-data-view` for a
   * SKY UX Data Manager. Requires a
   * [`SkyDataManagerService`](https://developer.blackbaud.com/skyux/components/data-manager?docs-active-tab=development#class_sky-data-manager-service)
   * be provided and configured.
   */
  public readonly viewId = input<string>();

  /**
   * The width of the grid in CSS pixels. When set to `0`, the grid will use the width of its container.
   * @default 0
   */
  public readonly width = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The ID of the row to highlight. The ID matches the `multiselectRowId` property
   * of the `data` object. Typically, this property is used in conjunction with
   * the flyout component to indicate the currently selected row. Other rows
   * are de-selected in the grid.
   */
  public readonly rowHighlightedId = input<string>();

  /**
   * The set of IDs for the rows to select in a multiselect grid.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   * Rows with IDs that are not included are de-selected in the grid.
   */
  public readonly selectedRowIds = input<string[]>([]);

  /**
   * The set of IDs for the rows selected in a multiselect grid.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   */
  public readonly multiselectSelectionChange = output<string[]>();

  /**
   * The set of IDs for the rows to prompt for delete confirmation.
   * The IDs match the `multiselectRowId` properties of the `data` objects.
   */
  public readonly rowDeleteIds = model<string[]>([]);

  /**
   * The sort setting for the grid.
   */
  public readonly sort = model<SkyDataGridSort | undefined>(undefined);

  /**
   * When `pageSize > 0` and `pageQueryParam` is not set, emits the current page when the paging through data.
   * When using `pageQueryParam`, the changes should come through the `Router`.
   */
  public readonly pageChange = output<number>();

  /**
   * Emits a row count after filters are updated.
   */
  public readonly rowCountChange = output<number>();

  /**
   * Fires when users cancel the deletion of a row.
   */
  public readonly rowDeleteCancel = output<SkyAgGridRowDeleteCancelArgs>();

  /**
   * Fires when users confirm the deletion of a row.
   */
  public readonly rowDeleteConfirm = output<SkyAgGridRowDeleteConfirmArgs>();

  protected readonly columns = contentChildren(SkyDataGridColumnComponent);
  protected readonly gridApi = signal<GridApi<T> | undefined>(undefined);
  protected readonly gridOptions = computed(() => {
    const columnDefs = this.#columnDefs();
    const enableTopScroll = untracked(() => this.enableTopScroll());
    const pageSize = untracked(() => this.pageSize());
    const hasPageSize = pageSize > 0;
    const height = untracked(() => this.height());
    const useInternalFilters = untracked(() => this.#useInternalFilters());
    const pagination = hasPageSize && useInternalFilters;
    const paginationPageSize = (useInternalFilters && pageSize) || undefined;
    if (columnDefs.length === 0) {
      return undefined;
    }
    return this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs,
        context: {
          enableTopScroll,
        },
        domLayout: height ? 'normal' : 'autoHeight',
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination,
        suppressPaginationPanel: true,
        paginationPageSize,
        rowData: untracked(() => this.rowData()),
        getRowId: (params: GetRowIdParams<T>) =>
          params.data[
            untracked(() => this.multiselectRowId()) as keyof T
          ] as string,
        rowSelection: untracked(() => this.#getRowSelection()),
        autoSizeStrategy: untracked(() => this.#getAutoSizeStrategy()),
      },
    }) as GridOptions<T>;
  });

  protected readonly gridReady = signal(false);
  protected readonly rowData = computed(() => {
    const pageSize = this.pageSize();
    const useInternalFilters = this.#useInternalFilters();
    let data = this.data() ?? [];
    if (pageSize > 0 && !useInternalFilters) {
      data = data.slice(0, pageSize);
    }
    return data;
  });

  protected readonly isExternalFilterPresent = computed(() => {
    const hasFilters = (this.appliedFilters() ?? []).length > 0;
    const useInternalFilters = this.#useInternalFilters();
    return hasFilters && useInternalFilters;
  });
  protected readonly doesExternalFilterPass = computed(
    (): ((node: Pick<IRowNode<T>, 'data'>) => boolean) => {
      const appliedFilters = this.appliedFilters();
      const columns = this.columns().map((col) => ({
        filterId: col.filterId(),
        field: col.field() as keyof T | undefined,
        filterOperator: col.filterOperator(),
        type: col.type(),
      }));
      return (node: Pick<IRowNode<T>, 'data'>): boolean =>
        doesFilterPass(appliedFilters, node.data as T, columns, this.#logger);
    },
  );

  protected readonly pageCount = computed(() => {
    const dataLength = this.rowData().length;
    const totalRowCount = this.totalRowCount();
    const pageSize = this.pageSize();
    const gridReady = this.gridReady();
    if (!gridReady || pageSize === 0) {
      return 0;
    }
    return Math.ceil((totalRowCount ?? dataLength) / pageSize);
  });
  protected readonly pageNumber = linkedSignal(this.page);

  readonly #dataManagerService = inject(SkyDataManagerService, {
    optional: true,
  });
  readonly #dataManagerSelectedColumnIds: Signal<string[]>;
  readonly #dataManagerSearchText: Signal<string>;
  protected readonly useDataManager = !!this.#dataManagerService;

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #gridService = inject(SkyAgGridService);
  readonly #logger = inject(SkyLogService);
  readonly #router = inject(Router, { optional: true });

  readonly #columnDefs = computed<ColDef<T>[]>(() => {
    const columns = this.columns();
    const sort = this.sort();
    const displayed = [
      ...this.selectedColumnIds().filter(Boolean),
      ...this.#dataManagerSelectedColumnIds().filter(Boolean),
    ];
    const hidden = this.hiddenColumns().filter(Boolean);
    return columns.map((col): ColDef => {
      const field = col.field();
      const colDef: ColDef = {
        colId: col.columnId(),
        field,
        headerName: col.heading(),
        headerComponentParams: {
          headerHidden: col.headingHidden(),
          helpPopoverTitle: col.helpPopoverTitle(),
          helpPopoverContent: col.helpPopoverContent() || col.description(),
          inlineHelpComponent: SkyDataGridColumnInlineHelpComponent,
        },
        hide: this.#hideColumn(col, displayed, hidden),
        resizable: col.isResizable(),
        sortable: col.isSortable(),
        lockPosition: col.locked(),
        suppressMovable: col.locked(),
        type: [],
        autoHeight: col.wrapText(),
        wrapText: col.wrapText(),
        sort:
          sort?.field === field ? (sort?.descending ? 'desc' : 'asc') : null,
      };
      if (col.type() === 'date') {
        (colDef.type as string[]).push(SkyCellType.Date);
        colDef.cellDataType = 'dateString';
      } else if (field && col.type() === 'number') {
        (colDef.type as string[]).push(SkyCellType.Number);
        colDef.cellDataType = 'number';
        colDef.valueGetter = (params): number => Number(params.data[field]);
      } else if (col.type() === 'boolean') {
        colDef.cellDataType = 'boolean';
      } else {
        (colDef.type as string[]).push(SkyCellType.Text);
        colDef.cellDataType = 'text';
      }
      if (col.cellTemplate()) {
        (colDef.type as string[]).push(SkyCellType.Template);
        colDef.cellRendererParams = { template: col.cellTemplate };
      }
      if (col.flexWidth() > -1) {
        colDef.initialFlex = col.flexWidth();
      } else if (col.width() > 0) {
        colDef.initialWidth = col.width();
      }
      if (col.width() > 0) {
        colDef.minWidth = col.width();
        colDef.suppressSizeToFit = true;
      }
      if (!col.isResizable() || col.flexWidth() === 0) {
        colDef.suppressSizeToFit = true;
        colDef.suppressAutoSize = true;
      }
      return colDef;
    });
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
    switchMap((api) =>
      fromEvent<SelectionChangedEvent>(api, 'selectionChanged').pipe(
        takeUntil(this.#gridDestroyed),
        map((selection) =>
          arraySorted(this.#getRowIds(selection.selectedNodes)),
        ),
        distinctUntilChanged(arrayIsEqual),
      ),
    ),
  );
  readonly #gridDisplayedColumnIds = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
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
              field: sortColumn.getColId(),
            };
          }
          return undefined;
        }),
      ),
    ),
  );

  constructor() {
    // Update specific grid options after the grid has been loaded.
    effect(() => {
      const api = untracked(() => this.gridApi());
      const rowData = this.rowData();
      api?.setGridOption('rowData', rowData);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const columns = this.#columnDefs();
      api?.setGridOption('columnDefs', columns);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const rowSelection = this.#getRowSelection();
      api?.setGridOption('rowSelection', rowSelection);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const height = this.height();
      api?.setGridOption('domLayout', height ? 'normal' : 'autoHeight');
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const pageSize = this.pageSize();
      const useInternalFilters = this.#useInternalFilters();
      api?.setGridOption('pagination', pageSize > 0 && useInternalFilters);
      api?.setGridOption('paginationPageSize', pageSize);
    });

    // Apply inputs once the grid is loaded and on subsequent changes.
    effect(() => {
      const api = this.gridApi();
      const selectedRowIds = coerceStringArray(this.selectedRowIds());
      this.rowData();
      const currentSelectedRowIds = this.#getRowIds(api?.getSelectedNodes());
      if (!arrayIsEqual(selectedRowIds, currentSelectedRowIds)) {
        api?.deselectAll();
        selectedRowIds.forEach((rowId) =>
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
      const pageNumber = this.pageNumber();
      const pageCount = this.pageCount();
      if (!pageCount || pageNumber < 1 || pageNumber > pageCount || !api) {
        return;
      }
      api.paginationGoToPage(pageNumber - 1);
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
      )
      .subscribe((rowIds) => {
        this.multiselectSelectionChange.emit(rowIds);
      });
    this.#gridDisplayedColumnIds
      .pipe(
        takeUntilDestroyed(),
        map((ids) => coerceStringArray(ids)),
      )
      .subscribe((columnIds) => {
        this.selectedColumnIdsChange.emit(columnIds);
      });
    this.#gridSortChange.pipe(takeUntilDestroyed()).subscribe((sortChange) => {
      if (sortChange) {
        this.sort.update((sort) => {
          if (
            !!sort !== !!sortChange ||
            sort?.descending !== sortChange?.descending ||
            sort?.field !== sortChange?.field
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
      const searchText = this.#dataManagerSearchText()
        .normalize()
        .toLowerCase();
      const useInternalFilters = this.#useInternalFilters();
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
        this.rowCountChange.emit(rowData.length);
      }
    });

    // Interact with data manager.
    this.#dataManagerSelectedColumnIds = toSignal(
      toObservable(this.viewId).pipe(
        filter(Boolean),
        switchMap(
          (viewId): Observable<string[]> =>
            (this.#dataManagerService as SkyDataManagerService)
              .getDataStateUpdates(viewId, { properties: ['views'] })
              .pipe(
                map(
                  (state) =>
                    /* istanbul ignore next */
                    state.views.find((view) => view.viewId === viewId)
                      ?.displayedColumnIds ?? [],
                ),
              ),
        ),
      ),
      { initialValue: [] },
    );
    this.#dataManagerSearchText = toSignal(
      toObservable(this.viewId).pipe(
        filter(Boolean),
        switchMap((viewId) =>
          (this.#dataManagerService as SkyDataManagerService)
            .getDataStateUpdates(viewId)
            .pipe(map((state) => `${state.searchText ?? ''}`)),
        ),
      ),
      { initialValue: '' },
    );
    effect(() => {
      const searchText = this.#dataManagerSearchText();
      const api = this.gridApi();
      const useInternalFilters = this.#useInternalFilters();
      if (useInternalFilters) {
        api?.setGridOption('quickFilterText', searchText);
      }
    });
  }

  protected currentPageChange(page: number): void {
    const pageQueryParam = this.pageQueryParam();
    const pageNumber = coerceNumberProperty(page, 1);
    if (
      pageQueryParam &&
      this.#activatedRoute &&
      this.#activatedRoute.snapshot.queryParamMap.get(pageQueryParam) !==
        `${page}`
    ) {
      // When using a query parameter, send the change through the router.
      void this.#router?.navigate(['.'], {
        relativeTo: this.#activatedRoute,
        queryParams: {
          [pageQueryParam]: pageNumber === 1 ? null : pageNumber,
        },
        queryParamsHandling: 'merge',
      });
    } else if (page) {
      this.pageNumber.set(page);
      if (this.pageCount() > 0) {
        this.pageChange.emit(page);
      }
    }
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
    return this.enableMultiselect()
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
