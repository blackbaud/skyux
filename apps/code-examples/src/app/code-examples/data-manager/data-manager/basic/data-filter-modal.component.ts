import { Component, OnInit, inject } from '@angular/core';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-data-filter-modal-form',
  templateUrl: './data-filter-modal.component.html',
})
export class DataManagerFiltersModalDemoComponent implements OnInit {
  public fruitType: string | undefined;

  public hideOrange: boolean | undefined;

  #context = inject(SkyDataManagerFilterModalContext);
  #instance = inject(SkyModalInstance);

  public ngOnInit(): void {
    if (this.#context.filterData && this.#context.filterData.filters) {
      const filters = this.#context.filterData.filters;
      this.fruitType = filters.type || 'any';
      this.hideOrange = filters.hideOrange || false;
    }
  }

  public applyFilters(): void {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied = this.fruitType !== 'any' || this.hideOrange;
    result.filters = {
      type: this.fruitType,
      hideOrange: this.hideOrange,
    };

    this.#instance.save(result);
  }

  public clearAllFilters(): void {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  public cancel(): void {
    this.#instance.cancel();
  }
}
