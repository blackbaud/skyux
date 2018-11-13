import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  SimpleChanges,
  OnChanges
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
  ListState,
  ListStateDispatcher,
  ListSelectedModel,
  ListFilterModel,
  ListItemModel,
  ListPagingSetPageNumberAction,
  ListSelectedSetItemSelectedAction,
  ListSelectedSetItemsSelectedAction,
  ListToolbarItemModel,
  ListToolbarSetTypeAction
} from '@skyux/list-builder/modules/list/state';

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

import {
  getData
} from '@skyux/list-builder/modules/list/helpers';

import { SkyCheckboxChange } from '@skyux/forms';

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
export class SkyListViewChecklistComponent extends ListViewComponent implements AfterViewInit, OnDestroy, OnChanges {
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
    this.updateActions();
  }

  public get selectMode(): string {
    return this._selectMode;
  }

  @Input()
  public showOnlySelected: boolean = false;

  @ViewChild('selectAllTemplate')
  private selectAllTemplate: TemplateRef<any>;

  @ViewChild('clearSelectionsTemplate')
  private clearSelectionsTemplate: TemplateRef<any>;

  @ViewChild('showSelectedTemplate')
  private showSelectedTemplate: TemplateRef<any>;

  private hasSelectToolbarItems = false;

  private ngUnsubscribe = new Subject();

  private _selectMode = 'multiple';

  private _selectedIdMap: Map<string, boolean> = new Map<string, boolean>();

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

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['showOnlySelected'] &&
      changes['showOnlySelected'].currentValue !== changes['showOnlySelected'].previousValue) {
      this.reapplyFilter(changes['showOnlySelected'].currentValue);
    }
  }

  public changeVisibleItems(change: SkyCheckboxChange) {
    this.showOnlySelected = change.checked;
    this.reapplyFilter(change.checked);
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

  public ngAfterViewInit() {
    this.updateActions();
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
    if (this.showOnlySelected) {
      this.reapplyFilter(this.showOnlySelected);
    }
  }

  public singleSelectRowClick(item: ListItemModel) {
    this.dispatcher.next(new ListSelectedSetItemsSelectedAction([item.id], true, true));
  }

  public clearSelections() {
    this.state.map(state => state.items.items)
      .take(1)
      .subscribe(items => {
        this.dispatcher
          .next(new ListSelectedSetItemsSelectedAction(items.map(item => item.id), false, false));

        if (this.showOnlySelected) {
          this.reapplyFilter(this.showOnlySelected);
        }
      });
  }

  public selectAll() {
    this.state.map(state => state.items.items)
      .take(1)
      .subscribe(items => {
        this.dispatcher
          .next(new ListSelectedSetItemsSelectedAction(items.map(item => item.id), true, false));
        if (this.showOnlySelected) {
          this.reapplyFilter(this.showOnlySelected);
        }
      });
  }

  private updateActions() {
    const selectAllId = 'select-all';
    const clearAllId = 'clear-all';
    const showSelectedId = 'show-selected';

    switch (this.selectMode) {
      case 'single':
        this.dispatcher.toolbarRemoveItems([selectAllId, clearAllId, showSelectedId]);
        this.showOnlySelected = false;
        this.reapplyFilter(false);
        this.hasSelectToolbarItems = false;
        break;
      default:
        if (!this.hasSelectToolbarItems) {
          this.dispatcher.toolbarAddItems([
            new ListToolbarItemModel(
              {
                id: 'select-all',
                template: this.selectAllTemplate,
                location: 'right',
                index: 500,
                view: this.id
              }
            ),
            new ListToolbarItemModel(
              {
                id: 'clear-all',
                template: this.clearSelectionsTemplate,
                location: 'right',
                index: 500,
                view: this.id
              }
            ),
            new ListToolbarItemModel(
              {
                id: showSelectedId,
                template: this.showSelectedTemplate,
                location: 'right',
                index: 500,
                view: this.id
              }
            )
          ]);

          this.reapplyFilter(this.showOnlySelected);
          this.hasSelectToolbarItems = true;
        }
        break;
    }
  }

  private disableToolbar(isDisabled: boolean): void {
    this.dispatcher.toolbarSetDisabled(isDisabled);
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

      // If "show selected" is checked and paging is enabled, go to page one.
      if (isSelected) {
        this.state.take(1).subscribe((currentState) => {
          if (currentState.paging.pageNumber && currentState.paging.pageNumber !== 1) {
            this.dispatcher.next(
              new ListPagingSetPageNumberAction(Number(1))
            );
          }
        });
      }
    this.disableToolbar(isSelected);
  }
}
