import { Component } from '@angular/core';
import { SkyFilterBarFilterItem, SkyFilterBarModule } from '@skyux/filter-bar';
import {
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
} from '@skyux/lookup';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-filter-bar-basic-example',
  imports: [SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilterBarBasicExampleComponent {
  public filters: SkyFilterBarFilterItem[] | undefined;

  #filters: SkyFilterBarFilterItem[] = [
    {
      name: 'filter 1',
      id: '1',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 2',
      id: '2',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 3',
      id: '3',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 4',
      id: '4',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 5',
      id: '5',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 6',
      id: '6',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 7',
      id: '7',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
    {
      name: 'filter 8',
      id: '8',
      filterModalConfig: { modalComponent: TestModalComponent },
    },
  ];

  constructor() {
    this.resetFilters();
  }

  public resetFilters(): void {
    this.filters = [
      {
        name: 'filter 1',
        id: '1',
        filterModalConfig: { modalComponent: TestModalComponent },
      },
      {
        name: 'filter 2',
        id: '2',
        filterModalConfig: { modalComponent: TestModalComponent },
      },
      {
        name: 'filter 3',
        id: '3',
        filterModalConfig: { modalComponent: TestModalComponent },
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
}
