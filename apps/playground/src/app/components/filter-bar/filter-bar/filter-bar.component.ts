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
                `{ ${filter.id}${filter.filterValue ? ': ' + (filter.filterValue.displayValue ?? filter.filterValue.value) : ''} }`,
            )
            .join(', ') +
          ' ]'
        );
      };
    }

    this.#_filters = value;

    console.log(value);
  }

  public selectedFilters: string[] | undefined;
  #selectedFilters: string[] | undefined;

  public filterModalConfig = { modalComponent: TestModalComponent };

  public labelText = 'filter 1';

  #_filters: SkyFilterBarFilterItem[] | undefined;

  #defaultFilters = [{ id: '2', filterValue: { value: 1, displayValue: '1' } }];

  constructor() {
    this.resetFilters();
  }

  public resetFilters(): void {
    this.filters = this.#defaultFilters;
    this.selectedFilters = ['1', '2', '3'];
    this.#selectedFilters = undefined;
  }

  public toggleSelectedFilters(): void {
    const selectedFilters = this.selectedFilters;
    this.selectedFilters = this.#selectedFilters;
    this.#selectedFilters = selectedFilters;
  }

  public toggleLabelText(): void {
    this.labelText = this.labelText === 'filter 1' ? 'Filter 1' : 'filter 1';
  }
}
