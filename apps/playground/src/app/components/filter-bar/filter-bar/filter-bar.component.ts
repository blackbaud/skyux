import { Component } from '@angular/core';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarSummaryItem,
} from '@skyux/filter-bar';
import { SkySelectionModalSearchArgs } from '@skyux/lookup';

import { of } from 'rxjs';

import { TestModalComponent } from './test-modal.component';

@Component({
  selector: 'app-filter-bar',
  styleUrls: ['./filter-bar.component.scss'],
  templateUrl: './filter-bar.component.html',
  standalone: false,
})
export class FilterBarComponent {
  public get filters(): SkyFilterBarFilterItem[] | undefined {
    return this.#_filters;
  }

  public set filters(value: SkyFilterBarFilterItem[] | undefined) {
    value.toString = (): string => {
      return (
        '[' +
        this.filters
          .map(
            (filter) =>
              `{ ${filter.name}${filter.filterValue ? ': ' + (filter.filterValue.displayValue ?? filter.filterValue.value) : ''} }`,
          )
          .join(', ') +
        ' ]'
      );
    };

    this.#_filters = value;

    console.log(value);
  }

  public items: SkyFilterBarSummaryItem[] = [
    {
      value: 10000000,
      label: 'Raised',
      valueFormat: { format: 'currency', truncate: true },
      helpPopoverContent: 'test content',
    },
    { value: 10, label: 'Elements', helpPopoverContent: 'test content2' },
  ];

  #_filters: SkyFilterBarFilterItem[] | undefined;

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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public searchFn = (args: SkySelectionModalSearchArgs) => {
    let retVal = this.#filters;
    if (args?.searchText) {
      retVal = this.#filters.filter((filter) =>
        filter.name.includes(args.searchText),
      );
    }
    return of({ items: retVal, totalCount: retVal.length });
  };
}
