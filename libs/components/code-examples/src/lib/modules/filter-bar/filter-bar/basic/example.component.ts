import { Component } from '@angular/core';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarFilterModalConfig,
  SkyFilterBarFilterValue,
  SkyFilterBarModule,
} from '@skyux/filter-bar';

import { FilterModalComponent } from './filter-modal.component';
import { FILTER_SELECTION_VALUES } from './filter-selection-values';

/**
 * @title Filter bar basic example
 */
@Component({
  selector: 'app-filter-bar-basic-example',
  imports: [SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilterBarBasicExampleComponent {
  public appliedFilters: SkyFilterBarFilterItem[] | undefined;
  public selectedFilterIds: string[] | undefined;

  protected communityConnectionConfig: SkyFilterBarFilterModalConfig = {
    modalComponent: FilterModalComponent,
    modalSize: 'medium',
    additionalContext: this.#getFilterContext('community-connection'),
  };
  protected currentGradeConfig: SkyFilterBarFilterModalConfig = {
    modalComponent: FilterModalComponent,
    modalSize: 'medium',
    additionalContext: this.#getFilterContext('current-grade'),
  };
  protected enteringGradeConfig: SkyFilterBarFilterModalConfig = {
    modalComponent: FilterModalComponent,
    modalSize: 'medium',
    additionalContext: this.#getFilterContext('entering-grade'),
  };
  protected roleConfig: SkyFilterBarFilterModalConfig = {
    modalComponent: FilterModalComponent,
    modalSize: 'medium',
    additionalContext: this.#getFilterContext('role'),
  };
  protected staffAssignedConfig: SkyFilterBarFilterModalConfig = {
    modalComponent: FilterModalComponent,
    modalSize: 'medium',
    additionalContext: this.#getFilterContext('staff-assigned'),
  };

  constructor() {
    this.setInitialFilters();
  }

  public setInitialFilters(): void {
    this.selectedFilterIds = [
      'staff-assigned',
      'entering-grade',
      'current-grade',
    ];
  }

  #getFilterContext(filterId: string): {
    items: SkyFilterBarFilterValue[];
  } {
    return { items: FILTER_SELECTION_VALUES[filterId] };
  }
}
