import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';

import { SkyListFilterInlineItemComponent } from './list-filter-inline-item.component';

import {
  ListFilterModel,
  ListPagingSetPageNumberAction,
  ListState,
  ListStateDispatcher
} from '../list/state';

import {
  SkyListFilterInlineModel
} from './list-filter-inline.model';

@Component({
  selector: 'sky-list-filter-inline',
  templateUrl: './list-filter-inline.component.html'
})
export class SkyListFilterInlineComponent implements AfterContentInit {
  public inlineFilters: Array<SkyListFilterInlineModel> = [];

  @ContentChildren(SkyListFilterInlineItemComponent)
  private filters: QueryList<SkyListFilterInlineItemComponent>;

  constructor(
    private dispatcher: ListStateDispatcher,
    private state: ListState
  ) {}

  public ngAfterContentInit() {
    this.inlineFilters = this.filters.map(filter => {
      return new SkyListFilterInlineModel({
        name: filter.name,
        filterFunction: filter.filterFunction,
        template: filter.template,
        value: filter.value,
        defaultValue: filter.defaultValue
      });
    });

    this.inlineFilters.forEach(filter => {
      filter.onChange.subscribe((value: any) => {
        this.applyFilters();
      });
    });

    this.dispatcher.filtersUpdate(this.getFilterModelFromInline(this.inlineFilters));
  }

  public applyFilters() {
    this.state.take(1).subscribe((currentState) => {
      if (currentState.paging.pageNumber && currentState.paging.pageNumber !== 1) {
        this.dispatcher.next(
          new ListPagingSetPageNumberAction(Number(1))
        );
      }

      this.dispatcher.filtersUpdate(this.getFilterModelFromInline(this.inlineFilters));
    });
  }

  private getFilterModelFromInline(inlineFilters: Array<SkyListFilterInlineModel>) {
    return inlineFilters.map((filter) => {
      return new ListFilterModel({
        name: filter.name,
        value: filter.value,
        filterFunction: filter.filterFunction,
        defaultValue: filter.defaultValue
      });
    });
  }
}
