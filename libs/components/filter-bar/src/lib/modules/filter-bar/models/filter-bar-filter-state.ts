import { SkyFilterState } from '@skyux/lists';

import { SkyFilterBarFilterItem } from './filter-bar-filter-item';

/**
 * Represents the complete filter state containing both applied filters and selected filter IDs.
 */
export interface SkyFilterBarFilterState extends SkyFilterState {
  /**
   * An array of filter items containing the IDs and values of the filters that have been applied.
   */
  appliedFilters?: SkyFilterBarFilterItem[];
}
