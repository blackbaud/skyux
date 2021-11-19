import {
  AfterContentInit,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { map as observableMap, take } from 'rxjs/operators';

import { ListState } from '../list/state/list-state.state-node';

import { ListStateDispatcher } from '../list/state/list-state.rxstate';

import { ListFilterModel } from './filter.model';

/**
 * Creates a filter summary based on the
 * [list component's](https://developer.blackbaud.com/skyux/components/list/overview#list-properties)
 * `appliedFilters` property. Place this component within the
 * [`sky-list-toolbar`](https://developer.blackbaud.com/skyux/components/list/toolbar) component.
 */
@Component({
  selector: 'sky-list-filter-summary',
  templateUrl: './list-filter-summary.component.html',
})
export class SkyListFilterSummaryComponent implements AfterContentInit {
  /**
   * Emits a `ListFilterModel` when users select a summary item. A common use case is
   * to open a filter modal when this event is received.
   */
  @Output()
  public summaryItemClick = new EventEmitter<ListFilterModel>();

  public appliedFilters: Observable<Array<ListFilterModel>>;

  constructor(
    private state: ListState,
    private dispatcher: ListStateDispatcher
  ) {}

  public ngAfterContentInit() {
    // The setTimeout here is to ensure we avoid any ExpressionChangedAfterItHasBeenCheckedError issues.
    setTimeout(() => {
      this.appliedFilters = this.state.pipe(
        observableMap((state) => {
          return state.filters.filter((filter) => {
            return (
              filter.value !== '' &&
              filter.value !== undefined &&
              filter.value !== false &&
              filter.value !== filter.defaultValue
            );
          });
        })
      );
    });
  }

  public filterSummaryItemDismiss(index: number) {
    this.appliedFilters.pipe(take(1)).subscribe((filters) => {
      filters.splice(index, 1);
      this.dispatcher.filtersUpdate(filters.slice());
    });
  }

  public filterSummaryItemClick(item: ListFilterModel) {
    this.summaryItemClick.emit(item);
  }
}
