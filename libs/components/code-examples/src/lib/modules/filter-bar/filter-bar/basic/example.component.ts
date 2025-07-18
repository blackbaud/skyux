import { Component } from '@angular/core';
import { SkyFilterBarFilterItem, SkyFilterBarModule } from '@skyux/filter-bar';
import {
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
} from '@skyux/lookup';

import { Observable, of } from 'rxjs';

import { FILTER_SEARCH_RESULTS } from './filter-search-results';

/**
 * @title Filter bar basic example
 */
@Component({
  selector: 'app-filter-bar-basic-example',
  imports: [SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilterBarBasicExampleComponent {
  public filters: SkyFilterBarFilterItem[] | undefined;

  #filters: SkyFilterBarFilterItem[] = [
    {
      name: 'Community connection',
      id: 'community-connection',
      filterSelectionModalConfig: {
        title: 'Select community connection',
        descriptorProperty: 'description',
        idProperty: 'value',
        searchAsync: this.#getFilterSearchFn('community-connection'),
        selectMode: 'multiple',
        selectionDescriptor: 'community connections',
      },
    },
    {
      name: 'Current grade',
      id: 'current-grade',
      filterSelectionModalConfig: {
        title: 'Select current grade',
        descriptorProperty: 'description',
        idProperty: 'value',
        searchAsync: this.#getFilterSearchFn('current-grade'),
        selectMode: 'multiple',
        selectionDescriptor: 'current grade',
      },
    },
    {
      name: 'Entering grade',
      id: 'entering-grade',
      filterSelectionModalConfig: {
        title: 'Select entering grade',
        descriptorProperty: 'description',
        idProperty: 'value',
        searchAsync: this.#getFilterSearchFn('entering-grade'),
        selectMode: 'multiple',
        selectionDescriptor: 'entering grade',
      },
    },
    {
      name: 'Role',
      id: 'role',
      filterSelectionModalConfig: {
        title: 'Select role',
        descriptorProperty: 'description',
        idProperty: 'value',
        searchAsync: this.#getFilterSearchFn('role'),
        selectMode: 'multiple',
        selectionDescriptor: 'role',
      },
    },
    {
      name: 'Staff assigned',
      id: 'staff-assigned',
      filterSelectionModalConfig: {
        title: 'Select staff assigned',
        descriptorProperty: 'description',
        idProperty: 'value',
        searchAsync: this.#getFilterSearchFn('staff-assigned'),
        selectMode: 'multiple',
        selectionDescriptor: 'staff assigned',
      },
    },
  ];

  constructor() {
    this.setInitialFilters();
  }

  public setInitialFilters(): void {
    this.filters = [
      {
        name: 'Staff assigned',
        id: 'staff-assigned',
        filterSelectionModalConfig: {
          title: 'Select staff assigned',
          descriptorProperty: 'description',
          idProperty: 'value',
          searchAsync: this.#getFilterSearchFn('staff-assigned'),
          selectMode: 'multiple',
          selectionDescriptor: 'staff assigned',
        },
      },
      {
        name: 'Entering grade',
        id: 'entering-grade',
        filterValue: {
          value: [{ value: 'grade-2', description: '2nd grade' }],
          displayValue: '2nd grade',
        },
        filterSelectionModalConfig: {
          title: 'Select entering grade',
          descriptorProperty: 'description',
          idProperty: 'value',
          searchAsync: this.#getFilterSearchFn('entering-grade'),
          selectMode: 'multiple',
          selectionDescriptor: 'entering grade',
        },
      },
      {
        name: 'Current grade',
        id: 'current-grade',
        filterSelectionModalConfig: {
          title: 'Select current grade',
          descriptorProperty: 'description',
          idProperty: 'value',
          searchAsync: this.#getFilterSearchFn('current-grade'),
          selectMode: 'multiple',
          selectionDescriptor: 'current grade',
        },
      },
    ];
  }

  public searchFn = (
    args: SkySelectionModalSearchArgs,
  ): Observable<SkySelectionModalSearchResult> => {
    let retVal = this.#filters;
    if (args?.searchText) {
      retVal = this.#filters.filter((filter) =>
        filter.name.includes(args.searchText),
      );
    }
    return of({ items: retVal, totalCount: retVal.length });
  };

  #getFilterSearchFn(
    filterId: string,
  ): (
    args: SkySelectionModalSearchArgs,
  ) => Observable<SkySelectionModalSearchResult> {
    const searchResults = FILTER_SEARCH_RESULTS[filterId];
    return (args: SkySelectionModalSearchArgs) => {
      let results = searchResults;
      if (args.searchText) {
        results = searchResults.filter((searchResult) =>
          searchResult.description.includes(args.searchText),
        );
      }
      return of({ items: results, totalCount: searchResults.length });
    };
  }
}
