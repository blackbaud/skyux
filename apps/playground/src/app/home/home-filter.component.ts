import { Component } from '@angular/core';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-home-filter',
  templateUrl: './home-filter.component.html',
})
export class HomeFiltersModalDemoComponent {
  public libraries: { name: string; isSelected: boolean }[];

  constructor(
    public context: SkyDataManagerFilterModalContext,
    public instance: SkyModalInstance
  ) {
    console.log(this.context);
    if (this.context.filterData && this.context.filterData.filters) {
      const filters = this.context.filterData.filters;
      // Deep clone the array so that cancelling is done without issue
      this.libraries = JSON.parse(JSON.stringify(filters.libraries));
    }
  }

  public applyFilters() {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied =
      this.libraries.findIndex((lib) => lib.isSelected) >= 0;
    result.filters = {
      libraries: this.libraries,
    };

    this.instance.save(result);
  }

  public clearAllFilters() {
    this.libraries.forEach((lib) => (lib.isSelected = false));
  }

  public cancel() {
    this.instance.cancel();
  }
}
