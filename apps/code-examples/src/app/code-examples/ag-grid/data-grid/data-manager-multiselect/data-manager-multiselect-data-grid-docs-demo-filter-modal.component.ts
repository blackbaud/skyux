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

@Component({
  standalone: true,
  selector: 'app-data-manager-multiselect-data-grid-docs-demo-filter-modal',
  templateUrl:
    './data-manager-multiselect-data-grid-docs-demo-filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SkyCheckboxModule, SkyIdModule, SkyModalModule],
})
export class DataManagerMultiselectDataGridDemoFiltersModalComponent {
  protected hideSales = false;
  protected jobTitle = '';

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #context = inject(SkyDataManagerFilterModalContext);
  readonly #instance = inject(SkyModalInstance);

  constructor() {
    if (this.#context.filterData && this.#context.filterData.filters) {
      const filters = this.#context.filterData.filters;

      this.jobTitle = filters.jobTitle || 'any';
      this.hideSales = filters.hideSales || false;
    }

    this.#changeDetectorRef.markForCheck();
  }

  protected applyFilters(): void {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied = this.jobTitle !== 'any' || this.hideSales;
    result.filters = {
      jobTitle: this.jobTitle,
      hideSales: this.hideSales,
    };

    this.#changeDetectorRef.markForCheck();
    this.#instance.save(result);
  }

  protected clearAllFilters(): void {
    this.hideSales = false;
    this.jobTitle = 'any';
    this.#changeDetectorRef.markForCheck();
  }

  protected cancel(): void {
    this.#instance.cancel();
  }
}
