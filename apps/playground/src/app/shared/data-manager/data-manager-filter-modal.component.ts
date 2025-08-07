import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-data-manager-filter-modal',
  templateUrl: './data-manager-filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SkyCheckboxModule, SkyModalModule],
})
export class DataManagerFiltersModalComponent {
  public jobTitle = '';

  public hideSales = false;

  constructor(
    public context: SkyDataManagerFilterModalContext,
    public instance: SkyModalInstance,
    private changeDetector: ChangeDetectorRef,
  ) {
    if (this.context.filterData && this.context.filterData.filters) {
      const filters = this.context.filterData.filters;
      this.jobTitle = filters.jobTitle || 'any';
      this.hideSales = filters.hideSales || false;
    }
    this.changeDetector.markForCheck();
  }

  public applyFilters(): void {
    const result: SkyDataManagerFilterData = {};

    result.filtersApplied = this.jobTitle !== 'any' || this.hideSales;
    result.filters = {
      jobTitle: this.jobTitle,
      hideSales: this.hideSales,
    };
    this.changeDetector.markForCheck();

    this.instance.save(result);
  }

  public clearAllFilters(): void {
    this.hideSales = false;
    this.jobTitle = 'any';
    this.changeDetector.markForCheck();
  }

  public cancel(): void {
    this.instance.cancel();
  }
}
