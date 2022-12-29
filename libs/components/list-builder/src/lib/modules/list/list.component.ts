import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { AsyncItem, getValue } from '@skyux/list-builder-common';
import {
  ListItemModel,
  ListSortFieldSelectorModel,
  isObservable,
} from '@skyux/list-builder-common';

import {
  Observable,
  Subject,
  combineLatest as observableCombineLatest,
  of as observableOf,
} from 'rxjs';
import {
  distinctUntilChanged,
  flatMap,
  map as observableMap,
  skip,
  take,
  takeUntil,
} from 'rxjs/operators';

import { SkyListInMemoryDataProvider } from '../list-data-provider-in-memory/list-data-in-memory.provider';
import { ListFilterModel } from '../list-filters/filter.model';

import { ListDataRequestModel } from './list-data-request.model';
import { ListDataResponseModel } from './list-data-response.model';
import { ListDataProvider } from './list-data.provider';
import { ListViewComponent } from './list-view.component';
import { ListItemsLoadAction } from './state/items/load.action';
import { ListItemsSetLoadingAction } from './state/items/set-loading.action';
import { ListStateDispatcher } from './state/list-state.rxstate';
import { ListState } from './state/list-state.state-node';
import { ListPagingSetPageNumberAction } from './state/paging/set-page-number.action';
import { ListSearchModel } from './state/search/search.model';
import { ListSelectedLoadAction } from './state/selected/load.action';
import { ListSelectedModel } from './state/selected/selected.model';
import { ListSelectedSetLoadingAction } from './state/selected/set-loading.action';
import { ListSortSetFieldSelectorsAction } from './state/sort/set-field-selectors.action';
import { ListSortModel } from './state/sort/sort.model';
import { ListViewsLoadAction } from './state/views/load.action';
import { ListViewsSetActiveAction } from './state/views/set-active.action';
import { ListViewModel } from './state/views/view.model';

let idIndex = 0;

/**
 * @deprecated List builder and its features are deprecated. Use data manager instead. For more information, see https://developer.blackbaud.com/skyux/components/data-manager.
 */
@Component({
  selector: 'sky-list',
  template: '<ng-content></ng-content>',
  providers: [ListState, ListStateDispatcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyListComponent
  implements AfterContentInit, OnChanges, OnDestroy
{
  public id = `sky-list-cmp-${++idIndex}`;
  /**
   * Specifies the data to display. The list component requires this property or the
   * `dataProvider` property. For checklist or multiselect grids, each row requires an
   * `id` property to manage selected items with the `selectedIds` input and the
   * `selectedIdsChange` event. If you do not provide an `id`, the list automatically
   * generates one. To update data in your view outside of a `dataProvider`, you must use
   * an observable instead of a static array.
   */
  @Input()
  public data?: Array<any> | Observable<Array<any>> = [];

  /**
   * Specifies a data provider to obtain the data to display. The list component requires
   * this property or the `data` property. For lists that use `dataProvider` instead of `data`,
   * consumers are responsible for managing all `ListDataRequestModel` properties.
   * @default SkyListInMemoryDataProvider
   */
  @Input()
  public dataProvider?: ListDataProvider;

  /**
   * @internal
   */
  @Input()
  public defaultView?: ListViewComponent;

  /**
   * Specifies the total number of items for the initial data set when initialized. When
   * used in conjunction with `data` and `dataProvider`, it allows an initial data to be
   * set with the need to call the `dataProvider`.
   */
  @Input()
  public initialTotal?: number;

  /**
   * Specifies a set of IDs for the items to select in a checklist or multiselect grid.
   * The IDs match the `id` properties of the `data` objects. Items with IDs that are not
   * included are de-selected in the checklist or multiselect grid.
   */
  @Input()
  public selectedIds?: Array<string> | Observable<Array<string>>;

  /**
   * Specifies a set of fields to sort by. If array of fields then sorted by order of array.
   * For information about `ListSortFieldSelectorModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  @Input()
  public sortFields?:
    | ListSortFieldSelectorModel
    | Array<ListSortFieldSelectorModel>
    | Observable<Array<ListSortFieldSelectorModel>>
    | Observable<ListSortFieldSelectorModel>;

  /**
   * Specifies a set of filters to apply to list data.
   * These filters create a filter summary when the list includes the
   * [`sky-list-filter-summary`](https://developer.blackbaud.com/skyux/components/list/filters)
   * component.
   */
  @Input()
  public appliedFilters: Array<ListFilterModel> = [];

  /**
   * For list views that support item selection, emits the selected entries.
   */
  @Output()
  public selectedIdsChange = new EventEmitter<Map<string, boolean>>();

  /**
   * Emits the filters applied to the list.
   */
  @Output()
  public appliedFiltersChange = new EventEmitter<Array<ListFilterModel>>();

  /**
   * Specifies a function to apply as a global sort on the list.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('search')
  public searchFunction: (data: any, searchText: string) => boolean;

  private dataFirstLoad = false;

  @ContentChildren(ListViewComponent)
  private listViews: QueryList<ListViewComponent>;

  private lastSelectedIds: string[] = [];

  private lastFilters: ListFilterModel[] = [];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private state: ListState,
    private dispatcher: ListStateDispatcher,
    logger: SkyLogService
  ) {
    logger.deprecated('SkyListComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/components/data-manager',
      replacementRecommendation: 'Use data manager instead.',
    });
  }

  public ngAfterContentInit(): void {
    if (this.data && this.dataProvider && this.initialTotal) {
      this.dataFirstLoad = true;
    }

    if (this.listViews.length > 0) {
      const defaultView: ListViewComponent =
        this.defaultView === undefined
          ? this.listViews.first
          : this.defaultView;

      this.dispatcher.next(
        new ListViewsLoadAction(
          this.listViews.map((v) => new ListViewModel(v.id, v.label))
        )
      );

      // activate the default view
      this.dispatcher.next(new ListViewsSetActiveAction(defaultView.id));
    } else {
      return;
    }

    // set sort fields
    getValue(
      this.sortFields,
      (
        sortFields: ListSortFieldSelectorModel[] | ListSortFieldSelectorModel
      ) => {
        let sortArray: ListSortFieldSelectorModel[];
        if (!Array.isArray(sortFields) && sortFields) {
          sortArray = [sortFields];
        } else {
          sortArray = sortFields as ListSortFieldSelectorModel[];
        }
        this.dispatcher.next(
          new ListSortSetFieldSelectorsAction(sortArray || [])
        );
      }
    );

    this.displayedItems.subscribe((result) => {
      this.dispatcher.next(new ListItemsSetLoadingAction());
      this.dispatcher.next(
        new ListItemsLoadAction(result.items, true, true, result.count)
      );
    });

    // Watch for selection changes.
    this.state
      .pipe(
        observableMap((current) => current.selected),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged()
      )
      .subscribe((selected) => {
        // Update lastSelectedIds to help us retain user selections.
        const selectedIdsList: string[] = [];
        selected.item.selectedIdMap.forEach((value, key) => {
          if (value === true) {
            selectedIdsList.push(key);
          }
        });

        // If changes are distinct, emit selectedIdsChange.
        const distinctChanges = !this.arraysEqual(
          this.lastSelectedIds,
          selectedIdsList
        );
        if (this.selectedIdsChange.observers.length > 0 && distinctChanges) {
          this.selectedIdsChange.emit(selected.item.selectedIdMap);
        }

        this.lastSelectedIds = selectedIdsList;
      });

    if (this.appliedFiltersChange.observers.length > 0) {
      this.state
        .pipe(
          observableMap((current) => current.filters),
          takeUntil(this.ngUnsubscribe),
          skip(1)
        )
        .subscribe((filters) => {
          /**
           * We are doing this instead of a distinctUntilChange due to memory allocation issues
           * with the javascript array. To fix fully the array should be changed to an object in
           * a breaking change.
           */
          if (!this.arraysEqual(filters, this.lastFilters)) {
            this.lastFilters = filters.slice(0);
            this.appliedFiltersChange.emit(filters);
          }
        });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['appliedFilters'] &&
      changes['appliedFilters'].currentValue !==
        changes['appliedFilters'].previousValue
    ) {
      this.state.pipe(take(1)).subscribe((currentState) => {
        if (
          currentState.paging.pageNumber &&
          currentState.paging.pageNumber !== 1
        ) {
          this.dispatcher.next(new ListPagingSetPageNumberAction(Number(1)));
        }

        this.dispatcher.filtersUpdate(this.appliedFilters);
      });
    }
    if (changes['selectedIds']) {
      // Only send selection changes to dispatcher if changes are distinct.
      const newSelectedIds = changes['selectedIds'].currentValue;
      if (!this.arraysEqual(newSelectedIds, this.lastSelectedIds)) {
        this.dispatcher.setSelected(newSelectedIds, true, true);
      }
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public refreshDisplayedItems(): void {
    this.displayedItems.pipe(take(1)).subscribe((result) => {
      this.dispatcher.next(new ListItemsSetLoadingAction());
      this.dispatcher.next(
        new ListItemsLoadAction(result.items, true, true, result.count)
      );
    });
  }

  get displayedItems(): Observable<ListDataResponseModel> {
    if (!this.data && !this.dataProvider) {
      throw new Error('List requires data or dataProvider to be set.');
    }

    let data: any = this.data;
    if (!isObservable(data)) {
      data = observableOf(this.data);
    }

    if (!this.dataProvider) {
      this.dataProvider = new SkyListInMemoryDataProvider(
        data,
        this.searchFunction
      );
    }

    let selectedIds = this.selectedIds || observableOf([]);
    if (!isObservable(selectedIds)) {
      selectedIds = observableOf(selectedIds);
    }

    let selectedChanged = false;

    // This subject is used to cancel previous request to the list's data provider when a new change
    // to the list's state occurs. In a future breaking change this should be replaced or coupled
    // with adding a debounce time to the Observable which watches for state changes.
    const cancelLastRequest = new Subject<void>();

    return observableCombineLatest(
      [
        this.state.pipe(
          observableMap((s) => s.filters),
          distinctUntilChanged()
        ),
        this.state.pipe(
          observableMap((s) => s.search),
          distinctUntilChanged()
        ),
        this.state.pipe(
          observableMap((s) => s.sort.fieldSelectors),
          distinctUntilChanged()
        ),
        this.state.pipe(
          observableMap((s) => s.paging.itemsPerPage),
          distinctUntilChanged()
        ),
        this.state.pipe(
          observableMap((s) => s.paging.pageNumber),
          distinctUntilChanged()
        ),
        this.state.pipe(
          observableMap((s) => s.toolbar.disabled),
          distinctUntilChanged()
        ),
        selectedIds.pipe(
          distinctUntilChanged(),
          observableMap((selected) => {
            selectedChanged = true;
            return selected;
          })
        ),
        data.pipe(distinctUntilChanged()),
      ],
      (
        filters: ListFilterModel[],
        search: ListSearchModel,
        sortFieldSelectors: Array<ListSortFieldSelectorModel>,
        itemsPerPage: number,
        pageNumber: number,
        isToolbarDisabled: boolean,
        selected: Array<string>,
        itemsData: Array<any>
      ) => {
        cancelLastRequest.next();
        cancelLastRequest.complete();
        if (selectedChanged) {
          this.dispatcher.next(new ListSelectedSetLoadingAction());
          this.dispatcher.next(new ListSelectedLoadAction(selected));
          this.dispatcher.next(new ListSelectedSetLoadingAction(false));
          selectedChanged = false;
        }

        let response: Observable<ListDataResponseModel>;
        if (this.dataFirstLoad) {
          this.dataFirstLoad = false;
          const initialItems = itemsData.map(
            (d) =>
              new ListItemModel(d.id || `sky-list-item-model-${++idIndex}`, d)
          );
          response = observableOf(
            new ListDataResponseModel({
              count: this.initialTotal,
              items: initialItems,
            })
          ).pipe(takeUntil(cancelLastRequest));
        } else {
          response = this.dataProvider
            .get(
              new ListDataRequestModel({
                filters: filters,
                pageSize: itemsPerPage,
                pageNumber: pageNumber,
                search: search,
                sort: new ListSortModel({ fieldSelectors: sortFieldSelectors }),
                isToolbarDisabled: isToolbarDisabled,
              })
            )
            .pipe(takeUntil(cancelLastRequest));
        }

        return response;
      }
    ).pipe(
      takeUntil(this.ngUnsubscribe),

      // Retain user selections from previous state.
      // This is only necessary for grids component (based on item.isSelected).
      observableMap((response) => {
        return response.pipe(
          observableMap((listDataResponseModel) => {
            return new ListDataResponseModel({
              count: listDataResponseModel.count,
              items: this.getItemsAndRetainSelections(
                listDataResponseModel.items,
                this.lastSelectedIds
              ),
            });
          })
        );
      }),
      flatMap((value) => value)
    );
  }

  public get selectedItems(): Observable<Array<ListItemModel>> {
    return observableCombineLatest(
      this.state.pipe(
        observableMap((current) => current.items.items),
        distinctUntilChanged()
      ),
      this.state.pipe(
        observableMap((current) => current.selected),
        distinctUntilChanged()
      ),
      (items: Array<ListItemModel>, selected: AsyncItem<ListSelectedModel>) => {
        return items.filter((i) => selected.item.selectedIdMap.get(i.id));
      }
    ).pipe(takeUntil(this.ngUnsubscribe));
  }

  public get lastUpdate(): Observable<Date> {
    return this.state.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) =>
        s.items.lastUpdate ? new Date(s.items.lastUpdate) : undefined
      )
    );
  }

  public get views(): Array<ListViewComponent> {
    return this.listViews.toArray();
  }

  public get itemCount(): Observable<number> {
    return this.dataProvider.count();
  }

  private getItemsAndRetainSelections(
    newList: ListItemModel[],
    selectedIds: string[]
  ): ListItemModel[] {
    const updatedListModel = newList.slice();
    updatedListModel.forEach((item) => {
      item.isSelected = selectedIds.indexOf(item.id) > -1 ? true : false;
    });
    return updatedListModel;
  }

  private arraysEqual(arrayA: any[], arrayB: any[]): boolean {
    /* istanbul ignore next */
    if (arrayA === arrayB) {
      return true;
    }
    if (arrayA === undefined || arrayB === undefined) {
      return false;
    }
    if (arrayA.length !== arrayB.length) {
      return false;
    }
    for (let i = 0; i < arrayA.length; ++i) {
      if (arrayA[i] !== arrayB[i]) {
        return false;
      }
    }
    return true;
  }
}
