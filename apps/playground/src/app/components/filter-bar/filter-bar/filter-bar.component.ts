import { Component } from '@angular/core';
import { SkyFilterBarFilterItem } from '@skyux/filter-bar';

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
              `{ ${filter.id}${filter.filterValue ? ': ' + (filter.filterValue.displayValue ?? filter.filterValue.value) : ''} }`,
          )
          .join(', ') +
        ' ]'
      );
    };

    this.#_filters = value;

    console.log(value);
  }

  public summaryItems = [
    {
      value: 10000000,
      label: 'Raised',
      valueFormat: { format: 'currency', truncate: true },
      helpPopoverContent: 'test content',
    },
    { value: 10, label: 'Elements', helpPopoverContent: 'test content2' },
  ];

  public filterModalConfig = { modalComponent: TestModalComponent };

  #_filters: SkyFilterBarFilterItem[] | undefined = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];

  constructor() {
    this.resetFilters();
  }

  public resetFilters(): void {
    this.filters = [{ id: '1' }, { id: '2' }, { id: '3' }];
  }
}
