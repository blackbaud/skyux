import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  SkyGridColumnComponent,
  SkyGridColumnDescriptionModelChange,
  SkyGridColumnHeadingModelChange,
  SkyGridColumnModel,
  SkyGridComponent,
  SkyGridMessage,
  SkyGridMessageType,
  SkyGridSelectedRowsModelChange,
  SkyGridSelectedRowsSource,
} from '@skyux/grids';
import {
  ListSearchModel,
  ListSelectedModel,
  ListState,
  ListStateDispatcher,
  ListViewComponent,
} from '@skyux/list-builder';
import { AsyncList, getValue } from '@skyux/list-builder-common';
import {
  ListItemModel,
  ListSortFieldSelectorModel,
  getData,
  isObservable,
} from '@skyux/list-builder-common';

import { Observable, Subject, of as observableOf } from 'rxjs';
import {
  distinctUntilChanged,
  map as observableMap,
  scan,
  take,
  takeUntil,
} from 'rxjs/operators';

import { ListViewGridColumnsLoadAction } from './state/columns/load.action';
import { ListViewDisplayedGridColumnsLoadAction } from './state/displayed-columns/load.action';
import { GridStateModel } from './state/grid-state.model';
import { GridStateDispatcher } from './state/grid-state.rxstate';
import { GridState } from './state/grid-state.state-node';
import { SkyListViewGridMessage } from './types/list-view-grid-message';
import { SkyListViewGridMessageType } from './types/list-view-grid-message-type';
import { SkyListViewGridRowDeleteCancelArgs } from './types/list-view-grid-row-delete-cancel-args';
import { SkyListViewGridRowDeleteConfirmArgs } from './types/list-view-grid-row-delete-confirm-args';

/**
 * Displays a grid for a
 * [SKY UX-themed list of data](https://developer.blackbaud.com/skyux/components/list/overview)
 * using the [grid component](https://developer.blackbaud.com/skyux/components/grid).
 * You must install `SkyListModule` as a dependency.
 */
@Component({
  selector: 'sky-list-view-grid',
  templateUrl: './list-view-grid.component.html',
  styleUrls: ['./list-view-grid.component.scss'],
  providers: [
    /* tslint:disable */
    {
      provide: ListViewComponent,
      useExisting: forwardRef(() => SkyListViewGridComponent),
    },
    /* tslint:enable */
    GridState,
    GridStateDispatcher,
    GridStateModel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyListViewGridComponent
  extends ListViewComponent
  implements AfterContentInit, OnDestroy
{
  /**
   * Specifies the name of the view.
   * @required
   */
  @Input()
  public set name(value: string) {
    this.viewName = value;
  }

  /**
   * Specifies the columns to display by default based on the ID or field of the item.
   */
  @Input()
  public displayedColumns: Array<string> | Observable<Array<string>>;

  /**
   * Specifies the columns to hide by default based on the ID or field of the item.
   */
  @Input()
  public hiddenColumns: Array<string> | Observable<Array<string>>;

  /**
   * Specifies how the grid fits to its parent. `"width"` fits the grid to the parent's full
   * width, and `"scroll"` allows the grid to exceed the parent's width. If the grid does not have
   * enough columns to fill the parent's width, it always stretches to the parent's full width.
   * @default "width"
   */
  @Input()
  public fit: string = 'width';

  /**
   * Specifies the width of the grid.
   */
  @Input()
  public width: number | Observable<number>;

  /**
   * Specifies the height of the grid.
   */
  @Input()
  public height: number | Observable<number>;

  /**
   * Indicates whether to highlight search text within the grid.
   * @default true
   */
  @Input()
  public highlightSearchText: boolean = true;

  /**
   * Provides an observable to send commands to the grid.
   * The commands should respect the `SkyListViewGridMessage` type.
   */
  @Input()
  public set messageStream(stream: Subject<SkyListViewGridMessage>) {
    /* istanbul ignore else */
    if (this._messageStream) {
      this._messageStream.unsubscribe();
    }

    this._messageStream = stream;

    this.initInlineDeleteMessages();
  }

  public get messageStream(): Subject<SkyListViewGridMessage> {
    return this._messageStream;
  }

  /**
   * Specifies the ID of the row to highlight. The ID matches the `id` property of
   * the `data` object. Typically, this property is used in conjunction with the
   * [flyout component](https://developer.blackbaud.com/skyux/components/flyout) to
   * indicate the currently selected row.
   */
  @Input()
  public rowHighlightedId: string;

  /**
   * Indicates whether to enable the multiselect feature to display a column of checkboxes
   * on the left side of the grid. Multiselect also displays an action bar with buttons to
   * select and clear all checkboxes. Multiselect defaults to the `id` property on the list's
   * `data` object.
   * @default false
   */
  @Input()
  public enableMultiselect: boolean = false;

  /**
   * Specifies a unique key for the UI Config Service to retrieve stored settings from
   * a database. The service saves configuration settings for users and returns `selectedColumnIds`
   * for the columns to display and the preferred column order. For more information, see the
   * [sticky settings documentation](https://developer.blackbaud.com/skyux/learn/get-started/advanced/sticky-settings).
   */
  @Input()
  public settingsKey: string;

  /**
   * Fires when users cancel the deletion of a row.
   */
  @Output()
  public rowDeleteCancel = new EventEmitter<SkyListViewGridRowDeleteCancelArgs>();

  /**
   * Fires when users confirm the deletion of a row.
   */
  @Output()
  public rowDeleteConfirm = new EventEmitter<SkyListViewGridRowDeleteConfirmArgs>();

  /**
   * Fires when columns change. This includes changes to the displayed columns and changes
   * to the order of columns. The event emits an array of IDs for the displayed columns that
   * reflects the column order.
   */
  @Output()
  public selectedColumnIdsChange = new EventEmitter<Array<string>>();

  @ViewChild(SkyGridComponent)
  public gridComponent: SkyGridComponent;

  public get gridHeight(): Observable<number> {
    /* istanbul ignore next */
    return typeof this.height === 'number'
      ? observableOf(this.height)
      : this.height;
  }

  public get gridWidth(): Observable<number> {
    /* istanbul ignore next */
    return typeof this.width === 'number'
      ? observableOf(this.width)
      : this.width;
  }

  public columns: Observable<Array<SkyGridColumnModel>>;

  public selectedColumnIds: Observable<Array<string>>;

  public items: Observable<ListItemModel[]>;

  /**
   * Message stream for communicating with the internal grid instance
   * @interal
   */
  public gridMessageStream = new Subject<SkyGridMessage>();

  public loading: Observable<boolean>;

  public sortField: Observable<ListSortFieldSelectorModel>;

  public currentSearchText: Observable<string>;

  public multiselectSelectedIds: string[] = [];

  /**
   * Specifies a search function to apply on the view data.
   * @param data Specifies the data to search.
   * @param searchText Specifies a text string to search for.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('search')
  public searchFunction: (data: any, searchText: string) => boolean;

  @ContentChildren(SkyGridColumnComponent)
  private columnComponents: QueryList<SkyGridColumnComponent>;

  private ngUnsubscribe = new Subject();

  private _messageStream = new Subject<SkyListViewGridMessage>();

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher,
    public gridState: GridState,
    public gridDispatcher: GridStateDispatcher
  ) {
    super(state, 'Grid View');
  }

  public ngAfterContentInit() {
    // Watch for selection changes and update multiselectSelectedIds for local comparison.
    this.state
      .pipe(
        observableMap((s) => s.selected.item),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(this.selectedMapEqual)
      )
      .subscribe((items: ListSelectedModel) => {
        const selectedIds: string[] = [];

        items.selectedIdMap.forEach((isSelected, id) => {
          if (items.selectedIdMap.get(id) === true) {
            selectedIds.push(id);
          }
        });

        this.multiselectSelectedIds = selectedIds;
      });

    /* istanbul ignore next */
    if (this.columnComponents.length === 0) {
      throw new Error(
        'Grid view requires at least one sky-grid-column to render.'
      );
    }

    let columnModels = this.columnComponents.map((columnComponent) => {
      return new SkyGridColumnModel(columnComponent.template, columnComponent);
    });

    if (this.width && !isObservable(this.width)) {
      this.width = observableOf(this.width);
    }

    if (this.height && !isObservable(this.height)) {
      this.height = observableOf(this.height);
    }

    // Setup Observables for template
    this.columns = this.gridState.pipe(
      observableMap((s) => s.columns.items),
      distinctUntilChanged(this.arraysEqual),
      takeUntil(this.ngUnsubscribe)
    );

    this.selectedColumnIds = this.getSelectedIds();

    this.items = this.getGridItems();

    this.loading = this.state.pipe(
      observableMap((s) => {
        return s.items.loading;
      }),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    );

    this.sortField = this.state.pipe(
      observableMap((s) => {
        /* istanbul ignore else */
        /* sanity check */
        if (s.sort && s.sort.fieldSelectors) {
          return s.sort.fieldSelectors[0];
        }
        /* istanbul ignore next */
        /* sanity check */
        return undefined;
      }),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    );

    this.gridState
      .pipe(
        observableMap((s) => s.columns.items),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(this.arraysEqual)
      )
      .subscribe((columns) => {
        /* istanbul ignore else */
        if (this.hiddenColumns) {
          getValue(this.hiddenColumns, (hiddenColumns: string[]) => {
            this.gridDispatcher.next(
              new ListViewDisplayedGridColumnsLoadAction(
                columns.filter((x) => {
                  /* istanbul ignore next */
                  /* sanity check */
                  let id = x.id || x.field;
                  return hiddenColumns.indexOf(id) === -1;
                }),
                true
              )
            );
          });
        } else if (this.displayedColumns) {
          /* istanbul ignore next */
          getValue(this.displayedColumns, (displayedColumns: string[]) => {
            this.gridDispatcher.next(
              new ListViewDisplayedGridColumnsLoadAction(
                columns.filter(
                  (x) => displayedColumns.indexOf(x.id || x.field) !== -1
                ),
                true
              )
            );
          });
        } else {
          this.gridDispatcher.next(
            new ListViewDisplayedGridColumnsLoadAction(
              columns.filter((x) => !x.hidden),
              true
            )
          );
        }
      });

    this.currentSearchText = this.state.pipe(
      observableMap((s) => s.search.searchText),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    );

    this.gridDispatcher.next(
      new ListViewGridColumnsLoadAction(columnModels, true)
    );

    this.handleColumnChange();

    if (this.enableMultiselect) {
      this.dispatcher.toolbarShowMultiselectToolbar(true);
    }

    this.initInlineDeleteMessages();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * If user makes selection, tell list-builder to update the list state.
   * This logic should only run on user interaction - NOT programmatic updates.
   */
  public onMultiselectSelectionChange(
    event: SkyGridSelectedRowsModelChange
  ): void {
    if (
      event.source === SkyGridSelectedRowsSource.CheckboxChange ||
      event.source === SkyGridSelectedRowsSource.RowClick
    ) {
      this.state
        .pipe(
          observableMap((s) => s.items.items),
          take(1)
        )
        .subscribe((items: ListItemModel[]) => {
          const newItemIds = this.arrayIntersection(
            items.map((i) => i.id),
            this.multiselectSelectedIds
          );
          const newIds = items.filter((i) => i.isSelected).map((i) => i.id);

          // Check for deselected ids & send message to dispatcher.
          const deselectedIds = this.arrayDiff(newItemIds, newIds);
          if (deselectedIds.length > 0) {
            this.dispatcher.setSelected(deselectedIds, false);
          }

          // Check for selected ids & send message to dispatcher.
          const selectedIds = this.arrayDiff(newIds, newItemIds);
          if (selectedIds.length > 0) {
            this.dispatcher.setSelected(selectedIds, true);
          }
        });
    }
  }

  public columnIdsChanged(selectedColumnIds: Array<string>) {
    this.selectedColumnIds.pipe(take(1)).subscribe((currentIds) => {
      if (!this.arraysEqual(selectedColumnIds, currentIds)) {
        this.gridState
          .pipe(
            observableMap((s) => s.columns.items),
            take(1)
          )
          .subscribe((columns) => {
            let displayedColumns = selectedColumnIds.map(
              (columnId) => columns.filter((c) => c.id === columnId)[0]
            );
            this.gridDispatcher.next(
              new ListViewDisplayedGridColumnsLoadAction(displayedColumns, true)
            );
          });
      }
    });
  }

  public cancelRowDelete(args: SkyListViewGridRowDeleteCancelArgs): void {
    this.rowDeleteCancel.emit(args);
  }

  public confirmRowDelete(args: SkyListViewGridRowDeleteConfirmArgs): void {
    this.rowDeleteConfirm.emit(args);
  }

  public sortFieldChanged(sortField: ListSortFieldSelectorModel) {
    this.dispatcher.sortSetFieldSelectors([sortField]);
  }

  public onViewActive() {
    /*
      Ran into problem where state updates were consumed out of order. For example, on search text
      update, the searchText update was consumed after the resulting list item update. Scanning the
      previous value of items lastUpdate ensures that we only receive the latest items.
    */
    this.gridState
      .pipe(
        takeUntil(this.ngUnsubscribe),
        scan((previousValue: GridStateModel, newValue: GridStateModel) => {
          if (
            previousValue.displayedColumns.lastUpdate >
            newValue.displayedColumns.lastUpdate
          ) {
            return previousValue;
          } else {
            return newValue;
          }
        }),
        observableMap((s) => s.displayedColumns.items),
        distinctUntilChanged(this.arraysEqual)
      )
      .subscribe((displayedColumns) => {
        let setFunctions =
          this.searchFunction !== undefined
            ? [this.searchFunction]
            : displayedColumns
                .map(
                  (column) => (data: any, searchText: string) =>
                    column.searchFunction(
                      getData(data, column.field),
                      searchText
                    )
                )
                .filter((c) => c !== undefined);

        this.state.pipe(take(1)).subscribe((s) => {
          this.dispatcher.searchSetOptions(
            new ListSearchModel({
              searchText: s.search.searchText,
              functions: setFunctions,
              fieldSelectors: displayedColumns.map((d) => d.field),
            })
          );
        });
      });
  }

  private initInlineDeleteMessages(): void {
    /* istanbul ignore next */
    if (this.messageStream) {
      this.messageStream.subscribe((message: SkyListViewGridMessage) => {
        if (message.type === SkyListViewGridMessageType.AbortDeleteRow) {
          this.gridMessageStream.next({
            type: SkyGridMessageType.AbortDeleteRow,
            data: {
              abortDeleteRow: message.data.abortDeleteRow,
            },
          });
        } else if (
          message.type === SkyListViewGridMessageType.PromptDeleteRow
        ) {
          this.gridMessageStream.next({
            type: SkyGridMessageType.PromptDeleteRow,
            data: {
              promptDeleteRow: message.data.promptDeleteRow,
            },
          });
        }
      });
    }
  }

  private handleColumnChange() {
    // watch for changes in column components
    this.columnComponents.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((columnComponents) => {
        let columnModels = this.columnComponents.map((column) => {
          return new SkyGridColumnModel(column.template, column);
        });
        this.gridDispatcher.next(
          new ListViewGridColumnsLoadAction(columnModels, true)
        );
      });

    // Watch for column heading changes:
    this.columnComponents.forEach((comp) => {
      comp.headingModelChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((change: SkyGridColumnHeadingModelChange) => {
          this.gridComponent.updateColumnHeading(change);
        });
      comp.descriptionModelChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((change: SkyGridColumnDescriptionModelChange) => {
          this.gridComponent.updateColumnDescription(change);
        });
    });
  }

  private getGridItems(): Observable<Array<ListItemModel>> {
    /*
      Same problem as above. We should move from having a state object observable with a bunch of
      static properties to a static state object with observable properties that you can subscribe
      to.
    */
    return this.state.pipe(
      observableMap((s) => {
        return s.items;
      }),
      scan(
        (
          previousValue: AsyncList<ListItemModel>,
          newValue: AsyncList<ListItemModel>
        ) => {
          if (previousValue.lastUpdate > newValue.lastUpdate) {
            return previousValue;
          } else {
            return newValue;
          }
        }
      ),
      observableMap((result: AsyncList<ListItemModel>) => {
        return result.items;
      }),
      distinctUntilChanged()
    );
  }

  private getSelectedIds(): Observable<Array<string>> {
    /*
      Same problem as above. We should move from having a state object observable with a bunch of
      static properties to a static state object with observable properties that you can subscribe
      to.
    */
    return this.gridState.pipe(
      observableMap((s) => s.displayedColumns),
      scan(
        (
          previousValue: AsyncList<SkyGridColumnModel>,
          newValue: AsyncList<SkyGridColumnModel>
        ) => {
          if (previousValue.lastUpdate > newValue.lastUpdate) {
            return previousValue;
          } else {
            return newValue;
          }
        }
      ),
      observableMap((result: AsyncList<SkyGridColumnModel>) => {
        /* istanbul ignore next */
        /* sanity check */
        return result.items.map((column: SkyGridColumnModel) => {
          return column.id || column.field;
        });
      }),
      distinctUntilChanged((previousValue: string[], newValue: string[]) => {
        return this.haveColumnIdsChanged(previousValue, newValue);
      })
    );
  }

  private haveColumnIdsChanged(previousValue: string[], newValue: string[]) {
    if (previousValue.length !== newValue.length) {
      this.selectedColumnIdsChange.emit(newValue);
      return false;
    }

    for (let i = 0; i < previousValue.length; i++) {
      /* istanbul ignore if */
      if (previousValue[i] !== newValue[i]) {
        this.selectedColumnIdsChange.emit(newValue);
        return false;
      }
    }
    return true;
  }

  private selectedMapEqual(
    prev: ListSelectedModel,
    next: ListSelectedModel
  ): boolean {
    if (prev.selectedIdMap.size !== next.selectedIdMap.size) {
      return false;
    }

    let keys: string[] = [];
    next.selectedIdMap.forEach((value, key) => {
      keys.push(key);
    });

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const value = next.selectedIdMap.get(key);
      if (value !== prev.selectedIdMap.get(key)) {
        return false;
      }
    }

    return true;
  }

  private arrayDiff(arrA: Array<any>, arrB: Array<any>): Array<any> {
    return arrA.filter((i) => arrB.indexOf(i) < 0);
  }

  private arrayIntersection(arrA: Array<any>, arrB: Array<any>): Array<any> {
    return arrA.filter((value) => -1 !== arrB.indexOf(value));
  }

  private arraysEqual(arrayA: any[], arrayB: any[]) {
    return (
      arrayA.length === arrayB.length &&
      arrayA.every((value, index) => value === arrayB[index])
    );
  }
}
