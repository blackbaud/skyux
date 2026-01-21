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
  ColDef,
  DisplayedColumnsChangedEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridPreDestroyedEvent,
  IRowNode,
  ModuleRegistry,
  SelectionChangedEvent,
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
    '[style.height.px]': 'height() || undefined',
    '[style.width.px]': 'width() || undefined',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGridComponent<
  T extends { id: string } = Record<string, unknown> & { id: string },
> {
  /**
   * The data for the grid. Each item requires an `id` and a property that maps
   * to the `field` or `id` property of each column in the grid.
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
   * The columns to display by default based on the ID or field of the item.
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
   * The columns to hide by default based on the ID or field of the item.
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
   * The filter state from a filter bar. When provided, filters are automatically
   * applied to columns that have matching `filterId` values.
   *
   * - When filtering a boolean column, use a `boolean` as the filter value with `'equals' | 'notEqual'` as the operator.
   * - When filtering a date column, use a `SkyDateRange` as the filter value.
   * - When filtering a number column, use a `SkyDataGridNumberRangeFilterValue`.
   * - When filtering a text column, use `string | string[]` as the filter value to match one or more text values.
   */
  public readonly appliedFilters = input<
    SkyFilterStateFilterItem<
      (T[keyof T] extends string ? string[] : T[keyof T]) | string
    >[]
  >([]);

  /**
   * How the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default `'width'`
   */
  public readonly fit = input<'width' | 'scroll'>('width');

  /**
   * The height of the grid. For best performance, large grids should set a `height` value and not enable `wrapText` on
   * any column so that rows can be virtually drawn as needed. Not setting a `height` or enabling `wrapText` on forces
   * the grid to draw every row in order to determine the scroll height.
   * @default `0`
   */
  public readonly height = input<number, unknown>(0, {
    transform: (val: unknown) => coerceNumberProperty(val, 0),
  });

  /**
   * The unique ID that matches a property on the `data` object.
   * @default `'id'`
   */
  public readonly multiselectRowId = input<keyof T, unknown>('id', {
    transform: (value: unknown) => String(value) as keyof T,
  });

  /**
   * The current page number of the grid. When using `pageQueryParam`, this value should come from the query parameter.
   * @default `1`
   */
  public readonly page = input<number, unknown>(1, {
    transform: (val: unknown) => coerceNumberProperty(val, 1),
  });

  /**
   * The number of items to display per page. Set to `0` to disable pagination.
   * @default `0`
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
   * Move the horizontal scrollbar to just below the header row.
   * @default false
   */
  public readonly enableTopScroll = input<boolean, unknown>(false, {
    transform: coerceBooleanProperty,
  });

  /**
   * The total number of records. When this input is set, it is expected that `data` will be updated for each
   * `pageChange`, `sortChange`, filter change, and search (when using search such as with a SKY UX data manager).
   * If this input is not set, the data grid will page, sort, filter, and apply SKY UX data manager search text to the
   * `data` provided.
   * @default `undefined`
   */
  public readonly totalRowCount = input<number | undefined>(undefined);
  readonly #useInternalFilters = computed(() => {
    const totalRowCount = this.totalRowCount();
    return typeof totalRowCount === 'undefined';
  });

  /**
   * View ID when using SKY UX Data Manager. When this input is set,
   * `sky-data-grid` becomes a `sky-data-view` for SKY UX Data Manager.
   * Requires `SkyDataManagerService` to be provided and configured.
   */
  public readonly viewId = input<string>();

  /**
   * The width of the grid in pixels.
   * @default `0`
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
   * When `pageSize > 0` and `pageQueryParam` is not set, emits the current page when the paging through data.
   * When using `pageQueryParam`, the changes should come through the `Router`.
   */
  public readonly pageChange = output<number>();

  /**
   * Fires when users cancel the deletion of a row.
   */
  public readonly rowDeleteCancel = output<SkyAgGridRowDeleteCancelArgs>();

  /**
   * Fires when users confirm the deletion of a row.
   */
  public readonly rowDeleteConfirm = output<SkyAgGridRowDeleteConfirmArgs>();

  /**
   * Fires when the column sorting changes.
   */
  public readonly sortChange = output<SkyDataGridSort>();

  protected readonly columns = contentChildren(SkyDataGridColumnComponent);
  protected readonly gridApi = signal<GridApi | undefined>(undefined);
  protected readonly gridOptions = computed(() => {
    const columnDefs = this.#columnDefs();
    if (columnDefs.length === 0) {
      return undefined;
    }
    const hasPageSize = this.pageSize() > 0;
    const useInternalFilters = this.#useInternalFilters();
    const pagination = hasPageSize && useInternalFilters;
    const paginationPageSize =
      (useInternalFilters && this.pageSize()) || undefined;
    return this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs,
        context: {
          enableTopScroll: this.enableTopScroll(),
        },
        domLayout: this.height() ? 'normal' : 'autoHeight',
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination,
        suppressPaginationPanel: true,
        paginationPageSize,
        rowData: this.rowData(),
        getRowId: (params: GetRowIdParams<T>) =>
          params.data[this.multiselectRowId() as keyof T] as string,
        rowSelection: this.enableMultiselect()
          ? {
              checkboxes: true,
              checkboxLocation: 'selectionColumn',
              headerCheckbox: true,
              mode: 'multiRow',
            }
          : {
              checkboxes: false,
              mode: 'singleRow',
            },
        autoSizeStrategy:
          this.fit() === 'width' || this.width()
            ? {
                type: 'fitGridWidth',
              }
            : {
                type: 'fitCellContents',
              },
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
    (): ((node: IRowNode) => boolean) => {
      const appliedFilters = this.appliedFilters();
      const columns = this.columns().map((col) => ({
        filterId: col.filterId(),
        field: col.field() as keyof T | undefined,
        filterOperator: col.filterOperator(),
        type: col.type(),
      }));
      return (node: IRowNode<T>): boolean =>
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

  constructor() {
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
      this.enableMultiselect();
      const api = untracked(() => this.gridApi());
      const options = untracked(() => this.gridOptions());
      if (api && options) {
        api.setGridOption('rowSelection', options.rowSelection);
      }
    });
    effect(() => {
      this.height();
      const api = untracked(() => this.gridApi());
      const options = untracked(() => this.gridOptions());
      if (api && options) {
        api.setGridOption('domLayout', options.domLayout);
      }
    });
    effect(() => {
      this.pageSize();
      this.#useInternalFilters();
      const api = untracked(() => this.gridApi());
      const options = untracked(() => this.gridOptions());
      if (api && options) {
        api.setGridOption('pagination', options.pagination);
        api.setGridOption('paginationPageSize', options.paginationPageSize);
      }
    });
    effect(() => {
      const api = this.gridApi();
      const selectedRowIds = coerceStringArray(this.selectedRowIds());
      this.data();
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
      const api = untracked(() => this.gridApi());
      api?.setGridOption('quickFilterText', searchText);
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
}
