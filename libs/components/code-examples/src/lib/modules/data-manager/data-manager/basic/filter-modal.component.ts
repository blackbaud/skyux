import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Filters } from './filters';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
})
export class FilterModalComponent implements OnInit {
  protected fruitType: string | undefined;
  protected hideOrange: boolean | undefined;

  readonly #context = inject(SkyDataManagerFilterModalContext);
  readonly #instance = inject(SkyModalInstance);

  public ngOnInit(): void {
    if (this.#context.filterData?.filters) {
      const filters = this.#context.filterData.filters as Filters;

      this.fruitType = filters.type ?? 'any';
      this.hideOrange = filters.hideOrange ?? false;
    }
  }

  protected applyFilters(): void {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied = this.fruitType !== 'any' || this.hideOrange;
    result.filters = {
      type: this.fruitType,
      hideOrange: this.hideOrange,
    } satisfies Filters;

    this.#instance.save(result);
  }

  protected clearAllFilters(): void {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  protected cancel(): void {
    this.#instance.cancel();
  }
}
