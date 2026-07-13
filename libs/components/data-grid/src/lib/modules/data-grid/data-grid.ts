import {
  coerceArray,
  coerceBooleanProperty,
  coerceNumberProperty,
  coerceStringArray,
} from '@angular/cdk/coercion';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  Signal,
  signal,
  TemplateRef,
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
  AutoSizeStrategy,
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColumnApiModule,
  ColumnAutoSizeModule,
  EventApiModule,
  GridApi,
  GridOptions,
  GridStateModule,
  IRowNode,
  ModuleRegistry,
  PaginationModule,
  RenderApiModule,
  RowApiModule,
  RowAutoHeightModule,
  RowSelectionModule,
  RowSelectionOptions,
  RowStyleModule,
  ValidationModule,
} from 'ag-grid-community';
import {
  filter,
  map,
  ObservableInput,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SkyDataGridRowData } from '../types/data-grid-row-data';
import { SkyDataGridSort } from '../types/data-grid-sort';

import { SkyDataGridDockType } from '../types/data-grid-dock-type';
import { SkyDataGridColumn } from './data-grid-column';
import { SkyDataGridColumnInlineHelp } from './data-grid-column-inline-help';
import { fromGridEvent } from './data-grid-event-utils';

// Register only the AG Grid community modules this component actually uses,
// rather than `AllCommunityModule`, to keep the consumer's bundle lean. This
// covers the client-side row model, sorting, pagination, row selection, cell
// and row styling, column auto-sizing, auto-height (text wrap), the grid/column
// state and event APIs the component and its harness rely on, and dev-time
// validation messaging.
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  EventApiModule,
  GridStateModule,
  PaginationModule,
  RenderApiModule,
  RowApiModule,
  RowAutoHeightModule,
  RowSelectionModule,
  RowStyleModule,
  ValidationModule,
]);

function arraySorted(arr: string[]): string[] {
  return arr.slice().sort((a, b) => a.localeCompare(b));
}

const DEFAULT_DOCK_TYPE: SkyDataGridDockType = 'none';

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
    '[class.fill-dock]': 'useFillDock()',
    '[class.sky-margin-stacked-lg]': 'stacked()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGrid {
  /**
   * Whether the grid sorts the data order when a column header is clicked.
   * When `autoSort` is set to `false`, the data grid will not modify the sort
   * order, `sort` will emit a new value, and `data` will need to be updated.
   * Use this option when the data is returned from the server already sorted,
   * such as sorting a "name" column using last name.
   * @default true
   */
  public readonly autoSort = input<boolean, unknown>(true, {
    transform: coerceBooleanProperty,
  });

  /**
   * Whether the items in `data` represent the full result set used for paging.
   * This applies only when `pageSize` is greater than zero. When `true` (the
   * default), the grid pages through `data` on the client. When `false`, the
   * `rowCount` input is required to size the paging controls, and `data` should
   * be updated to the rows for the current page whenever `page` emits a new
   * value (server-side paging).
   * @default true
   */
  public readonly autoPage = input<boolean, unknown>(true, {
    transform: coerceBooleanProperty,
  });

  /**
   * How the grid columns are sized. The valid options are `container`, which
   * attempts to fit the grid to the parent's full width, and `content`, which
   * attempts to optimize columns to display their contents and may exceed the
   * parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * This property is applied when the grid initializes; changes after
   * initialization are not reflected.
   * @default 'container'
   */
  public readonly columnFit = input<'container' | 'content'>('container');

  /**
   * Whether to enable a compact layout for the grid when using modern theme. Compact layout
   * uses a smaller font size and row height to display more data in a smaller space.
   * @default false
   */
  public readonly compact = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The data for the grid. Each item must implement `SkyDataGridRowData`, and other properties should map to a `field` of the grid columns.
   * When `data` is `null` or `undefined`, the grid will show a loading indicator, and when `data` is an empty array,
   * the grid will show a "no rows" message.
   */
  public readonly data = input<SkyDataGridRowData[] | null | undefined>();

  /**
   * How the data grid docks to the page. Use `fill` to dock the data grid to the container's size where the container
   * is a sky-page component with its layout set to `fit`, or where the container is another element with a relative or
   * absolute position and a fixed size.
   * @default "none"
   */
  public readonly dock = input<SkyDataGridDockType>(DEFAULT_DOCK_TYPE);

  /**
   * The text to read to screen readers to describe the grid. This sets the `aria-label` attribute on the grid container.
   */
  public readonly labelText = input<string>();

  /**
   * Whether data is being loaded. When `loading` is true or when `data` is nullish,
   * the grid shows a waiting overlay and is not interactive.
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
    transform: (value: unknown) => coerceNumberProperty(value, 50),
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
   * The number of items to display per page. Setting a value greater than zero
   * enables paging. When `autoPage` is `true` (the default), the grid pages
   * through `data` on the client; when `autoPage` is `false`, set `rowCount` to
   * the total number of rows and update `data` as `page` changes.
   */
  public readonly pageSize = input<number | undefined, unknown>(undefined, {
    transform: (value: unknown) => coerceNumberProperty(value, undefined),
  });

  /**
   * The query parameter name that stores the current page number.
   * When set, the grid syncs page changes to the URL for deep linking, and there should only be one grid on the page.
   */
  public readonly pageQueryParam = input<string | undefined>();

  /**
   * The total number of rows to page through, used to calculate how many pages
   * the paging controls display. Required when `pageSize` is greater than zero
   * and `autoPage` is `false`; ignored when `autoPage` is `true` because the
   * length of `data` is used instead.
   */
  public readonly rowCount = input<number | undefined, unknown>(undefined, {
    transform: (value: unknown) => {
      if (typeof value === 'undefined') {
        return undefined;
      }
      return coerceNumberProperty(value, undefined);
    },
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
   * This property is applied when the grid initializes; changes after
   * initialization are not reflected.
   * @default false
   */
  public readonly topScrollEnabled = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The current page number of the grid when `pageSize` has been set. This is two-way bindable:
   * it updates as the user navigates pages, and you can set it to change the current page.
   * When `autoPage` is `false`, update `data` to the rows for the new page whenever this changes.
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
  public readonly sort = model<SkyDataGridSort | undefined>(undefined);

  protected readonly columns = contentChildren(SkyDataGridColumn);
  protected readonly gridApi = signal<GridApi<SkyDataGridRowData> | undefined>(
    undefined,
  );
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
    // Seed the initial sort through AG Grid's own state so it is applied as the
    // grid initializes (and re-applied when the grid is recreated). Subsequent
    // sort changes are applied at runtime by the dedicated `sort` effect.
    const sort = untracked(() => this.sort());
    return this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs,
        context: {
          enableTopScroll: untracked(() => this.topScrollEnabled()),
        },
        domLayout: untracked(() =>
          this.useFillDock() ? 'normal' : 'autoHeight',
        ),
        initialState: sort
          ? {
              sort: {
                sortModel: [
                  { colId: sort.field as string, sort: sort.direction },
                ],
              },
            }
          : undefined,
        loading: untracked(() => this.loading() || !Array.isArray(this.data())),
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination,
        paginationPageSize,
        suppressMultiSort: true,
        suppressPaginationPanel: true,
        rowData,
        rowSelection: untracked(() => this.#getRowSelection()),
        autoSizeStrategy: untracked(() => this.#getAutoSizeStrategy()),
      },
    }) as GridOptions<SkyDataGridRowData>;
  });

  protected readonly gridReady = signal(false);
  protected readonly rowData = computed(() => {
    const rowData = this.data() ?? [];
    const pageSize = this.pageSize();
    if (!this.autoPage() && pageSize && rowData.length > pageSize) {
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
    if (!gridReady || !pageSize) {
      return 0;
    }
    return Math.ceil(dataLength / pageSize);
  });
  protected readonly pageItemsCount = linkedSignal({
    source: () => {
      const pageSize = this.pageSize();
      const gridReady = this.gridReady();
      const rowCount = this.rowCount() ?? 0;
      if (!gridReady || !pageSize) {
        return 0;
      }
      const dataLength = this.rowData().length;
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

  protected readonly useFillDock = computed(
    () => this.dock() !== DEFAULT_DOCK_TYPE,
  );

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #gridService = inject(SkyAgGridService);
  readonly #logger = inject(SkyLogService);
  readonly #router = inject(Router, { optional: true });

  readonly #columnDefs = computed<ColDef<SkyDataGridRowData>[]>(() => {
    const columns = this.columns();
    return columns.map((col) => this.#createColDef(col));
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
        map((sortEvent): SkyDataGridSort | undefined => {
          const sortColumn = sortEvent?.columns?.find((col) => !!col.getSort());
          if (sortColumn) {
            return {
              direction: sortColumn.getSort() as 'asc' | 'desc',
              field: sortColumn.getColId(),
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
    const pagination = this.autoPage() && !!pageSize;
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
                  coerceNumberProperty(params.get(pageQueryParam), NaN),
                ),
              )
            : [],
      ),
    ),
    { initialValue: NaN },
  );

  constructor() {
    // Update specific grid options after the grid has been loaded. These read
    // `gridApi` untracked because a recreated grid rebuilds its options from the
    // `gridOptions` computed; the selection and page effects below instead track
    // `gridApi` so they re-apply their state to a freshly created grid.

    // Using `afterRenderEffect` for columns because we need the results from
    // `contentChildren` for the column definitions, and this allows columns
    // that use control flow or inputs to stabilize.
    afterRenderEffect({
      earlyRead: () => {
        const api = untracked(() => this.gridApi());
        const columnDefs = this.#columnDefs();
        api?.setGridOption('columnDefs', columnDefs);
      },
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const isLoading = this.loading() || !Array.isArray(this.data());
      api?.setGridOption('loading', isLoading);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const domLayout = this.useFillDock() ? 'normal' : 'autoHeight';
      api?.setGridOption('domLayout', domLayout);
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
        .filter((node): node is IRowNode<SkyDataGridRowData> => !!node);
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
      const sort = this.sort();
      if (!api) {
        return;
      }
      api.applyColumnState({
        state: sort
          ? [
              {
                colId: sort.field as string,
                sort: sort.direction,
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
      } else {
        if (untracked(this.autoPage)) {
          api.paginationGoToPage(page - 1);
        }
        // When the page is set programmatically (rather than through the
        // paging controls), sync the change to the URL query parameter.
        this.#syncPageQueryParam(page);
      }
    });

    effect(() => {
      const api = this.gridApi();
      const label = this.labelText();
      api?.setGridAriaProperty('label', label ?? null);
    });

    // Sync page from URL query parameter.
    effect(() => {
      const queryParamPage = this.#queryParamPage();
      const pageSize = this.pageSize();
      if (pageSize && Number.isInteger(queryParamPage)) {
        this.page.set(queryParamPage);
      }
    });

    // Warn when server-side paging is configured without the required
    // `rowCount`. Without it, `pageItemsCount` resolves to zero and the paging
    // controls silently disappear. Only warn once data has loaded so a grid
    // that is still fetching its first page does not trigger a false positive.
    effect(() => {
      if (
        !this.autoPage() &&
        this.pageSize() &&
        this.rowCount() === undefined &&
        !this.loading() &&
        Array.isArray(this.data())
      ) {
        this.#logger.warn(
          'When using paging and `autoPage` is not enabled, the `rowCount` input is required so the paging controls know how many pages to display. Set `rowCount` to the total number of rows available on the server.',
        );
      }
    });

    // Warn when `pageQueryParam` is configured without a `Router` and
    // `ActivatedRoute` available for injection. Without them, page changes
    // fall back to updating the `page` model directly instead of the URL.
    effect(() => {
      if (this.pageQueryParam() && (!this.#router || !this.#activatedRoute)) {
        this.#logger.warn(
          'The `pageQueryParam` input is set, but a `Router` and `ActivatedRoute` are not available for injection. Page changes will not be reflected in the URL.',
        );
      }
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
        this.sort.update((sort) => {
          if (
            !!sort !== !!sortChange ||
            sort?.direction !== sortChange?.direction ||
            sort?.field !== sortChange?.field
          ) {
            return sortChange;
          }
          return sort;
        });
      } else {
        // Clear the sort when the grid no longer has a sorted column so the
        // two-way bound model does not retain a stale value.
        this.sort.update(() => undefined);
      }
    });
  }

  protected currentPageChange(page: number): void {
    if (page && page !== this.page()) {
      const pageQueryParam = this.pageQueryParam();
      if (pageQueryParam && this.#router && this.#activatedRoute) {
        // When using a query parameter, send the change through the router.
        this.#navigateToPageQueryParam(pageQueryParam, page);
      } else {
        this.page.set(page);
      }
    }
  }

  /**
   * Updates the URL to reflect a programmatic page change so deep linking stays
   * in sync when a consumer drives `page` directly instead of using the paging
   * controls. Reads untracked so it does not add reactive dependencies to the
   * effect that calls it.
   */
  #syncPageQueryParam(page: number): void {
    const pageQueryParam = untracked(this.pageQueryParam);
    if (pageQueryParam && untracked(this.#queryParamPage) !== page) {
      this.#navigateToPageQueryParam(pageQueryParam, page);
    }
  }

  #navigateToPageQueryParam(pageQueryParam: string, page: number): void {
    void this.#router?.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams: {
        [pageQueryParam]: page === 1 ? null : page,
      },
      queryParamsHandling: 'merge',
    });
  }

  #createColDef(col: SkyDataGridColumn): ColDef {
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
    };
    if (col.dataType() === 'date') {
      (colDef.type as string[]).push(SkyCellType.Date);
      colDef.cellDataType = 'dateString';
    } else if (field && col.dataType() === 'number') {
      (colDef.type as string[]).push(SkyCellType.Number);
      colDef.cellDataType = 'number';
      colDef.valueGetter = (params): number | null => {
        const n = Number(params.data?.[field]);
        return Number.isFinite(n) ? n : null;
      };
    } else if (col.dataType() === 'boolean') {
      colDef.cellDataType = 'boolean';
    } else {
      (colDef.type as string[]).push(SkyCellType.Text);
      colDef.cellDataType = 'text';
    }
    const colWithTemplate = col as unknown as {
      cellTemplate: Signal<TemplateRef<unknown> | undefined>;
    };
    if (colWithTemplate.cellTemplate()) {
      (colDef.type as string[]).push(SkyCellType.Template);
      colDef.cellRendererParams = { template: colWithTemplate.cellTemplate };
    }
    if (!this.autoSort()) {
      colDef.comparator = (): number => 0;
    }
    this.#applyColumnWidthSettings(col, colDef);
    return colDef;
  }

  #applyColumnWidthSettings(col: SkyDataGridColumn, colDef: ColDef): void {
    if (Number.isFinite(col.flexWidth())) {
      colDef.flex = col.flexWidth();
      colDef.initialFlex = col.flexWidth();
      if (Number.isFinite(col.width())) {
        colDef.minWidth = col.width();
      }
    } else if (Number.isFinite(col.width())) {
      colDef.initialWidth = col.width();
      colDef.suppressAutoSize = true;
    }
    if (!col.resizable() || col.flexWidth() === 0) {
      colDef.suppressSizeToFit = true;
      colDef.suppressAutoSize = true;
      if (!col.resizable() && Number.isFinite(col.width())) {
        colDef.minWidth = col.width();
        colDef.maxWidth = col.width();
      }
    }
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

  #hasFlexColumns(): boolean {
    return this.#columnDefs().some((col) => !!col.initialFlex);
  }

  #getAutoSizeStrategy(): AutoSizeStrategy | undefined {
    if (this.#hasFlexColumns()) {
      // Avoid the console warning if `autoSizeColumns` is called on a grid with flex columns, so skip it.
      return undefined;
    }
    return {
      type: 'fitCellContents',
      skipHeader: true,
      scaleUpToFitGridWidth: this.columnFit() === 'container',
    };
  }

  #getRowSelection(): RowSelectionOptions<SkyDataGridRowData> {
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
