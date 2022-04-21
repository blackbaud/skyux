import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyCheckboxChange } from '@skyux/forms';
import {
  ListFilterModel,
  ListSelectedModel,
  ListSelectedSetItemSelectedAction,
  ListSelectedSetItemsSelectedAction,
  ListState,
  ListStateDispatcher,
  ListToolbarSetTypeAction,
  ListViewComponent,
} from '@skyux/list-builder';
import {
  AsyncItem,
  AsyncList,
  ListItemModel,
  getData,
} from '@skyux/list-builder-common';

import { Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map as observableMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { ChecklistStateModel } from './state/checklist-state.model';
import { ChecklistStateDispatcher } from './state/checklist-state.rxstate';
import { ChecklistState } from './state/checklist-state.state-node';
import { ListViewChecklistItemModel } from './state/items/item.model';
import { ListViewChecklistItemsLoadAction } from './state/items/load.action';

/**
 * @deprecated List builder view checklist and its features are deprecated. Use repeater instead. For more information, see https://developer.blackbaud.com/skyux/components/repeater.
 */
@Component({
  selector: 'sky-list-view-checklist',
  templateUrl: './list-view-checklist.component.html',
  styleUrls: ['./list-view-checklist.component.scss'],
  providers: [
    {
      provide: ListViewComponent,
      useExisting: forwardRef(() => SkyListViewChecklistComponent),
    },
    ChecklistState,
    ChecklistStateDispatcher,
    ChecklistStateModel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyListViewChecklistComponent
  extends ListViewComponent
  implements OnInit, OnDestroy, OnChanges
{
  /**
   * Specifies the name of the view.
   * @required
   */
  @Input()
  set name(value: string) {
    this.viewName = value;
  }

  /**
   * Specifies a search function to apply on the view data.
   * The default function searches view data on label, description,
   * and category if field selectors are defined for the given field.
   * @default default search function
   */
  @Input()
  public search: (data: any, searchText: string) => boolean =
    this.searchFunction();

  /**
   * Specifies the name of the label field selector.
   * @default "label"
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('label')
  public labelFieldSelector = 'label';

  /**
   * Specifies the name of the description field selector.
   * @default "description"
   */
  @Input()
  public description = 'description';

  /**
   * Specifies how many items users can select.
   * `"single"` allows users to select one item in the checklist, while `"multiple"`
   * allows users to select multiple items in the checklist.
   * @default "multiple"
   */
  @Input()
  public set selectMode(value: string) {
    this._selectMode = value;

    if (this.selectMode === 'multiple') {
      this.dispatcher.toolbarShowMultiselectToolbar(true);
    } else {
      this.showOnlySelected = false;
      this.dispatcher.toolbarShowMultiselectToolbar(false);
    }

    this.reapplyFilter(this.showOnlySelected);
  }

  public get selectMode(): string {
    return this._selectMode || 'multiple';
  }

  /**
   * Indicates whether to display selected items only.
   * @default false
   */
  @Input()
  public set showOnlySelected(value: boolean) {
    this._showOnlySelected = value;
  }

  public get showOnlySelected(): boolean {
    return this._showOnlySelected;
  }

  private ngUnsubscribe = new Subject();

  private _selectMode = 'multiple';

  private _selectedIdMap: Map<string, boolean> = new Map<string, boolean>();

  private _showOnlySelected = false;

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher,
    private checklistState: ChecklistState,
    private checklistDispatcher: ChecklistStateDispatcher,
    logger: SkyLogService
  ) {
    super(state, 'Checklist View');

    logger.deprecated('SkyListViewChecklistComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl: 'https://developer.blackbaud.com/skyux/components/repeater',
      replacementRecommendation: 'Use repeater instead.',
    });

    let lastUpdate: any;
    this.state
      .pipe(
        observableMap((s) => s.items),
        distinctUntilChanged(),
        observableMap((items: AsyncList<ListItemModel>) => {
          const dataChanged =
            lastUpdate === undefined || items.lastUpdate !== lastUpdate;
          lastUpdate = items.lastUpdate;
          const newItems = items.items.map((item) => {
            return new ListViewChecklistItemModel(item.id, {
              label: this.labelFieldSelector
                ? getData(item.data, this.labelFieldSelector)
                : undefined,
              description: this.description
                ? getData(item.data, this.description)
                : undefined,
            });
          });

          this.checklistDispatcher.next(
            new ListViewChecklistItemsLoadAction(
              newItems,
              true,
              dataChanged,
              items.count
            )
          );
        })
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();

    this.state
      .pipe(
        observableMap((t) => t.selected),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((selectedItems: AsyncItem<ListSelectedModel>) => {
        this._selectedIdMap = selectedItems.item.selectedIdMap;
      });
  }

  public ngOnInit() {
    if (this.selectMode === 'multiple') {
      this.dispatcher.toolbarShowMultiselectToolbar(true);
    }

    // If 'show-selected' filter is changed from multiselect toolbar (list-builder)
    // make sure the private variable _showOnlySelected stays in sync.
    this.state
      .pipe(
        observableMap((t) => t.filters),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(this.showSelectedValuesEqual)
      )
      .subscribe((filters: ListFilterModel[]) => {
        const showSelectedFilter = filters.find(
          (filter: ListFilterModel) => filter.name === 'show-selected'
        );
        if (showSelectedFilter) {
          this._showOnlySelected = showSelectedFilter.value === 'true';
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (
      changes['showOnlySelected'] &&
      changes['showOnlySelected'].currentValue !==
        changes['showOnlySelected'].previousValue
    ) {
      this.reapplyFilter(changes['showOnlySelected'].currentValue);
    }
  }

  /**
   * @deprecated since version 3.2.0
   * Multiselect toolbar will automatically show if select mode is set to 'multiple'.
   * These methods are no longer needed, as that functionality is part of list-builder.
   */
  public changeVisibleItems(change: SkyCheckboxChange) {
    this.showOnlySelected = change.checked;
  }

  /**
   * @deprecated since version 3.2.0
   * Multiselect toolbar will automatically show if select mode is set to 'multiple'.
   * These methods are no longer needed, as that functionality is part of list-builder.
   */
  public clearSelections() {
    this.state
      .pipe(
        observableMap((state) => state.items.items),
        take(1)
      )
      .subscribe((items) => {
        this.dispatcher.next(
          new ListSelectedSetItemsSelectedAction(
            items.map((item) => item.id),
            false,
            false
          )
        );

        /* istanbul ignore else */
        if (this.showOnlySelected) {
          this.reapplyFilter(this.showOnlySelected);
        }
      });
  }

  /**
   * @deprecated since version 3.2.0
   * Multiselect toolbar will automatically show if select mode is set to 'multiple'.
   * These methods are no longer needed, as that functionality is part of list-builder.
   */
  public selectAll() {
    this.state
      .pipe(
        observableMap((state) => state.items.items),
        take(1)
      )
      .subscribe((items) => {
        this.dispatcher.next(
          new ListSelectedSetItemsSelectedAction(
            items.map((item) => item.id),
            true,
            false
          )
        );

        /* istanbul ignore else */
        if (this.showOnlySelected) {
          this.reapplyFilter(this.showOnlySelected);
        }
      });
  }

  public onViewActive() {
    if (this.search !== undefined) {
      this.dispatcher.searchSetFunctions([this.search]);
    }

    const fieldSelectors: Array<string> = [];
    if (this.labelFieldSelector) {
      fieldSelectors.push(this.labelFieldSelector);
    }

    if (this.description) {
      fieldSelectors.push(this.description);
    }

    this.dispatcher.searchSetFieldSelectors(fieldSelectors);

    this.dispatcher.next(new ListToolbarSetTypeAction('search'));
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get items(): Observable<ListViewChecklistItemModel[]> {
    return this.checklistState.pipe(
      observableMap((state) => state.items.items)
    );
  }

  public searchFunction() {
    return (data: any, searchText: string) => {
      if (this.labelFieldSelector !== undefined) {
        const label = getData(data, this.labelFieldSelector);
        if (
          label !== undefined &&
          label !== null &&
          label.toString().toLowerCase().indexOf(searchText) !== -1
        ) {
          return true;
        }
      }

      if (this.description !== undefined) {
        const description = getData(data, this.description);
        if (
          description !== undefined &&
          description !== null &&
          description.toString().toLowerCase().indexOf(searchText) !== -1
        ) {
          return true;
        }
      }

      return false;
    };
  }

  public itemSelected(id: string): Observable<boolean> {
    return this.state.pipe(
      observableMap((state) => state.selected.item.selectedIdMap.get(id))
    );
  }

  public setItemSelection(item: ListItemModel, event: any) {
    this.dispatcher.next(
      new ListSelectedSetItemSelectedAction(item.id, event.checked)
    );
  }

  public singleSelectRowClick(item: ListItemModel) {
    this.dispatcher.next(
      new ListSelectedSetItemsSelectedAction([item.id], true, true)
    );
  }

  private getShowSelectedFilter(isSelected: boolean) {
    return new ListFilterModel({
      name: 'show-selected',
      value: isSelected.toString(),
      filterFunction: (model: ListItemModel, showOnlySelected: boolean) => {
        /* istanbul ignore else */
        if (showOnlySelected.toString() !== false.toString()) {
          return this._selectedIdMap.get(model.id);
        }
      },
      defaultValue: false.toString(),
    });
  }

  private reapplyFilter(isSelected: boolean) {
    this.state
      .pipe(
        observableMap((state) => state.filters),
        take(1)
      )
      .subscribe((filters: ListFilterModel[]) => {
        filters = filters.filter((filter) => filter.name !== 'show-selected');
        filters.push(this.getShowSelectedFilter(isSelected));
        this.dispatcher.filtersUpdate(filters);
      });
  }

  private showSelectedValuesEqual(
    prev: ListFilterModel[],
    next: ListFilterModel[]
  ) {
    const prevShowSelectedFilter = prev.find(
      (filter) => filter.name === 'show-selected'
    );
    const nextShowSelectedFilter = next.find(
      (filter) => filter.name === 'show-selected'
    );

    if (prevShowSelectedFilter && nextShowSelectedFilter) {
      return prevShowSelectedFilter.value === nextShowSelectedFilter.value;
    }

    return true;
  }
}
