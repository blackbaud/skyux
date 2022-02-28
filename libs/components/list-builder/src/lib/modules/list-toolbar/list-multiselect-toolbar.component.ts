import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SkyCheckboxChange } from '@skyux/forms';
import { ListItemModel } from '@skyux/list-builder-common';

import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map as observableMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { ListFilterModel } from '../list-filters/filter.model';
import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import { ListState } from '../list/state/list-state.state-node';
import { ListPagingSetPageNumberAction } from '../list/state/paging/set-page-number.action';
import { ListSelectedModel } from '../list/state/selected/selected.model';

let uniqueId = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-list-multiselect-toolbar',
  templateUrl: './list-multiselect-toolbar.component.html',
  styleUrls: ['./list-multiselect-toolbar.component.scss'],
})
export class SkyListMultiselectToolbarComponent implements OnInit, OnDestroy {
  @Input()
  public showOnlySelected = false;

  public multiselectToolbarId = `sky-list-multiselect-toolbar-${uniqueId++}`;

  private selectedIdMap = new Map<string, boolean>();

  private ngUnsubscribe = new Subject();

  constructor(
    private state: ListState,
    private dispatcher: ListStateDispatcher
  ) {}

  public ngOnInit(): void {
    this.state
      .pipe(
        observableMap((t) => t.selected.item),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(this.selectedMapEqual)
      )
      .subscribe((model: ListSelectedModel) => {
        this.selectedIdMap = model.selectedIdMap;

        if (this.showOnlySelected) {
          this.reapplyFilter(true);
        }
      });

    // If 'show-selected' filter is programatically set from a child component (e.g. checkilst),
    // make sure the checked state of the 'show-selected' checkbox stays in sync.
    this.state
      .pipe(
        observableMap((t) => t.filters),
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(this.showSelectedValuesEqual)
      )
      .subscribe((filters: ListFilterModel[]) => {
        const showSelectedFilter = filters.find(
          (filter) => filter.name === 'show-selected'
        );
        if (showSelectedFilter) {
          this.showOnlySelected = showSelectedFilter.value === 'true';
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public selectAll(): void {
    this.state
      .pipe(
        observableMap((state) => state.items.items),
        take(1)
      )
      .subscribe((items) => {
        this.dispatcher.setSelected(
          items.map((item) => item.id),
          true
        );
        if (this.showOnlySelected) {
          this.reapplyFilter(this.showOnlySelected);
        }
      });
  }

  public clearSelections(): void {
    this.state
      .pipe(
        observableMap((state) => state.items.items),
        take(1)
      )
      .subscribe((items) => {
        this.dispatcher.setSelected(
          items.map((item) => item.id),
          false
        );
        if (this.showOnlySelected) {
          this.reapplyFilter(this.showOnlySelected);
        }
      });
  }

  public changeVisibleItems(change: SkyCheckboxChange): void {
    this.showOnlySelected = change.checked;
    this.reapplyFilter(change.checked);
  }

  private reapplyFilter(isSelected: boolean): void {
    let self = this;

    this.state
      .pipe(
        observableMap((state) => state.filters),
        take(1)
      )
      .subscribe((filters: ListFilterModel[]) => {
        filters = filters.filter((filter) => filter.name !== 'show-selected');
        filters.push(self.getShowSelectedFilter(isSelected));
        this.dispatcher.filtersUpdate(filters);
      });

    // If "show selected" is checked and paging is enabled, go to page one.
    /* istanbul ignore else */
    if (isSelected) {
      this.state.pipe(take(1)).subscribe((currentState) => {
        if (
          currentState.paging.pageNumber &&
          currentState.paging.pageNumber !== 1
        ) {
          this.dispatcher.next(new ListPagingSetPageNumberAction(Number(1)));
        }
      });
    }
    this.dispatcher.toolbarSetDisabled(isSelected);
  }

  private getShowSelectedFilter(isSelected: boolean): ListFilterModel {
    return new ListFilterModel({
      name: 'show-selected',
      value: isSelected.toString(),
      filterFunction: (model: ListItemModel, showOnlySelected: boolean) => {
        /* istanbul ignore else */
        if (showOnlySelected.toString() !== false.toString()) {
          return this.selectedIdMap.get(model.id);
        }
      },
      defaultValue: false.toString(),
    });
  }

  private showSelectedValuesEqual(
    prev: ListFilterModel[],
    next: ListFilterModel[]
  ): boolean {
    const prevShowSelectedFilter = prev.find(
      (filter) => filter.name === 'show-selected'
    );
    const nextShowSelectedFilter = next.find(
      (filter) => filter.name === 'show-selected'
    );

    // Both undefined.
    if (!prevShowSelectedFilter && !nextShowSelectedFilter) {
      return true;
    }

    // Only one undefined.
    if (
      (prevShowSelectedFilter && !nextShowSelectedFilter) ||
      (!prevShowSelectedFilter && nextShowSelectedFilter)
    ) {
      return false;
    }

    // Defined, but with different "value".
    return prevShowSelectedFilter.value === nextShowSelectedFilter.value;
  }

  private selectedMapEqual(
    prev: ListSelectedModel,
    next: ListSelectedModel
  ): boolean {
    if (prev.selectedIdMap.size !== next.selectedIdMap.size) {
      return false;
    }

    for (let i = 0; i < next.selectedIdMap.size; i++) {
      const key = Array.from(next.selectedIdMap.keys())[i];
      const value = next.selectedIdMap.get(key);
      /* istanbul ignore next */
      if (value !== prev.selectedIdMap.get(key)) {
        return false;
      }
    }

    return true;
  }
}
