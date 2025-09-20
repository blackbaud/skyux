import { coerceNumberProperty } from '@angular/cdk/coercion';
import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  inject,
  numberAttribute,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataViewStateOptions,
} from '@skyux/data-manager';
import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';
import { SkyPagingModule } from '@skyux/lists';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  Column,
  ColumnResizedEvent,
  GridOptions,
  SelectionChangedEvent,
} from 'ag-grid-community';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  filter,
  map,
  takeUntil,
} from 'rxjs';

import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridColumnModelInterface } from './grid-column.model';
import { ColDefWithField, SkyGridService } from './grid.service';
import { SkyGridColumnDescriptionModelChange } from './types/grid-column-description-model-change';
import { SkyGridColumnHeadingModelChange } from './types/grid-column-heading-model-change';
import { SkyGridColumnWidthModelChange } from './types/grid-column-width-model-change';
import { SkyGridMessage } from './types/grid-message';
import { SkyGridMessageType } from './types/grid-message-type';
import {
  SkyGridDefaultOptions,
  SkyGridOptions,
} from './types/grid-options.type';
import { SkyGridRowDeleteCancelArgs } from './types/grid-row-delete-cancel-args';
import { SkyGridRowDeleteConfirmArgs } from './types/grid-row-delete-confirm-args';
import { SkyGridSelectedRowsModelChange } from './types/grid-selected-rows-model-change';
import { SkyGridSelectedRowsSource } from './types/grid-selected-rows-source';

let nextId = 0;

@Component({
  selector: 'sky-grid',
  imports: [
    AgGridModule,
    AsyncPipe,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyPagingModule,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyGridComponent<TData extends Record<string, unknown> = any>
  implements AfterViewInit, OnChanges, OnDestroy
{
  /**
   * Columns and column properties for the grid. Provide either this input or use `sky-grid-column` child components.
   */
  @Input()
  public columns: Iterable<SkyGridColumnModelInterface> | undefined;

  /**
   * The data for the grid. Each item requires an `id` and a property that maps
   * to the `field` or `id` property of each column in the grid.
   */
  @Input()
  public data: TData[] | undefined;

  /**
   * Whether to enable the multiselect feature to display a column of
   * checkboxes on the left side of the grid. You can specify a unique ID with
   * the `multiselectRowId` property, but multiselect defaults to the `id` property on
   * the `data` object.
   * @default false
   */
  @Input()
  public enableMultiselect = false;

  /**
   * How the grid fits to its parent. The valid options are `width`,
   * which fits the grid to the parent's full width, and `scroll`, which allows the grid
   * to exceed the parent's width. If the grid does not have enough columns to fill
   * the parent's width, it always stretches to the parent's full width.
   * @default "width"
   */
  @Input()
  public fit = 'width';

  /**
   * Whether to display a toolbar with the grid.
   */
  @Input()
  public hasToolbar = false;

  /**
   * The height of the grid.
   */
  @Input()
  public height: number | undefined;

  /**
   * Text to highlight within the grid.
   * Typically, this property is used in conjunction with search.
   */
  @Input()
  public highlightText: string;

  /**
   * The observable to send commands to the grid.
   */
  @Input()
  public set messageStream(value: Subject<SkyGridMessage> | undefined) {
    this.#_messageStream?.unsubscribe();
    this.#_messageStream = value;

    this.#_messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyGridMessage) => {
        this.#handleIncomingMessages(message);
      });
  }

  /**
   * The unique ID that matches a property on the `data` object.
   * By default, this property uses the `id` property.
   */
  @Input()
  public multiselectRowId = 'id';

  /**
   * The options for the grid. Providing individual options as inputs will override these values.
   */
  @Input()
  public options: Partial<SkyGridOptions> | undefined;

  /**
   * When using paged data, what is the current page number.
   */
  @Input({ transform: (value: unknown) => coerceNumberProperty(value) })
  public page = 1;

  /**
   * The ID of the row to highlight. The ID matches the `id` property
   * of the `data` object. Typically, this property is used in conjunction with
   * the flyout component to indicate the currently selected row.
   */
  @Input()
  public rowHighlightedId: string;

  /**
   * The columns to display in the grid based on the `id` or `field` properties
   * of the columns. If no columns are specified, then the grid displays all columns.
   */
  @Input()
  public selectedColumnIds: string[] | undefined;

  /**
   * The set of IDs for the rows to select in a multiselect grid.
   * The IDs match the `id` properties of the `data` objects.
   * Rows with IDs that are not included are de-selected in the grid.
   */
  @Input()
  public set selectedRowIds(value: string[] | undefined) {
    this.agGrid?.api.deselectAll();
    value?.forEach((id) => this.agGrid?.api.getRowNode(id)?.setSelected(true));
  }

  /**
   * The unique key for the UI Config Service to retrieve stored settings from a database.
   * The UI Config Service saves configuration settings for users and returns
   * `selectedColumnIds` to preserve the columns to display and the preferred column order. You  must provide `id` values for your `sky-grid-column` elements because the UI Config Service depends on those values to organize columns based on user settings. For more information about the UI Config Service, see [the sticky settings documentation](https://developer.blackbaud.com/skyux/learn/develop/sticky-settings).
   */
  @Input()
  public settingsKey: string;

  /**
   * Displays a caret in the column that was used to sort the grid. This is particularly useful
   * when you programmatically sort data and want to visually indicate how the grid was sorted.
   * This property accepts a `ListSortFieldSelectorModel` value with the following properties:
   * - `fieldSelector` Represents the current sort field. This property accepts `string` values.
   * - `descending` Indicates whether to sort in descending order. The caret that visually
   * indicates the sort order points down for descending order and up for ascending order.
   * This property accepts `boolean` values. Default is `false`.
   */
  @Input()
  public sortField: ListSortFieldSelectorModel;

  /**
   * The width of the grid in pixels.
   */
  @Input({ transform: numberAttribute })
  public width: number | undefined;

  /**
   * Fires when the width of a column changes.
   */
  @Output()
  public columnWidthChange = new EventEmitter<
    Array<SkyGridColumnWidthModelChange>
  >();

  /**
   * Fires when the selection of multiselect checkboxes changes.
   * Emits an array of IDs for the selected rows based on the `multiselectRowId` property
   * that the consumer provides.
   */
  @Output()
  public multiselectSelectionChange =
    new EventEmitter<SkyGridSelectedRowsModelChange>();

  /**
   * @internal
   */
  @Output()
  public rowDeleteCancel = new EventEmitter<SkyGridRowDeleteCancelArgs>();

  /**
   * @internal
   */
  @Output()
  public rowDeleteConfirm = new EventEmitter<SkyGridRowDeleteConfirmArgs>();

  /**
   * Fires when the columns to display in the grid change or when the order of the columns changes.
   * The event emits an array of IDs for the displayed columns that reflects the column order.
   */
  @Output()
  public selectedColumnIdsChange = new EventEmitter<Array<string>>();

  /**
   * Fires when the active sort field changes.
   */
  @Output()
  public sortFieldChange = new EventEmitter<ListSortFieldSelectorModel>();

  @ContentChildren(SkyGridColumnComponent)
  protected columnComponents: QueryList<SkyGridColumnComponent> | undefined;

  @ViewChild(AgGridAngular)
  protected set agGrid(grid: AgGridAngular | undefined) {
    if (this.#_agGrid) {
      this.#gridChanged.next();
    }

    this.#_agGrid = grid;

    if (grid) {
      grid.selectionChanged
        .pipe(takeUntil(this.#ngUnsubscribe), takeUntil(this.#gridChanged))
        .subscribe((event: SelectionChangedEvent) => {
          if (event.source === 'api' || event.source === 'rowClicked') {
            this.#emitSelectedRows(SkyGridSelectedRowsSource.CheckboxChange);
          }
        });

      grid.columnVisible
        .pipe(takeUntil(this.#ngUnsubscribe), takeUntil(this.#gridChanged))
        .subscribe(() => {
          this.selectedColumnIdsChange.emit(
            grid.api.getAllDisplayedColumns().map((col) => col.getId()),
          );
        });

      grid.columnResized
        .pipe(takeUntil(this.#ngUnsubscribe), takeUntil(this.#gridChanged))
        .subscribe((event: ColumnResizedEvent) => {
          if (event.finished) {
            const columnWidthChanges: SkyGridColumnWidthModelChange[] = [];

            grid.api.getAllGridColumns().forEach((col: Column) => {
              columnWidthChanges.push({
                id: col.getId(),
                field: col.getColDef().field,
                width: col.getActualWidth(),
              });
            });
            this.columnWidthChange.emit(columnWidthChanges);
          }
        });

      grid.sortChanged
        .pipe(takeUntil(this.#ngUnsubscribe), takeUntil(this.#gridChanged))
        .subscribe(() => {
          const colStates = grid.api.getColumnState();

          for (const col of colStates) {
            if (col.sort) {
              this.sortFieldChange.emit({
                descending: col.sort === 'desc',
                fieldSelector: grid.api.getColumnDef(col.colId).field,
              });
              return;
            }
          }
        });

      grid.api.addEventListener('firstDataRendered', () => {
        this.pageCount$.next(grid.api.paginationGetTotalPages());
        if (this.page > 1) {
          this.pageChange(this.page);
        }
      });

      grid.api.addEventListener('rowDataUpdated', () => {
        this.pageCount$.next(grid.api.paginationGetTotalPages());
      });

      grid.api.addEventListener('filterChanged', () => {
        this.pageCount$.next(grid.api.paginationGetTotalPages());
      });
    }
  }

  protected get agGrid(): AgGridAngular | undefined {
    return this.#_agGrid;
  }

  protected get hostWidth(): string | undefined {
    if (this.width) {
      return `${this.width}px`;
    } else {
      return '100%';
    }
  }

  protected readonly heightOfGrid = new BehaviorSubject<string>('400px');

  protected readonly gridOptions$ = new BehaviorSubject<GridOptions | false>(
    false,
  );
  protected rowDeleteIds: string[] = [];
  protected readonly pageCount$ = new BehaviorSubject<number>(0);
  protected readonly viewId = `SkyGrid${nextId++}`;

  protected get settings(): SkyGridOptions {
    return {
      ...SkyGridDefaultOptions,
      ...this.options,
      getDataManagerState: () => this.#currentState,
      enableMultiselect: this.enableMultiselect,
      multiselectRowId: this.multiselectRowId,
      rowHighlightId: this.rowHighlightedId,
      settingsKey: this.settingsKey,
      viewId: this.viewId,
    };
  }

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService);
  #dataManagerViewState: SkyDataViewStateOptions | undefined;
  readonly #gridService = inject(SkyGridService);
  readonly #router = inject(Router, { optional: true });
  #subscriptions = new Subscription();
  #ngUnsubscribe = new Subject<void>();
  #gridChanged = new Subject<void>();
  #currentState: SkyDataManagerState | undefined;
  #viewReady = false;
  #_agGrid: AgGridAngular | undefined;
  #_messageStream: Subject<SkyGridMessage> | undefined;

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.#viewReady = true;
      this.#dataManagerService
        .getDataStateUpdates(this.viewId)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((newState) => {
          this.#currentState = newState;
          this.agGrid?.api.onFilterChanged();
        });

      this.gridOptions$.next(
        this.#gridService.readGridOptionsFromColumns(
          this.settings,
          this.columns || this.columnComponents,
          this.data || [],
        ),
      );
      this.#updateGridView();
    });

    this.columnComponents.changes
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        const colDefs = this.#gridService.getAgGridColDefs(
          this.settings,
          this.columnComponents,
        );
        this.agGrid?.api.setGridOption('columnDefs', colDefs);
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.#viewReady) {
      if (Object.keys(changes).length === 1 && changes['data']) {
        this.agGrid?.api.setGridOption('rowData', this.data || []);
      } else if (
        [
          'enableMultiselect',
          'settingsKey',
          'columns',
          'sortField',
          'highlightText',
        ].some((key) => key in changes)
      ) {
        if (changes['columns']) {
          this.#updateColumns();
        }
        this.#updateGridView();
        this.agGrid?.api.setGridOption('rowData', this.data || []);
      }
      if ('selectedColumnIds' in changes) {
        const select = this.selectedColumnIds;
        if (select.length > 0) {
          const columns = this.agGrid?.api.getColumns();
          this.agGrid?.api.applyColumnState({
            state: columns
              .filter(
                (col) =>
                  select.includes(col.getColId()) ||
                  col.getColDef().lockVisible,
              )
              .map((col) => ({
                colId: col.getColId(),
                hide: false,
              })),
            defaultState: {
              hide: true,
            },
          });
        } else {
          this.agGrid?.api.applyColumnState({
            defaultState: {
              hide: false,
            },
          });
        }
      }
      if ('rowHighlightedId' in changes) {
        this.agGrid?.api.setGridOption(
          'getRowClass',
          this.#gridService.getRowClassFn(this.settings),
        );
      }

      if (['rowHighlightedId', 'highlightText'].some((key) => key in changes)) {
        this.agGrid?.api.redrawRows();
      }
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public updateColumnHeading(change: SkyGridColumnHeadingModelChange): void {
    const columns = this.#getAgGridColDefs();

    const foundColumnModel = columns.find((column) => {
      return (
        (change.id !== undefined && change.id === column.colId) ||
        (change.field !== undefined && change.field === column.field)
      );
    });

    /* istanbul ignore else */
    if (foundColumnModel) {
      foundColumnModel.headerName = change.value;
      this.agGrid?.api.setGridOption('columnDefs', columns);
    }
  }

  public updateColumnDescription(
    change: SkyGridColumnDescriptionModelChange,
  ): void {
    const columns = this.#getAgGridColDefs();

    const foundColumnModel = columns.find((column) => {
      return (
        (change.id !== undefined && change.id === column.colId) ||
        (change.field !== undefined && change.field === column.field)
      );
    });

    /* istanbul ignore else */
    if (foundColumnModel) {
      foundColumnModel.headerComponentParams.description = change.value;
      this.agGrid?.api.setGridOption('columnDefs', columns);
    }
  }

  protected pageChange(page: number): void {
    if (
      this.settings.pageQueryParam &&
      (!this.#activatedRoute.snapshot.queryParamMap.has(
        this.settings.pageQueryParam,
      ) ||
        this.#activatedRoute.snapshot.queryParamMap.get(
          this.settings.pageQueryParam,
        ) !== `${page}`)
    ) {
      // When using a query parameter, send the change through the router.
      void this.#router?.navigate(['.'], {
        relativeTo: this.#activatedRoute,
        queryParams: {
          [this.settings.pageQueryParam]: coerceNumberProperty(page),
        },
        queryParamsHandling: 'merge',
      });
    } else if (page) {
      this.#goToPage(`${page}`);
    }
  }

  #updateGridView(): void {
    const existingView = this.#dataManagerService.getViewById(this.viewId);
    this.#dataManagerViewState = this.#getDataManagerColumnsViewState();
    const sort = this.sortField
      ? {
          descending: this.sortField.descending,
          propertyName: this.sortField.fieldSelector,
          id: this.sortField.fieldSelector,
          label: '',
        }
      : undefined;
    if (existingView) {
      const newState = new SkyDataManagerState({
        ...this.#currentState,
        views: [this.#dataManagerViewState],
        activeSortOption: sort,
        highlightText: this.highlightText,
      });

      this.#currentState = newState;
      this.#dataManagerService.updateDataState(newState, this.viewId);
      this.agGrid?.api.onFilterChanged();
    } else {
      const viewConfig = this.#getViewConfig();
      this.#dataManagerService.initDataView(viewConfig);
      this.#dataManagerService.initDataManager({
        activeViewId: this.viewId,
        dataManagerConfig: {
          listDescriptor: this.settings.listDescriptor,
        },
        defaultDataState: new SkyDataManagerState({
          views: [this.#dataManagerViewState],
          activeSortOption: sort,
          highlightText: this.highlightText,
        }),
        settingsKey: this.settings.settingsKey,
      });
    }

    this.#subscriptions.unsubscribe();
    this.#subscriptions = new Subscription();

    // Changes to the page number in the URL.
    if (this.settings.pageQueryParam && this.#activatedRoute && this.#router) {
      const pageQueryParam = this.settings.pageQueryParam;

      this.#subscriptions.add(
        this.#activatedRoute?.queryParamMap
          .pipe(map((params) => params.get(pageQueryParam) || '1'))
          .subscribe((page) => this.#goToPage(page)),
      );

      this.#subscriptions.add(
        this.#router?.events
          .pipe(filter((event) => event instanceof NavigationEnd))
          .subscribe(() => {
            const page =
              this.#activatedRoute?.snapshot.paramMap.get(pageQueryParam);
            this.#goToPage(`${page}`);
          }),
      );
    }

    setTimeout(() => {
      // Set the height of the AG Grid element.
      if (this.height) {
        this.heightOfGrid.next(`${this.height}px`);
      } else if (
        this.settings.pageSize ||
        Number.isInteger(this.settings.visibleRows)
      ) {
        this.heightOfGrid.next(`calc(
            var(--ag-header-height)
            + var(--ag-row-height) * ${
              this.settings.pageSize || this.settings.visibleRows
            }
            + 2px
          )`);
      } else {
        this.heightOfGrid.next(`auto`);
      }
    });
  }

  #getAgGridColDefs(): ColDefWithField<TData>[] {
    const gridOptions = this.gridOptions$.value;
    if (!gridOptions) {
      return [];
    }
    return (gridOptions as GridOptions).columnDefs as ColDefWithField<TData>[];
  }

  #getDataManagerColumnsViewState(): SkyDataViewStateOptions {
    const columnDefs = this.#getAgGridColDefs();
    const columnIds = columnDefs.map((column) => column.field);
    const displayedColumnIds = columnDefs
      .filter((column) => !column.hide || column.lockVisible)
      .map((column) => column.field);
    return {
      columnIds,
      displayedColumnIds,
      viewId: this.viewId,
    };
  }

  #goToPage(page: string): void {
    const number = Number(page);
    if (number > 0) {
      this.page = number;
      this.agGrid?.api?.paginationGoToPage(this.page - 1);
      this.#changeDetectorRef.detectChanges();
    }
  }

  #getViewConfig(): SkyDataViewConfig {
    return {
      id: this.viewId,
      name: 'Grid View',
      searchEnabled: this.settings.searchEnabled,
      searchHighlightEnabled: this.settings.searchEnabled,
      sortEnabled: false,
      multiselectToolbarEnabled: this.settings.hasToolbar,
      columnPickerEnabled: this.settings.columnPickerEnabled,
      columnPickerSortStrategy: undefined,
      filterButtonEnabled: this.settings.filterButtonEnabled,
      showFilterButtonText: true,
      columnOptions: this.#getAgGridColDefs().map((col) => {
        return {
          id: col.field,
          label: col.headerName,
          alwaysDisplayed:
            col.suppressMovable || col.lockVisible || !col.headerName,
          initialHide: col.hide && !col.lockVisible,
        };
      }),
    };
  }

  #handleIncomingMessages(message: SkyGridMessage): void {
    switch (message.type) {
      case SkyGridMessageType.SelectAll:
        this.agGrid?.api.selectAll();
        this.#emitSelectedRows(SkyGridSelectedRowsSource.SelectAll);
        break;

      case SkyGridMessageType.ClearAll:
        this.agGrid?.api.deselectAll();
        this.#emitSelectedRows(SkyGridSelectedRowsSource.ClearAll);
        break;

      case SkyGridMessageType.PromptDeleteRow:
        this.rowDeleteIds = [
          ...new Set([...this.rowDeleteIds, message.data.promptDeleteRow.id]),
        ];
        break;

      case SkyGridMessageType.AbortDeleteRow:
        this.rowDeleteIds = this.rowDeleteIds.filter(
          (id) => id !== message.data.abortDeleteRow.id,
        );
        break;
    }
  }

  #updateColumns(): void {
    const colDefs = this.#gridService.getAgGridColDefs(
      this.settings,
      this.columns,
    );
    this.agGrid?.api.setGridOption('columnDefs', colDefs);
  }

  #emitSelectedRows(source: SkyGridSelectedRowsSource): void {
    const selectedRows: SkyGridSelectedRowsModelChange = {
      selectedRowIds: this.agGrid?.api.getSelectedNodes().map((row) => row.id),
      source: source,
    };
    this.multiselectSelectionChange.emit(selectedRows);
  }
}
