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
  public libraries: string[];

  constructor(
    public context: SkyDataManagerFilterModalContext,
    public instance: SkyModalInstance
  ) {
    console.log(this.context);
    if (this.context.filterData && this.context.filterData.filters) {
      const filters = this.context.filterData.filters;
      this.libraries = filters.libraries;
    }
  }

  public applyFilters() {
    const result: SkyDataManagerFilterData = {};

    // result.filtersApplied = this.fruitType !== 'any' || this.hideOrange;
    result.filters = {
      libraries: this.libraries,
    };

    this.instance.save(result);
  }

  public clearAllFilters() {
    // this.hideOrange = false;
    // this.fruitType = 'any';
  }

  public cancel() {
    this.instance.cancel();
  }
}
