import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyDataManagerFilterData,
  SkyDataManagerFilterModalContext,
} from '@skyux/data-manager';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-demo-filter-modal-form',
  templateUrl: './data-filter-modal.component.html',
  imports: [FormsModule, SkyCheckboxModule, SkyInputBoxModule, SkyModalModule],
})
export class SkyDataManagerFiltersModalVisualComponent {
  public fruitType: string;

  public hideOrange: boolean;

  constructor(
    public context: SkyDataManagerFilterModalContext,
    public instance: SkyModalInstance,
  ) {
    if (this.context.filterData && this.context.filterData.filters) {
      const filters = this.context.filterData.filters;
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

    this.instance.save(result);
  }

  public clearAllFilters(): void {
    this.hideOrange = false;
    this.fruitType = 'any';
  }

  public cancel(): void {
    this.instance.cancel();
  }
}
