import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Filters } from './filters';

@Component({
  standalone: true,
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SkyCheckboxModule, SkyIdModule, SkyModalModule],
})
export class FilterModalComponent {
  protected hideSales = false;
  protected jobTitle = '';

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #context = inject(SkyDataManagerFilterModalContext);
  readonly #instance = inject(SkyModalInstance);

  constructor() {
    if (this.#context.filterData?.filters) {
      const filters = this.#context.filterData.filters as Filters;

      this.jobTitle = filters.jobTitle ?? 'any';
      this.hideSales = filters.hideSales ?? false;
    }

    this.#changeDetector.markForCheck();
  }

  protected applyFilters(): void {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied = this.jobTitle !== 'any' || this.hideSales;
    result.filters = {
      jobTitle: this.jobTitle,
      hideSales: this.hideSales,
    } satisfies Filters;

    this.#changeDetector.markForCheck();
    this.#instance.save(result);
  }

  protected clearAllFilters(): void {
    this.hideSales = false;
    this.jobTitle = 'any';
    this.#changeDetector.markForCheck();
  }

  protected cancel(): void {
    this.#instance.cancel();
  }
}
