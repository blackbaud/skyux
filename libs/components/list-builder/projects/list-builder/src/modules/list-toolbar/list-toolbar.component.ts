import {
  combineLatest as observableCombineLatest,
  Observable,
  Subject,
} from 'rxjs';

import {
  map as observableMap,
  takeUntil,
  take,
  distinctUntilChanged,
} from 'rxjs/operators';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { getValue } from '@skyux/list-builder-common';

import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';

import { SkySearchComponent } from '@skyux/lookup';

import { ListToolbarModel } from '../list/state/toolbar/toolbar.model';

import { ListToolbarItemModel } from '../list/state/toolbar/toolbar-item.model';

import { ListToolbarSetTypeAction } from '../list/state/toolbar/set-type.action';

import { ListState } from '../list/state/list-state.state-node';

import { ListStateDispatcher } from '../list/state/list-state.rxstate';

import { ListSortLabelModel } from '../list/state/sort/label.model';

import { ListFilterModel } from '../list-filters/filter.model';

import { ListPagingSetPageNumberAction } from '../list/state/paging/set-page-number.action';

import { SkyListFilterInlineComponent } from '../list-filters/list-filter-inline.component';

import { SkyListFilterSummaryComponent } from '../list-filters/list-filter-summary.component';

import { SkyListToolbarItemComponent } from './list-toolbar-item.component';

import { SkyListToolbarSortComponent } from './list-toolbar-sort.component';

import { SkyListToolbarViewActionsComponent } from './list-toolbar-view-actions.component';

import { ListToolbarConfigSetSearchEnabledAction } from './state/config/set-search-enabled.action';

import { ListToolbarConfigSetSortSelectorEnabledAction } from './state/config/set-sort-selector-enabled.action';

import { ListToolbarState } from './state/toolbar-state.state-node';

import { ListToolbarStateDispatcher } from './state/toolbar-state.rxstate';

import { ListToolbarStateModel } from './state/toolbar-state.model';

let nextId = 0;

/**
 * Displays a toolbar for a SKY UX-themed list of data.
 */
@Component({
  selector: 'sky-list-toolbar',
  templateUrl: './list-toolbar.component.html',
  styleUrls: ['./list-toolbar.component.scss'],
  providers: [
    ListToolbarState,
    ListToolbarStateDispatcher,
    ListToolbarStateModel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyListToolbarComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  /**
   * Indicates whether to use the in-memory search.
   * Setting this to `false` will allow consumers to run their own searches remotely,
   * and push new values to the list component by updating the `data` property.
   * @default true
   * @internal
   */
  @Input()
  public set inMemorySearchEnabled(value: boolean) {
    this._inMemorySearchEnabled = value;
  }

  public get inMemorySearchEnabled(): boolean {
    if (this._inMemorySearchEnabled === undefined) {
      return true;
    }
    return this._inMemorySearchEnabled;
  }

  /**
   * Specifies placeholder text for the search bar that the list toolbar creates with
   * a [search component](https://developer.blackbaud.com/skyux/components/search).
   * @default 'Find in this list'
   */
  @Input()
  public placeholder: string;

  /**
   * Indicates whether to enable the search bar.
   * @default true
   */
  @Input()
  public searchEnabled: boolean | Observable<boolean>;

  @ViewChild(SkySearchComponent, {
    read: SkySearchComponent,
    static: false,
  })
  public searchComponent: SkySearchComponent;

  /**
   * Indicates whether to enable the sort selector.
   * @default false
   */
  @Input()
  public sortSelectorEnabled: boolean | Observable<boolean>;

  /**
   * Display the search bar in the standard position or in a separate section.
   * To highlight the search bar in a section above all other toolbar items,
   * set this property to `search`.
   * @default 'standard'
   */
  @Input()
  public toolbarType: string = 'standard';

  /**
   * Specifies a text string to search with.
   */
  @Input()
  public searchText: string | Observable<string>;

  public get isFilterBarDisplayed(): boolean {
    return (
      !this.isToolbarDisabled &&
      this.hasInlineFilters &&
      this.inlineFilterBarExpanded
    );
  }

  public get filterButtonAriaControls(): string {
    return this.isFilterBarDisplayed ? this.listFilterInlineId : undefined;
  }

  public sortSelectors: Observable<Array<any>>;
  public searchTextInput: Observable<string>;
  public view: Observable<string>;
  public leftTemplates: ListToolbarItemModel[];
  public centerTemplates: ListToolbarItemModel[];
  public rightTemplates: ListToolbarItemModel[];
  public type: Observable<string>;
  public isSearchEnabled: Observable<boolean>;
  public isToolbarDisabled: boolean = false;
  public isMultiselectEnabled: Observable<boolean>;
  public isSortSelectorEnabled: Observable<boolean>;
  public appliedFilters: Observable<Array<ListFilterModel>>;
  public hasAppliedFilters: Observable<boolean>;
  public showFilterSummary: boolean;
  public hasInlineFilters: boolean;
  public inlineFilterBarExpanded: boolean = false;
  public hasAdditionalToolbarSection = false;
  public hasViewActions = false;

  public filterButtonId: string = `sky-list-toolbar-filter-button-${++nextId}`;
  public listFilterInlineId: string = `sky-list-toolbar-filter-inline-${++nextId}`;

  /**
   * Fires when users submit a search.
   * @internal
   */
  public searchApplied: Subject<string> = new Subject<string>();

  @ContentChildren(SkyListToolbarItemComponent)
  private toolbarItems: QueryList<SkyListToolbarItemComponent>;

  @ContentChildren(SkyListToolbarSortComponent)
  private toolbarSorts: QueryList<SkyListToolbarSortComponent>;

  @ContentChildren(SkyListFilterSummaryComponent)
  private filterSummary: QueryList<SkyListFilterSummaryComponent>;

  @ContentChildren(SkyListFilterInlineComponent)
  private inlineFilter: QueryList<SkyListFilterInlineComponent>;

  @ContentChildren(SkyListToolbarViewActionsComponent)
  private viewActions: QueryList<SkyListToolbarViewActionsComponent>;

  @ViewChild('search', {
    read: TemplateRef,
    static: true,
  })
  private searchTemplate: TemplateRef<any>;

  @ViewChild('sortSelector', {
    read: TemplateRef,
    static: true,
  })
  private sortSelectorTemplate: TemplateRef<any>;

  @ViewChild('inlineFilterButton', {
    read: TemplateRef,
    static: true,
  })
  private inlineFilterButtonTemplate: TemplateRef<any>;

  private customItemIds: string[] = [];
  private hasSortSelectors: boolean = false;
  private inlineFiltersItemToolbarIndex: number = 5000;
  private sortSelectorItemToolbarIndex: number = 6000;
  private ngUnsubscribe = new Subject();

  private _inMemorySearchEnabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private state: ListState,
    private dispatcher: ListStateDispatcher,
    private toolbarState: ListToolbarState,
    public toolbarDispatcher: ListToolbarStateDispatcher
  ) {}

  public ngOnInit() {
    this.dispatcher.toolbarExists(true);

    getValue(this.searchText, (searchText: string) => {
      this.updateSearchText(searchText);
    });

    getValue(this.searchEnabled, (searchEnabled: boolean) => {
      this.toolbarDispatcher.next(
        new ListToolbarConfigSetSearchEnabledAction(
          searchEnabled === undefined ? true : searchEnabled
        )
      );
    });

    getValue(this.toolbarType, (type: string) => {
      this.dispatcher.next(new ListToolbarSetTypeAction(this.toolbarType));
    });

    getValue(this.sortSelectorEnabled, (sortSelectorEnabled: any) => {
      this.toolbarDispatcher.next(
        new ListToolbarConfigSetSortSelectorEnabledAction(
          sortSelectorEnabled === undefined ? true : sortSelectorEnabled
        )
      );
    });

    this.sortSelectors = this.getSortSelectors();

    // Initialize the sort toolbar item if necessary
    this.sortSelectors
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
      .subscribe((currentSort) => {
        if (currentSort.length > 0 && !this.hasSortSelectors) {
          this.hasSortSelectors = true;
          this.dispatcher.toolbarAddItems([
            new ListToolbarItemModel({
              id: 'sort-selector',
              template: this.sortSelectorTemplate,
              location: 'left',
              index: this.sortSelectorItemToolbarIndex,
            }),
          ]);
        } else if (currentSort.length < 1 && this.hasSortSelectors) {
          this.hasSortSelectors = false;
          this.dispatcher.toolbarRemoveItems(['sort-selector']);
        }
      });

    this.searchTextInput = this.state.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) => s.search.searchText),
      distinctUntilChanged()
    );

    this.view = this.state.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) => s.views.active),
      distinctUntilChanged()
    );

    this.watchTemplates();

    this.type = this.state.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((state) => state.toolbar.type),
      distinctUntilChanged()
    );

    this.type.pipe(takeUntil(this.ngUnsubscribe)).subscribe((toolbarType) => {
      if (toolbarType === 'search') {
        this.dispatcher.toolbarRemoveItems(['search']);
      } else {
        this.dispatcher.toolbarAddItems([
          new ListToolbarItemModel({
            id: 'search',
            template: this.searchTemplate,
            location: 'right',
          }),
        ]);
      }
    });

    this.isSearchEnabled = this.toolbarState.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) => s.config),
      distinctUntilChanged(),
      observableMap((c) => c.searchEnabled)
    );

    this.state
      .pipe(
        observableMap((s) => s.toolbar),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        observableMap((c) => c.disabled)
      )
      .subscribe((isDisabled) => (this.isToolbarDisabled = isDisabled));

    this.isSortSelectorEnabled = this.toolbarState.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) => s.config),
      distinctUntilChanged(),
      observableMap((c) => c.sortSelectorEnabled)
    );

    this.isMultiselectEnabled = this.state.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) => s.toolbar),
      distinctUntilChanged(),
      observableMap((t) => t.showMultiselectToolbar)
    );

    this.hasAppliedFilters = this.state.pipe(
      takeUntil(this.ngUnsubscribe),
      observableMap((s) => s.filters),
      distinctUntilChanged(),
      observableMap((filters) => {
        let activeFilters = filters.filter((f) => {
          return (
            f.value !== '' &&
            f.value !== undefined &&
            f.value !== false &&
            f.value !== f.defaultValue
          );
        });
        return activeFilters.length > 0;
      })
    );

    this.state.pipe(takeUntil(this.ngUnsubscribe)).subscribe((current: any) => {
      this.hasAdditionalToolbarSection = current.toolbar.items.length > 0;
      this.changeDetector.detectChanges();
    });
  }

  public ngAfterContentInit() {
    // Inject custom toolbar items.
    this.toolbarItems.forEach((toolbarItem) => {
      this.dispatcher.toolbarAddItems([new ListToolbarItemModel(toolbarItem)]);

      this.customItemIds.push(toolbarItem.id);
    });

    this.toolbarItems.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newItems: QueryList<SkyListToolbarItemComponent>) => {
        newItems.forEach((item) => {
          if (this.customItemIds.indexOf(item.id) < 0) {
            this.dispatcher.toolbarAddItems([new ListToolbarItemModel(item)]);

            this.customItemIds.push(item.id);
          }
        });

        const itemsToRemove: string[] = [];

        this.customItemIds.forEach((itemId, index) => {
          if (!newItems.find((item) => item.id === itemId)) {
            itemsToRemove.push(itemId);
            this.customItemIds.splice(index, 1);
          }
        });

        this.dispatcher.toolbarRemoveItems(itemsToRemove);
      });

    const sortModels = this.toolbarSorts.map(
      (sort) =>
        new ListSortLabelModel({
          text: sort.label,
          fieldSelector: sort.field,
          fieldType: sort.type,
          global: true,
          descending: sort.descending,
        })
    );

    this.dispatcher.sortSetGlobal(sortModels);

    // Add inline filters.
    this.showFilterSummary = this.filterSummary.length > 0;
    this.hasInlineFilters = this.inlineFilter.length > 0;

    if (this.hasInlineFilters) {
      this.dispatcher.toolbarAddItems([
        new ListToolbarItemModel({
          template: this.inlineFilterButtonTemplate,
          location: 'left',
          index: this.inlineFiltersItemToolbarIndex,
        }),
      ]);
    }

    // Check for view actions
    this.hasViewActions = this.viewActions.length > 0;
  }

  public ngOnDestroy() {
    this.searchApplied.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public setSort(sort: ListSortLabelModel): void {
    this.state.pipe(take(1)).subscribe((currentState) => {
      if (
        currentState.paging.pageNumber &&
        currentState.paging.pageNumber !== 1
      ) {
        this.dispatcher.next(new ListPagingSetPageNumberAction(Number(1)));
      }

      this.dispatcher.sortSetFieldSelectors([
        { fieldSelector: sort.fieldSelector, descending: sort.descending },
      ]);
    });
  }

  public inlineFilterButtonClick() {
    this.inlineFilterBarExpanded = !this.inlineFilterBarExpanded;
  }

  public updateSearchText(searchText: string) {
    this.searchApplied.next(searchText);
    if (this.inMemorySearchEnabled) {
      this.state.pipe(take(1)).subscribe((currentState) => {
        if (
          currentState.paging.pageNumber &&
          currentState.paging.pageNumber !== 1
        ) {
          this.dispatcher.next(new ListPagingSetPageNumberAction(Number(1)));
        }

        this.dispatcher.searchSetText(searchText);
      });
    }
  }

  private itemIsInView(itemView: string, activeView: string) {
    return itemView === undefined || itemView === activeView;
  }

  private getSortSelectors() {
    return observableCombineLatest(
      this.state.pipe(
        observableMap((s) => s.sort.available),
        distinctUntilChanged()
      ),
      this.state.pipe(
        observableMap((s) => s.sort.global),
        distinctUntilChanged()
      ),
      this.state.pipe(
        observableMap((s) => s.sort.fieldSelectors),
        distinctUntilChanged()
      ),
      (
        available: Array<ListSortLabelModel>,
        global: Array<ListSortLabelModel>,
        fieldSelectors: Array<ListSortFieldSelectorModel>
      ) => {
        // Get sorts that are in the global that are not in the available
        let sorts = global.filter(
          (g) =>
            available.filter((a) => a.fieldSelector === g.fieldSelector)
              .length === 0
        );

        let resultSortSelectors = [...sorts, ...available].map((sortLabels) => {
          let fs = fieldSelectors.filter((f) => {
            return (
              f.fieldSelector === sortLabels.fieldSelector &&
              f.descending === sortLabels.descending
            );
          });
          let selected = false;
          if (fs.length > 0) {
            selected = true;
          }

          return {
            sort: sortLabels,
            selected: selected,
          };
        });

        return resultSortSelectors;
      }
    ).pipe(takeUntil(this.ngUnsubscribe));
  }

  private watchTemplates() {
    observableCombineLatest(
      this.state.pipe(
        observableMap((s) => s.toolbar),
        distinctUntilChanged()
      ),
      this.view.pipe(distinctUntilChanged()),
      (toolbar: ListToolbarModel, view: string) => {
        const items = toolbar.items.filter((i: ListToolbarItemModel) => {
          return this.itemIsInView(i.view, view);
        });

        const templates: any = {};

        items.forEach((item: ListToolbarItemModel) => {
          templates[item.location] = templates[item.location] || [];
          templates[item.location].push(item);
        });

        return templates;
      }
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.leftTemplates = value.left;
        this.centerTemplates = value.center;
        this.rightTemplates = value.right;
        this.changeDetector.markForCheck();
      });
  }
}
