import { Component, model } from '@angular/core';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarModule,
  SkyFilterItemModalOpenedArgs,
} from '@skyux/filter-bar';

import { of } from 'rxjs';

import { FilterItems } from './filter-items';
import { CommunityConnectionFilterModalComponent } from './filter-modals/community-connection-filter-modal.component';
import { CurrentGradeFilterModalComponent } from './filter-modals/current-grade-filter-modal.component';
import { EnteringGradeFilterModalComponent } from './filter-modals/entering-grade-filter-modal.component';
import { RoleFilterModalComponent } from './filter-modals/role-filter-modal.component';
import { StaffAssignedFilterModalComponent } from './filter-modals/staff-assigned-filter-modal.component';
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
  protected readonly appliedFilters = model<
    SkyFilterBarFilterItem[] | undefined
  >();
  protected readonly selectedFilterIds = model<string[] | undefined>([
    'staff-assigned',
    'entering-grade',
    'current-grade',
  ]);

  protected communityConnectionModal = CommunityConnectionFilterModalComponent;
  protected currentGradeModal = CurrentGradeFilterModalComponent;
  protected enteringGradeModal = EnteringGradeFilterModalComponent;
  protected roleModal = RoleFilterModalComponent;
  protected staffAssignedModal = StaffAssignedFilterModalComponent;

  protected onModalOpened(
    args: SkyFilterItemModalOpenedArgs<FilterItems>,
  ): void {
    args.data = of({ items: FILTER_SELECTION_VALUES[args.filterId] });
  }
}
