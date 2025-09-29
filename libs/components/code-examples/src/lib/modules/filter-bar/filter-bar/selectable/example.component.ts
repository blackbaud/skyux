import { Component, model } from '@angular/core';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarModule,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';

import { of } from 'rxjs';

import { ApplicationFeeFilterModalComponent } from './application-fee-filter-modal.component';
import { FILTER_SELECTION_VALUES } from './filter-selection-values';

/**
 * @title Filter bar with selectable filters example
 */
@Component({
  selector: 'app-filter-bar-selectable-example',
  imports: [SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilterBarSelectableExampleComponent {
  protected readonly appliedFilters = model<
    SkyFilterBarFilterItem[] | undefined
  >();
  protected readonly selectedFilterIds = model<string[] | undefined>([
    'staff-assigned',
    'entering-grade',
    'current-grade',
    'application-fee-received',
  ]);

  protected applicationFeeModal = ApplicationFeeFilterModalComponent;

  protected onSearchAsync(args: SkyFilterItemLookupSearchAsyncArgs): void {
    let results = FILTER_SELECTION_VALUES[args.filterId];
    const count = results.length;
    if (args.searchText) {
      results = results.filter((result) =>
        result.displayValue?.includes(args.searchText),
      );
    }
    args.result = of({ items: results, totalCount: count });
  }
}
