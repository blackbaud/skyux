import { Component, inject } from '@angular/core';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-home-filter',
  templateUrl: './home-filter.component.html',
  imports: [SkyModalModule, SkyRepeaterModule],
})
export class HomeFiltersModalDemoComponent {
  public readonly context = inject(SkyDataManagerFilterModalContext);
  public readonly instance = inject(SkyModalInstance);

  public libraries: { name: string; isSelected: boolean }[];

  constructor() {
    if (this.context.filterData && this.context.filterData.filters) {
      const filters = this.context.filterData.filters;
      // Deep clone the array so that cancelling is done without issue
      this.libraries = JSON.parse(JSON.stringify(filters.libraries));
    }
  }

  public applyFilters(): void {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied =
      this.libraries.findIndex((lib) => lib.isSelected) >= 0;
    result.filters = {
      libraries: this.libraries,
    };

    this.instance.save(result);
  }

  public clearAllFilters(): void {
    this.libraries.forEach((lib) => (lib.isSelected = false));
  }

  public cancel(): void {
    this.instance.cancel();
  }
}
