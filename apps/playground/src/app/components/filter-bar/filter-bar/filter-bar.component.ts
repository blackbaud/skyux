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
    if (value) {
      value.toString = (): string => {
        return (
          '[' +
          this.filters
            .map(
              (filter) =>
                `{ ${filter.filterId}${filter.filterValue ? ': ' + (filter.filterValue.displayValue ?? filter.filterValue.value) : ''} }`,
            )
            .join(', ') +
          ' ]'
        );
      };
    }

    this.#_filters = value;

    console.log(value);
  }

  public selectedFilterIds: string[] | undefined;
  #selectedFilterIds: string[] | undefined;

  public filterModalConfig = { modalComponent: TestModalComponent };

  public labelText = 'filter 1';

  #_filters: SkyFilterBarFilterItem[] | undefined;

  #defaultFilters: SkyFilterBarFilterItem[] = [
    { filterId: '2', filterValue: { value: 1, displayValue: '1' } },
  ];

  constructor() {
    this.resetFilters();
  }

  public resetFilters(): void {
    this.filters = this.#defaultFilters;
    this.selectedFilterIds = ['1', '2', '3'];
    this.#selectedFilterIds = undefined;
  }

  public toggleSelectedFilters(): void {
    const selectedFilters = this.selectedFilterIds;
    this.selectedFilterIds = this.#selectedFilterIds;
    this.#selectedFilterIds = selectedFilters;
  }

  public toggleLabelText(): void {
    this.labelText = this.labelText === 'filter 1' ? 'Filter 1' : 'filter 1';
  }
}
