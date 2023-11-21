import { coerceNumberProperty } from '@angular/cdk/coercion';
import { AsyncPipe, NgIf } from '@angular/common';
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
import { GridOptions } from 'ag-grid-community';
import { DragulaService } from 'ng2-dragula';
import {
  BehaviorSubject,
  ReplaySubject,
  Subject,
  Subscription,
  filter,
  map,
} from 'rxjs';

import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridColumnModel } from './grid-column.model';
import { SkyGridInlineHelpComponent } from './grid-inline-help/grid-inline-help.component';
import { ColDefWithField, SkyGridService } from './grid.service';
import { SkyGridColumnWidthModelChange } from './types/grid-column-width-model-change';
import { SkyGridMessage } from './types/grid-message';
import {
  SkyGridDefaultOptions,
  SkyGridOptions,
} from './types/grid-options.type';
import { SkyGridRowDeleteCancelArgs } from './types/grid-row-delete-cancel-args';
import { SkyGridRowDeleteConfirmArgs } from './types/grid-row-delete-confirm-args';
import { SkyGridSelectedRowsModelChange } from './types/grid-selected-rows-model-change';

let nextId = 0;

@Component({
  selector: 'sky-grid',
  standalone: true,
  imports: [
    AgGridModule,
    AsyncPipe,
    SkyGridInlineHelpComponent,
    NgIf,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyPagingModule,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  viewProviders: [DragulaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyGridComponent<TData extends Record<string, unknown>>
  implements AfterViewInit, OnChanges, OnDestroy
{
  /**
   * Columns and column properties for the grid.
   */
  @Input()
  public columns: SkyGridColumnModel[] | undefined;

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
  public height: number;

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
  public messageStream = new Subject<SkyGridMessage>();

  /**
   * The unique ID that matches a property on the `data` object.
   * By default, this property uses the `id` property.
   */
  @Input()
  public multiselectRowId: string;

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
  public selectedRowIds: string[] | undefined;

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

  @Input()
  public totalRows = 0;

  /**
   * The width of the grid in pixels.
   */
  @Input()
  public width: number;

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

  public displayedColumns: Array<SkyGridColumnModel>;

  @ContentChildren(SkyGridColumnComponent)
  protected columnComponents: QueryList<SkyGridColumnComponent> | undefined;

  @ViewChild(AgGridAngular)
  protected agGrid: AgGridAngular | undefined;

  protected readonly agGridStyle$ = new ReplaySubject<string>(1);

  protected readonly gridOptions$ = new BehaviorSubject<GridOptions | false>(
    false,
  );
  protected viewId = `SkyGrid${nextId++}`;

  protected get settings(): SkyGridOptions {
    return {
      ...SkyGridDefaultOptions,
      multiselectToolbarEnabled: this.enableMultiselect,
      settingsKey: this.settingsKey,
      totalRows: this.totalRows,
      viewId: this.viewId,
    };
  }

  readonly #activatedRoute = inject(ActivatedRoute, { optional: true });
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService);
  #dataManagerViewState: SkyDataViewStateOptions | undefined;
  readonly #gridService = inject(SkyGridService);
  readonly #router = inject(Router, { optional: true });
  readonly #subscriptionForDataManager = new Subscription();
  #subscriptions = new Subscription();
  #subscriptionForLayout = new Subscription();
  #viewReady = false;

  public ngAfterViewInit(): void {
    this.#viewReady = true;
    this.#subscriptionForDataManager.add(
      this.#dataManagerService
        .getDataStateUpdates(this.viewId)
        .subscribe((value) => {
          this.agGrid?.api.setQuickFilter(value.searchText || '');
          if (value.selectedIds) {
            this.agGrid.api.setServerSideSelectionState({
              selectAll: false,
              toggledNodes: value.selectedIds,
            });
          }
          if (value.onlyShowSelected) {
            const selected = this.agGrid.api.getSelectedRows();
            this.agGrid.api.setRowData(selected);
          }
        }),
    );
    if (this.columns) {
      this.#updateGridView();
    } else {
      setTimeout(() => {
        this.#subscriptionForDataManager.add(
          this.#gridService
            .readGridOptionsFromColumnComponents(
              this.settings,
              this.columnComponents,
            )
            .subscribe((agGridOptions) => {
              this.gridOptions$.next(agGridOptions);
              this.#updateGridView();
            }),
        );
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.#viewReady) {
      if (Object.keys(changes).length === 1 && changes['data']) {
        this.agGrid?.api.setRowData(this.data || []);
      } else if (
        ['enableMultiselect', 'settingsKey', 'viewId', 'columns'].some(
          (key) => key in changes,
        )
      ) {
        this.#updateGridView();
        this.agGrid?.api.setRowData(this.data || []);
      }
      if (['selectedColumnIds'].some((key) => key in changes)) {
        const select = this.selectedColumnIds;
        if (select.length > 0) {
          this.agGrid.columnApi.applyColumnState({
            state: select.map((colId) => ({
              colId,
              hide: false,
            })),
            defaultState: {
              hide: true,
            },
          });
        } else {
          this.agGrid.columnApi.applyColumnState({
            defaultState: {
              hide: false,
            },
          });
        }
      }
      if (
        ['multiselectRowId', 'rowHighlightedId'].some((key) => key in changes)
      ) {
        const select = this.multiselectRowId || this.rowHighlightedId;
        if (select) {
          this.agGrid.api.setServerSideSelectionState({
            selectAll: false,
            toggledNodes: [select],
          });
        } else {
          this.agGrid.api.deselectAll();
        }
      }
    }
  }

  public ngOnDestroy(): void {
    this.#subscriptionForDataManager.unsubscribe();
    this.#subscriptionForLayout.unsubscribe();
  }

  protected pageChange(page: number): void {
    if (this.settings.pageQueryParam) {
      this.#router
        ?.navigate(['.'], {
          relativeTo: this.#activatedRoute,
          queryParams: { page: coerceNumberProperty(page) },
          queryParamsHandling: 'merge',
        })
        .then();
    } else if (page) {
      this.#goToPage(`${page}`);
    }
  }

  #updateGridView(): void {
    if (this.columns) {
      this.gridOptions$.next(
        this.#gridService.readGridOptionsFromColumns(
          this.settings,
          this.columns,
        ),
      );
    }
    const existingView = this.#dataManagerService.getViewById(this.viewId);
    this.#dataManagerViewState = this.#getDataManagerColumnsViewState();
    const viewConfig = this.#getViewConfig();
    if (existingView) {
      this.#dataManagerService.updateViewConfig(viewConfig);
      this.#dataManagerService.updateDataState(
        new SkyDataManagerState({
          views: [this.#dataManagerViewState],
        }),
        this.viewId,
      );
    } else {
      this.#dataManagerService.initDataView(viewConfig);
      this.#dataManagerService.initDataManager({
        activeViewId: this.viewId,
        dataManagerConfig: {
          listDescriptor: this.settings.listDescriptor,
        },
        defaultDataState: new SkyDataManagerState({
          views: [this.#dataManagerViewState],
        }),
        settingsKey: this.settings.settingsKey,
      });
    }

    this.#subscriptions.unsubscribe();
    this.#subscriptions = new Subscription();
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
      .filter((column) => !column.hide)
      .map((column) => column.field);
    return {
      columnIds,
      displayedColumnIds,
      viewId: this.viewId,
    };
  }

  #goToPage(page: string): void {
    const number = Number(page);
    if (number > 0 && number !== this.page) {
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
      sortEnabled: false,
      multiselectToolbarEnabled: this.settings.multiselectToolbarEnabled,
      columnPickerEnabled: this.settings.columnPickerEnabled,
      filterButtonEnabled: this.settings.filterButtonEnabled,
      showFilterButtonText: true,
      columnOptions: this.#getAgGridColDefs().map((col) => {
        return {
          id: col.field,
          label: col.headerName || col.field,
          alwaysDisplayed: col.suppressMovable || !col.headerName,
          initialHide: col.hide,
        };
      }),
    };
  }
}
