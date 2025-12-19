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
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SkyLogService } from '@skyux/core';
import { SkyDateRange } from '@skyux/datetime';
import { SkyFilterBarFilterItem } from '@skyux/filter-bar';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyPagingModule } from '@skyux/lists';

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
  distinctUntilChanged,
  filter,
  fromEvent,
  fromEventPattern,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SkyAgGridRowDeleteDirective } from '../ag-grid-row-delete.directive';
import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridService } from '../ag-grid.service';
import { SkyAgGridRowDeleteCancelArgs } from '../types/ag-grid-row-delete-cancel-args';
import { SkyAgGridRowDeleteConfirmArgs } from '../types/ag-grid-row-delete-confirm-args';
import { SkyCellType } from '../types/cell-type';
import { SkyAgGridHeaderParams } from '../types/header-params';
import { SkyAgGridFilterOperator } from '../types/sky-ag-grid-filter-operator';
import { SkyAgGridNumberRangeFilterValue } from '../types/sky-ag-grid-filter-values';

import { SkyAgGridColumnComponent } from './sky-ag-grid-column.component';

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

@Component({
  selector: 'sky-ag-grid',
  imports: [
    AgGridAngular,
    SkyAgGridRowDeleteDirective,
    SkyAgGridWrapperComponent,
    SkyPagingModule,
    SkyWaitModule,
  ],
  templateUrl: './sky-ag-grid.component.html',
  styleUrl: './sky-ag-grid.component.css',
  host: {
    '[style.height.px]': 'height() || undefined',
    '[style.width.px]': 'width() || undefined',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridComponent<
  T extends { id: string } = Record<string, unknown> & { id: string },
> {
  /**
   * The data for the grid. Each item requires an `id` and a property that maps
   * to the `field` or `id` property of each column in the grid.
   */
  public readonly data = input<T[]>();

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
   */
  public readonly appliedFilters = input<SkyFilterBarFilterItem[]>([]);

  /**
   * How the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default "width"
   */
  public readonly fit = input<'width' | 'scroll'>('width');

  /**
   * The height of the grid.
   */
  public readonly height = input<number, unknown>(0, {
    transform: coerceNumberProperty,
  });

  /**
   * The unique ID that matches a property on the `data` object.
   * By default, this property uses the `id` property.
   */
  public readonly multiselectRowId = input<keyof T, unknown>('id', {
    transform: (value: unknown) => String(value) as keyof T,
  });

  /**
   * The current page number of the grid. When using `pageQueryParam`, this value should come from the query parameter.
   * @default 1
   */
  public readonly page = input<number, unknown>(1, {
    transform: coerceNumberProperty,
  });

  /**
   * The number of items to display per page. Set to `0` to disable pagination.
   * @default 0
   */
  public readonly pageSize = input<number, unknown>(0, {
    transform: coerceNumberProperty,
  });

  /**
   * The query parameter name to use for the current page number. When set, page changes are reflected in the URL.
   */
  public readonly pageQueryParam = input<string>();

  /**
   * The width of the grid in pixels.
   */
  public readonly width = input<number, unknown>(0, {
    transform: coerceNumberProperty,
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
  protected readonly rowDeleteIds = model<string[]>([]);

  /**
   * Fires when users cancel the deletion of a row.
   */
  public readonly rowDeleteCancel = output<SkyAgGridRowDeleteCancelArgs>();

  /**
   * Fires when users confirm the deletion of a row.
   */
  public readonly rowDeleteConfirm = output<SkyAgGridRowDeleteConfirmArgs>();

  protected readonly columns = contentChildren(SkyAgGridColumnComponent);
  protected readonly gridReady = signal(false);
  protected readonly gridApi = signal<GridApi | undefined>(undefined);
  protected readonly isExternalFilterPresent = computed(
    () => (this.appliedFilters() ?? []).length > 0,
  );
  protected readonly doesExternalFilterPass = computed(
    (): ((node: IRowNode) => boolean) => this.#doesFilterPass(),
  );
  protected readonly pageNumber = linkedSignal(this.page);

  readonly #gridDestroyed = toObservable(this.gridApi).pipe(
    filter(Boolean),
    switchMap((api) =>
      fromEventPattern<GridPreDestroyedEvent>((handler) =>
        api.addEventListener('gridPreDestroyed', handler),
      ),
    ),
  );
  readonly #gridService = inject(SkyAgGridService);
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
  readonly #columnDefs = computed<ColDef<T>[]>(() => {
    const columns = this.columns();
    const displayed = this.selectedColumnIds().filter(Boolean);
    const hidden = this.hiddenColumns().filter(Boolean);
    return columns.map((col): ColDef => {
      const colDef: ColDef = {
        headerName: col.heading(),
        headerComponentParams: {
          helpPopoverTitle: col.helpPopoverTitle(),
          helpPopoverContent: col.helpPopoverContent() || col.description(),
        } as SkyAgGridHeaderParams,
        hide:
          col.hidden() ||
          (displayed.length > 0 &&
            !displayed.includes(this.#getColumnIdOrField(col))) ||
          hidden.includes(this.#getColumnIdOrField(col)),
        sortable: col.isSortable(),
        lockPosition: col.locked(),
        suppressMovable: col.locked(),
        type: [],
      };
      if (col.field()) {
        colDef.field = col.field();
      }
      if (col.columnId()) {
        colDef.colId = col.columnId();
      }
      if (col.type() === 'date') {
        (colDef.type as string[]).push(SkyCellType.Date);
        colDef.cellDataType = 'dateString';
      } else if (col.type() === 'number') {
        (colDef.type as string[]).push(SkyCellType.Number);
        colDef.cellDataType = 'number';
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
      if (col.width() > 0) {
        colDef.initialWidth = col.width();
        colDef.suppressSizeToFit = true;
      }
      return colDef;
    });
  });

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #router = inject(Router, { optional: true });
  readonly #logger = inject(SkyLogService);

  protected readonly gridOptions = computed(() => {
    const columnDefs = this.#columnDefs();
    if (columnDefs.length === 0) {
      return undefined;
    }
    return this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs,
        domLayout: this.height() ? 'normal' : 'autoHeight',
        onGridReady: (args) => {
          this.gridApi.set(args.api);
          this.gridReady.set(true);
        },
        pagination: this.pageSize() > 0,
        suppressPaginationPanel: true,
        paginationPageSize: this.pageSize() || undefined,
        rowData: this.data(),
        getRowId: (params: GetRowIdParams<T>) =>
          params.data[this.multiselectRowId() as keyof T] as string,
        rowSelection: this.enableMultiselect()
          ? {
              checkboxes: true,
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
  protected readonly pageCount = computed(() => {
    const dataLength = this.data()?.length ?? 0;
    const pageSize = this.pageSize();
    const gridReady = this.gridReady();
    if (!gridReady || pageSize === 0) {
      return 0;
    }
    return Math.ceil(dataLength / pageSize);
  });

  constructor() {
    effect(() => {
      const api = untracked(() => this.gridApi());
      const data = this.data() ?? [];
      api?.setGridOption('rowData', data);
    });
    effect(() => {
      const api = untracked(() => this.gridApi());
      const columns = this.#columnDefs();
      api?.setGridOption('columnDefs', columns);
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
  }

  protected pageChange(page: number): void {
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
    }
  }

  #getColumnIdOrField(col: SkyAgGridColumnComponent): string {
    const id = col.columnId();
    const field = col.field() || '';
    return id || field;
  }

  #getRowIds(rows: (IRowNode | undefined)[] | null | undefined): string[] {
    return coerceArray(rows)
      .map((node) => node?.id as string)
      .filter(Boolean) as string[];
  }

  #doesFilterPass(): (node: IRowNode) => boolean {
    const appliedFilters = this.appliedFilters();
    const columns = this.columns();
    columns.forEach((column: SkyAgGridColumnComponent) => {
      // Track changes to filter operators
      column.filterOperator();
    });
    return (node: IRowNode): boolean => {
      for (const filter of appliedFilters) {
        // Find column with matching filterId
        let column = columns.find((col) => col.filterId() === filter.filterId);
        column ??= columns.find((col) => col.field() === filter.filterId);
        if (!column || filter.filterValue?.value === undefined) {
          continue;
        }

        const rowValue = node.data[column.field() as keyof T];
        const filterValue = filter.filterValue.value;
        const filterOperator: SkyAgGridFilterOperator | undefined =
          column.filterOperator();

        switch (column.type()) {
          case 'text':
            if (
              this.#textFilter(
                filterOperator ?? 'contains',
                filterValue as string,
                String(rowValue ?? ''),
              )
            ) {
              return false;
            }
            break;

          case 'number':
            if (this.#isNumberRangeFilter(filterValue)) {
              const range = filterValue;
              if (
                (range.from !== null && Number(rowValue) < range.from) ||
                (range.to !== null && Number(rowValue) > range.to)
              ) {
                return false;
              }
            } else if (
              this.#numericFilter(
                filterOperator ?? 'equals',
                Number(filterValue),
                Number(rowValue),
              )
            ) {
              return false;
            }
            break;

          case 'date':
            if (this.#isDateRangeFilter(filterValue)) {
              const rowDate = new Date(rowValue as string);
              const range = filterValue as SkyDateRange;
              if (
                (range.startDate && rowDate < new Date(range.startDate)) ||
                (range.endDate && rowDate > new Date(range.endDate))
              ) {
                return false;
              }
            } else {
              const rowDate = new Date(rowValue as string);
              const filterDate = new Date(filterValue as string);
              if (
                this.#numericFilter(
                  filterOperator ?? 'equals',
                  filterDate.setHours(0, 0, 0, 0),
                  rowDate.setHours(0, 0, 0, 0),
                )
              ) {
                return false;
              }
            }
            break;

          case 'boolean':
            if (
              filterOperator === 'notEqual' &&
              Boolean(rowValue) === Boolean(filterValue)
            ) {
              return false;
            } else if (
              (filterOperator ?? 'equals') === 'equals' &&
              Boolean(rowValue) !== Boolean(filterValue)
            ) {
              return false;
            } else if (
              filterOperator &&
              !['equals', 'notEqual'].includes(filterOperator)
            ) {
              this.#logger.warn(
                `Unsupported boolean filter operator: ${filterOperator}`,
              );
            }
            break;
        }
      }

      return true;
    };
  }

  #isNumberRangeFilter(
    value: unknown,
  ): value is SkyAgGridNumberRangeFilterValue {
    return (
      typeof value === 'object' &&
      value !== null &&
      'from' in value &&
      'to' in value &&
      (typeof (value as SkyAgGridNumberRangeFilterValue).from === 'number' ||
        typeof (value as SkyAgGridNumberRangeFilterValue).to === 'number') &&
      (typeof (value as SkyAgGridNumberRangeFilterValue).from === 'number' ||
        value.from === null) &&
      (typeof (value as SkyAgGridNumberRangeFilterValue).to === 'number' ||
        value.to === null)
    );
  }

  #isDateRangeFilter(value: unknown): value is SkyDateRange {
    return (
      typeof value === 'object' &&
      value !== null &&
      ('startDate' in value || 'endDate' in value) &&
      ((value as SkyDateRange).startDate instanceof Date ||
        (value as SkyDateRange).endDate instanceof Date)
    );
  }

  #textFilter(
    filterOperator: SkyAgGridFilterOperator,
    filterValue: string,
    rowValue: string,
  ): boolean {
    const rowString = rowValue.normalize().toLocaleLowerCase();
    const filterString = filterValue.normalize().toLocaleLowerCase();

    switch (filterOperator) {
      case 'equals':
        return rowString !== filterString;
      case 'notEqual':
        return rowString === filterString;
      case 'contains':
        return !rowString.includes(filterString);
      case 'notContains':
        return rowString.includes(filterString);
      case 'startsWith':
        return !rowString.startsWith(filterString);
      case 'endsWith':
        return !rowString.endsWith(filterString);
      default:
        this.#logger.warn(
          `Unsupported text filter operator: ${filterOperator}`,
        );
        return false;
    }
  }

  #numericFilter(
    filterOperator: SkyAgGridFilterOperator,
    filterValue: number,
    rowValue: number,
  ): boolean {
    switch (filterOperator) {
      case 'equals':
        return rowValue !== filterValue;
      case 'notEqual':
        return rowValue === filterValue;
      case 'lessThan':
        return rowValue >= filterValue;
      case 'lessThanOrEqual':
        return rowValue > filterValue;
      case 'greaterThan':
        return rowValue <= filterValue;
      case 'greaterThanOrEqual':
        return rowValue < filterValue;
      default:
        this.#logger.warn(
          `Unsupported number or date filter operator: ${filterOperator}`,
        );
        return false;
    }
  }
}
