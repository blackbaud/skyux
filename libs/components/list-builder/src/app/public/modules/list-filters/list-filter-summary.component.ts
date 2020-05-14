import {
  Component,
  AfterContentInit,
  Output,
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  map as observableMap,
  take
} from 'rxjs/operators';

import {
  ListState
} from '../list/state/list-state.state-node';

import {
  ListStateDispatcher
} from '../list/state/list-state.rxstate';

import {
  ListFilterModel
} from '../list/state/filters/filter.model';

@Component({
  selector: 'sky-list-filter-summary',
  templateUrl: './list-filter-summary.component.html'
})
export class SkyListFilterSummaryComponent implements AfterContentInit {

  @Output()
  public summaryItemClick = new EventEmitter<ListFilterModel>();

  public appliedFilters: Observable<Array<ListFilterModel>>;

  constructor(
    private state: ListState,
    private dispatcher: ListStateDispatcher
  ) {}

  public ngAfterContentInit() {
    this.appliedFilters = this.state.pipe(observableMap((state) => {
      return state.filters;
    }));
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
