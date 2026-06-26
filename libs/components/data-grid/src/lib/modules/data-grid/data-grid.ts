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
  linkedSignal,
  model,
  numberAttribute,
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
import { SkyLogService, SkyViewkeeperModule } from '@skyux/core';
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
  filter,
  map,
  ObservableInput,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SkyDataGridSort } from '../types/data-grid-sort';

import { SkyDataGridColumn } from './data-grid-column';
import { SkyDataGridColumnInlineHelp } from './data-grid-column-inline-help';
import { fromGridEvent } from './data-grid-event-utils';

ModuleRegistry.registerModules([AllCommunityModule]);

function arraySorted(arr: string[]): string[] {
  return arr.slice().sort((a, b) => a.localeCompare(b));
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
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.css',
  host: {
    '[class.sky-margin-stacked-lg]': 'stacked()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGrid<
  T extends Record<'id', string> = Record<'id', string> &
    Record<string, unknown>,
> {
  /**
   * Whether the grid sorts the data order when a column header is clicked.
   * When `autoSort` is set to `false`, the data grid will not modify the sort
   * order, `sortField` will emit a new value, and `data` will need to be updated.
   * Use this option when the data is returned from the server already sorted,
   * such as sorting a "name" column using last name.
   * @default true
   */
  public readonly autoSort = input<boolean, unknown>(true, {
    transform: coerceBooleanProperty,
  });

  /**
   * Whether the number of items in the `data` array is the total number of rows
   * to use for paging controls. When `autoPage` is set to `false`, the
   * `rowCount` input is required, and `data` should be updated whenever `page`
   * emits a new value.
   * @default true
   */
  public readonly autoPage = input<boolean, unknown>(true, {
    transform: coerceBooleanProperty,
  });

  /**
   * Whether to enable a compact layout for the grid when using modern theme. Compact layout
   * uses a smaller font size and row height to display more data in a smaller space.
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
   * How the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default 'width'
   */
  public readonly fit = input<'width' | 'scroll'>('width');

  /**
   * Whether data is being loaded. When this is true, the grid shows a waiting overlay and is not interactive.
   * @default false
   */
  public readonly loading = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The minimum height of the grid in pixels.
   * @default 50
   */
  public readonly minHeight = input<number, unknown>(50, {
    transform: numberAttribute,
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
   * @default 0
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
   * The total number of rows to page through. Required when `pageSize` is
   * greater than zero and `autoPage` is `false`.
   * @default 0
   */
  public readonly rowCount = input<number, unknown>(0, {
    transform: (value: unknown) => coerceNumberProperty(value, 0),
  });

  /**
   * Whether the data grid is stacked with another element below it. When specified, the appropriate
   * vertical spacing is automatically added to the data grid.
   * @default false
   */
  public readonly stacked = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * Whether to move the horizontal scrollbar to just below the header row.
   * @default false
   */
  public readonly topScrollEnabled = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The current page number of the grid when `pageSize` has been set. This is two-way bindable:
   * it updates as the user navigates pages, and you can set it to change the current page.
   * @default 1
   */
  public readonly page = model<number>(1);

  /**
   * The set of IDs for the rows to select in a multiselect grid.
   * Rows with IDs that are not included are de-selected in the grid. This is two-way bindable:
   * it emits the updated set of IDs when the user changes the selection.
   * @default []
   */
  public readonly selectedRowIds = model<string[]>([]);

  /**
   * The current sort applied to the grid. This is two-way bindable: it emits a new value
   * whenever the user sorts a column, and you can set it to sort the grid programmatically.
   * When `autoSort` is `false`, the grid emits the new value here but does not reorder the
   * data itself, leaving it to you to update `data`.
   */
  public readonly sortField = model<SkyDataGridSort<T> | undefined>(undefined);

  protected readonly columns = contentChildren(SkyDataGridColumn);
  protected readonly gridApi = signal<GridApi<T> | undefined>(undefined);
  protected readonly gridOptions = computed(() => {
    const hasColumnDefs = this.#hasColumnDefs();
    if (!hasColumnDefs) {
      return undefined;
    }
    const columnDefs = untracked(() => this.#columnDefs());
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
        domLayout: 'autoHeight',
        loading: untracked(() => this.loading() || !Array.isArray(this.data())),
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination,
        paginationPageSize,
        suppressMultiSort: true,
        suppressPaginationPanel: true,
        rowData: rowData.length ? rowData : null,
        rowSelection: untracked(() => this.#getRowSelection()),
        autoSizeStrategy: untracked(() => this.#getAutoSizeStrategy()),
      },
    }) as GridOptions<T>;
  });

  protected readonly gridReady = signal(false);
  protected readonly rowData = computed(() => {
    const rowData = this.data() ?? [];
    const pageSize = this.pageSize();
    if (!this.autoPage() && pageSize > 0 && rowData.length > pageSize) {
      this.#logger.warn(
        'When using paging and `autoPage` is not enabled, the `data` input will be limited to the number of rows specified by `pageSize`. To display more rows, update the `data` input when the `page` changes.',
      );
      return rowData.slice(0, pageSize);
    }
    return rowData;
  });
  protected readonly pageCount = computed(() => {
    const dataLength = this.pageItemsCount();
    const pageSize = this.pageSize();
    const gridReady = this.gridReady();
    if (!gridReady || pageSize === 0) {
      return 0;
    }
    return Math.ceil(dataLength / pageSize);
  });
  protected readonly pageItemsCount = linkedSignal({
    source: () => {
      const pageSize = this.pageSize();
      const gridReady = this.gridReady();
      if (!gridReady || pageSize === 0) {
        return 0;
      }
      const dataLength = this.rowData().length;
      const rowCount = this.rowCount();
      const autoPage = this.autoPage();
      return autoPage ? dataLength : rowCount;
    },
    computation: (source, previous): number => {
      // Avoid flickering the pagination controls while data is updating.
      if (this.loading()) {
        return previous?.value || 0;
      }
      return source;
    },
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
  readonly #logger = inject(SkyLogService);
  readonly #router = inject(Router, { optional: true });

  readonly #columnDefs = computed<ColDef<T>[]>(() => {
    const columns = this.columns();
    const sort = untracked(() => this.sortField());
    return columns.map((col) => this.#createColDef(col, sort));
  });
  readonly #hasColumnDefs = computed(() => this.#columnDefs().length > 0);

  readonly #gridDestroyed = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) => fromGridEvent(api, 'gridPreDestroyed')),
  );
  readonly #gridSelectedRowIds = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromGridEvent(api, 'selectionChanged').pipe(
        takeUntil(this.#gridDestroyed),
        map(() => arraySorted(this.#getRowIds(api.getSelectedNodes()))),
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
  /**
   * The pagination options passed to AG Grid; not used when `autoPage` is false.
   */
  readonly #paginationOptions = computed(() => {
    const pageSize = this.pageSize();
    const pagination = this.autoPage() && pageSize > 0;
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
      const isLoading = this.loading() || !Array.isArray(this.data());
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
      const isLoading = this.loading() || !Array.isArray(this.data());
      // Don't reconcile selection while data is still loading; pruning here
      // would wipe a selection a consumer set before the rows arrived.
      // An empty array is "loaded but no rows", so only `null`/`undefined` skip.
      if (isLoading) {
        return;
      }
      const validRowIds = new Set(this.rowData().map((row) => row.id));
      const selectedRowIds = coerceStringArray(this.selectedRowIds());
      const validSelectedRowIds = selectedRowIds.filter((id) =>
        validRowIds.has(id),
      );
      if (
        this.autoPage() &&
        validSelectedRowIds.length !== selectedRowIds.length
      ) {
        this.selectedRowIds.set(validSelectedRowIds);
      }
      if (!api) {
        return;
      }
      // Diff against the grid's current selection; only touch nodes that
      // change, so a no-op reconcile fires no selectionChanged event.
      const desired = new Set(validSelectedRowIds);
      const selectedNodes = api.getSelectedNodes();
      const alreadySelected = new Set(this.#getRowIds(selectedNodes));
      const toDeselect = selectedNodes.filter(
        (node) => !desired.has(node.id as string),
      );
      const toSelect = validSelectedRowIds
        .filter((id) => !alreadySelected.has(id))
        .map((id) => api.getRowNode(id))
        .filter((node): node is IRowNode<T> => !!node);
      if (toDeselect.length) {
        api.setNodesSelected({ nodes: toDeselect, newValue: false });
      }
      if (toSelect.length) {
        api.setNodesSelected({ nodes: toSelect, newValue: true });
      }
    });
    // Apply the sort as runtime column state rather than through `columnDefs`,
    // so sorting never re-applies the declared column order and wipes a
    // user's drag-reordered (or resized) columns. Tracks `gridApi` so the
    // sort re-applies to a freshly created grid.
    effect(() => {
      const api = this.gridApi();
      const sort = this.sortField();
      if (!api) {
        return;
      }
      const fieldSelector = sort?.fieldSelector;
      api.applyColumnState({
        state: fieldSelector
          ? [
              {
                colId: fieldSelector as string,
                sort: sort?.descending ? 'desc' : 'asc',
              },
            ]
          : [],
        defaultState: { sort: null },
      });
    });
    effect(() => {
      const api = this.gridApi();
      const page = this.page();
      const pageCount = this.pageCount();
      if (!pageCount || !api) {
        return;
      }
      if (page < 1) {
        this.currentPageChange(1);
      } else if (page > pageCount) {
        this.currentPageChange(pageCount);
      } else if (untracked(this.autoPage)) {
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
      )
      .subscribe((selectedRowIds) => {
        // Maintain IDs not in the current dataset.
        const validRowIds = new Set(this.rowData().map(({ id }) => id));
        const selectedSet = new Set(selectedRowIds);
        this.selectedRowIds.update((val) => {
          const valSet = new Set(val);
          const hasAddition = selectedRowIds.some((id) => !valSet.has(id));
          const hasRemoval = val.some(
            (id) => validRowIds.has(id) && !selectedSet.has(id),
          );
          if (hasAddition || hasRemoval) {
            return [
              ...new Set([
                ...val.filter((id) => !validRowIds.has(id)),
                ...selectedRowIds,
              ]),
            ].sort((a, b) => a.localeCompare(b));
          }
          return val;
        });
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
    col: SkyDataGridColumn,
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
    if (!this.autoSort()) {
      colDef.comparator = (): number => 0;
    }
    this.#applyColumnWidthSettings(col, colDef);
    return colDef;
  }

  #applyColumnWidthSettings(col: SkyDataGridColumn, colDef: ColDef): void {
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
    col: SkyDataGridColumn,
  ): SortDirection {
    const field = col.field();
    return field && sort?.fieldSelector === field
      ? sort?.descending
        ? 'desc'
        : 'asc'
      : null;
  }

  #getHeaderComponentParams(col: SkyDataGridColumn): object {
    return {
      headerHidden: col.headingHidden(),
      helpPopoverTitle: col.helpPopoverTitle(),
      helpPopoverContent: col.helpPopoverContent(),
      inlineHelpComponent: SkyDataGridColumnInlineHelp,
    };
  }

  #getRowIds(rows: (IRowNode | undefined)[] | null | undefined): string[] {
    return coerceArray(rows)
      .map((node) => node?.id as string)
      .filter(Boolean) as string[];
  }

  #getAutoSizeStrategy(): AutoSizeStrategy | undefined {
    const hasFlexColumn = this.#columnDefs().some((col) => !!col.initialFlex);
    return this.fit() === 'width' && !hasFlexColumn
      ? { type: 'fitCellContents' }
      : undefined;
  }

  #getRowSelection(): RowSelectionOptions<T> {
    return this.multiselect()
      ? {
          checkboxes: true,
          checkboxLocation: 'selectionColumn',
          headerCheckbox: true,
          mode: 'multiRow',
        }
      : { checkboxes: false, mode: 'singleRow' };
  }
}
