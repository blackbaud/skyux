import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';

import {
  ListViewComponent
} from '@skyux/list-builder';

import {
  AsyncItem,
  AsyncList
} from 'microedge-rxstate/dist';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListState,
  ListStateDispatcher,
  ListSelectedModel,
  ListFilterModel,
  ListSelectedSetItemSelectedAction,
  ListSelectedSetItemsSelectedAction,
  ListToolbarSetTypeAction
} from '@skyux/list-builder/modules/list/state';

import {
  getData
} from '@skyux/list-builder-common';

import {
  SkyCheckboxChange
} from '@skyux/forms';

import {
  ChecklistState,
  ChecklistStateDispatcher,
  ChecklistStateModel
} from './state';

import {
  ListViewChecklistItemsLoadAction
} from './state/items/actions';

import {
  ListViewChecklistItemModel
} from './state/items/item.model';

@Component({
  selector: 'sky-list-view-checklist',
  templateUrl: './list-view-checklist.component.html',
  styleUrls: ['./list-view-checklist.component.scss'],
  providers: [
    /* tslint:disable */
    { provide: ListViewComponent, useExisting: forwardRef(() => SkyListViewChecklistComponent) },
    /* tslint:enable */
    ChecklistState,
    ChecklistStateDispatcher,
    ChecklistStateModel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListViewChecklistComponent extends ListViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  set name(value: string) {
    this.viewName = value;
  }

  @Input()
  public search: (data: any, searchText: string) => boolean = this.searchFunction();

  /* tslint:disable */
  @Input('label')
  public labelFieldSelector: string = 'label';
  /* tslint:enable */

  @Input()
  public description: string = 'description';

  @Input()
  public set selectMode(value: string) {
    this._selectMode = value;

    if (this._selectMode === 'single') {
      this.showOnlySelected = false;
      this.dispatcher.toolbarShowMultiselectToolbar(false);
    } else {
      this.dispatcher.toolbarShowMultiselectToolbar(true);
    }

    this.reapplyFilter(this.showOnlySelected);
  }

  public get selectMode(): string {
    return this._selectMode;
  }

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

  private _showOnlySelected: boolean = false;

  constructor(
    state: ListState,
    private dispatcher: ListStateDispatcher,
    private checklistState: ChecklistState,
    private checklistDispatcher: ChecklistStateDispatcher
  ) {
    super(state, 'Checklist View');

    let lastUpdate: any;
    Observable.combineLatest(
      this.state.map(s => s.items).distinctUntilChanged(),
      (items: AsyncList<ListItemModel>) => {
        let dataChanged = lastUpdate === undefined || items.lastUpdate !== lastUpdate;
        lastUpdate = items.lastUpdate;
        let newItems = items.items.map(item => {
          return new ListViewChecklistItemModel(item.id, {
            label:
              this.labelFieldSelector ? getData(item.data, this.labelFieldSelector) : undefined,
            description:
              this.description ? getData(item.data, this.description) : undefined
          });
        });

        this.checklistDispatcher.next(
          new ListViewChecklistItemsLoadAction(newItems, true, dataChanged, items.count)
        );
      }
    )
      .takeUntil(this.ngUnsubscribe)
      .subscribe();

    this.state.map(t => t.selected)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((selectedItems: AsyncItem<ListSelectedModel>) => {
        this._selectedIdMap = selectedItems.item.selectedIdMap;
      });
  }

  public ngOnInit() {
    this.dispatcher.toolbarShowMultiselectToolbar(true);

    // If 'show-selected' filter is changed from multiselect toolbar (list-builder)
    // make sure the private variable _showOnlySelected stays in sync.
    this.state.map(t => t.filters)
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged(this.showSelectedValuesEqual)
      .subscribe((filters: ListFilterModel[]) => {
        const showSelectedFilter = filters.find((filter: ListFilterModel) => filter.name === 'show-selected');
        if (showSelectedFilter) {
          this._showOnlySelected = (showSelectedFilter.value === 'true');
        }
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['showOnlySelected'] &&
      changes['showOnlySelected'].currentValue !== changes['showOnlySelected'].previousValue) {
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
    this.state.map(state => state.items.items)
    .take(1)
    .subscribe(items => {
      this.dispatcher
        .next(new ListSelectedSetItemsSelectedAction(items.map(item => item.id), false, false));

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
    this.state.map(state => state.items.items)
    .take(1)
    .subscribe(items => {
      this.dispatcher
        .next(new ListSelectedSetItemsSelectedAction(items.map(item => item.id), true, false));

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

    let fieldSelectors: Array<string> = [];
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
    return this.checklistState.map(state => state.items.items);
  }

  public searchFunction() {
    return (data: any, searchText: string) => {
      if (this.labelFieldSelector !== undefined) {
        let label = getData(data, this.labelFieldSelector);
        /* tslint:disable:no-null-keyword */
        if (
          label !== undefined &&
          label !== null &&
          label.toString().toLowerCase().indexOf(searchText) !== -1
        ) {
          return true;
        }
        /* tslint:enable:no-null-keyword */
      }

      if (this.description !== undefined) {
        let description = getData(data, this.description);
        /* tslint:disable:no-null-keyword */
        if (
          description !== undefined &&
          description !== null &&
          description.toString().toLowerCase().indexOf(searchText) !== -1
        ) {
          return true;
        }
        /* tslint:enable:no-null-keyword */
      }

      return false;
    };
  }

  public itemSelected(id: string): Observable<boolean> {
    return this.state.map(state => state.selected.item.selectedIdMap.get(id));
  }

  public setItemSelection(item: ListItemModel, event: any) {
    this.dispatcher.next(new ListSelectedSetItemSelectedAction(item.id, event.checked));
  }

  public singleSelectRowClick(item: ListItemModel) {
    this.dispatcher.next(new ListSelectedSetItemsSelectedAction([item.id], true, true));
  }

  private getShowSelectedFilter(isSelected: boolean) {
    return new ListFilterModel({
      name: 'show-selected',
      value: isSelected.toString(),
      filterFunction: (model: ListItemModel, showOnlySelected: boolean) => {
        if (showOnlySelected.toString() !== false.toString()) {
          return this._selectedIdMap.get(model.id);
        }
      },
      defaultValue: false.toString()
    });
  }

  private reapplyFilter(isSelected: boolean) {
    let self = this;

    this.state.map(state => state.filters)
      .take(1)
      .subscribe((filters: ListFilterModel[]) => {
        filters = filters.filter(filter => filter.name !== 'show-selected');
        filters.push(self.getShowSelectedFilter(isSelected));
        this.dispatcher.filtersUpdate(filters);
      });
  }

  private showSelectedValuesEqual(prev: ListFilterModel[], next: ListFilterModel[]) {
    const prevShowSelectedFilter = prev.find(filter => filter.name === 'show-selected');
    const nextShowSelectedFilter = next.find(filter => filter.name === 'show-selected');

    if (prevShowSelectedFilter && nextShowSelectedFilter) {
      return prevShowSelectedFilter.value === nextShowSelectedFilter.value;
    }

    return true;
  }
}
