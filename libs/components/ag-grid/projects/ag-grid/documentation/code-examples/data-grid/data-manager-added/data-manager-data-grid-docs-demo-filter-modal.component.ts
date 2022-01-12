import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-data-manager-data-grid-docs-demo-filter-modal',
  templateUrl: './data-manager-data-grid-docs-demo-filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagerDataGridDocsDemoFiltersModalComponent {
  public jobTitle: string = '';

  public hideSales: boolean = false;

  constructor(
    public context: SkyDataManagerFilterModalContext,
    public instance: SkyModalInstance,
    private changeDetector: ChangeDetectorRef
  ) {
    if (this.context.filterData && this.context.filterData.filters) {
      let filters = this.context.filterData.filters;
      this.jobTitle = filters.jobTitle?.name || 'any';
      this.hideSales = filters.hideSales || false;
    }
    this.changeDetector.markForCheck();
  }

  public applyFilters() {
    let result: SkyDataManagerFilterData = {};

    result.filtersApplied = this.jobTitle !== 'any' || this.hideSales;
    result.filters = {
      jobTitle: this.jobTitle,
      hideSales: this.hideSales,
    };
    this.changeDetector.markForCheck();

    this.instance.save(result);
  }

  public clearAllFilters() {
    this.hideSales = false;
    this.jobTitle = 'any';
    this.changeDetector.markForCheck();
  }

  public cancel() {
    this.instance.cancel();
  }
}
